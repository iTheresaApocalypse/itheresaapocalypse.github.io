// Run with: node scripts/test_homepage_downloads.cjs
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const source = fs.readFileSync(path.join(__dirname, "../assets/js/huggingface-downloads.js"), "utf8");
const initial = JSON.parse(fs.readFileSync(path.join(__dirname, "../_data/huggingface_downloads.json"), "utf8"));
const flush = () => new Promise(setImmediate);
const signature = key => initial[key].kind + ":" + [...initial[key].repositories].sort().join(",");
const cacheKey = key => "hf-lifetime-downloads-v1-" + key;
const models = (count = 10) => initial.gamescaling.repositories.map(id => ({ id, downloadsAllTime: count, downloads: 999 }));
const vsi = (count = 30) => ({ id: initial.vsi_super_wild.repositories[0], downloadsAllTime: count, downloads: 999 });
const dataset = (count = 20) => ({ id: initial.video_arena.repositories[0], downloadsAllTime: count, downloads: 999 });

function page({ responses = [models(), dataset(), vsi(), models(11), dataset(21), vsi(31)], cache = {}, storageBlocked = false } = {}) {
  let now = Date.parse("2026-10-26T15:59:00Z");
  let timerId = 0;
  const timers = new Map(), events = {}, storage = new Map(Object.entries(cache)), calls = [];
  class Clock extends Date {
    constructor(...args) { super(...(args.length ? args : [now])); }
    static now() { return now; }
  }
  const badges = Object.entries(initial).map(([key, value]) => ({
    textContent: "↓ " + value.total,
    attributes: {
      "data-hf-downloads": key,
      "data-hf-kind": value.kind,
      "data-hf-repositories": value.repositories.join(","),
      "data-hf-updated-at": "2026-10-25T00:00:00Z"
    },
    getAttribute(name) { return this.attributes[name]; },
    setAttribute(name, value) { this.attributes[name] = value; }
  }));
  vm.runInNewContext(source, {
    Date: Clock, AbortController,
    document: {
      visibilityState: "visible", querySelectorAll: () => badges,
      addEventListener: (name, fn) => { events[name] = fn; }
    },
    window: { addEventListener: (name, fn) => { events[name] = fn; } },
    setTimeout(fn, delay) { const id = ++timerId; timers.set(id, { fn, delay }); return id; },
    clearTimeout(id) { timers.delete(id); },
    localStorage: {
      getItem(key) { if (storageBlocked) throw Error("blocked"); return storage.get(key) || null; },
      setItem(key, value) { if (storageBlocked) throw Error("blocked"); storage.set(key, value); }
    },
    fetch(url) {
      const response = responses[calls.length]; calls.push(url);
      if (response instanceof Error || response === undefined) return Promise.reject(Error("offline"));
      return Promise.resolve({ ok: true, json: () => Promise.resolve(response) });
    }
  });
  return { badges, events, timers, storage, calls, advance: ms => { now += ms; } };
}

(async () => {
  let p = page();
  p.events.pageshow(); // Duplicate events during in-flight requests.
  await flush();
  assert.deepEqual(p.badges.map(b => b.textContent), ["↓ 90", "↓ 20", "↓ 30"]);
  assert.equal(p.calls.length, 3, "each metric fetches once despite concurrent resume events");
  assert(p.calls.every(url => url.includes("downloadsAllTime")));
  p.events.pageshow(); p.events.visibilitychange(); await flush();
  assert.equal(p.calls.length, 3, "no repeated same-day requests");
  const midnight = [...p.timers.values()][0];
  assert.equal(midnight.delay, 61000);
  p.advance(61000); midnight.fn(); await flush();
  assert.deepEqual(p.badges.map(b => b.textContent), ["↓ 99", "↓ 21", "↓ 31"]);
  assert.equal(JSON.parse(p.storage.get(cacheKey("gamescaling"))).checked_day, "2026-10-27");

  const cached = { signature: signature("gamescaling"), total: 1234, updated_at: "2026-10-26T10:00:00Z", checked_day: "2026-10-26" };
  p = page({ cache: { [cacheKey("gamescaling")]: JSON.stringify(cached) }, responses: [dataset(), vsi()] });
  await flush();
  assert.equal(p.calls.length, 2, "each metric has an independent daily cache");
  assert.equal(p.badges[0].textContent, "↓ 1,234");

  p = page(); await flush(); p.advance(2 * 86400000); p.events.visibilitychange(); await flush();
  assert.equal(p.calls.length, 6, "returning after missed days reads the latest lifetime total");

  p = page({ responses: [models(0), dataset(0), vsi(0)], storageBlocked: true });
  await flush(); p.events.pageshow(); await flush();
  assert.deepEqual(p.badges.map(b => b.textContent), ["↓ 0", "↓ 0", "↓ 0"]);
  assert.equal(p.calls.length, 3);

  for (const invalid of [models().slice(1), [...models(), models()[0]], models().map(m => ({ id: m.id, downloads: 999 })), models(-1), models(Number.MAX_SAFE_INTEGER)]) {
    p = page({ responses: [invalid, dataset(), vsi()] }); await flush();
    assert.equal(p.badges[0].textContent, "↓ " + initial.gamescaling.total, "incomplete or invalid totals retain fallback");
    assert.equal(p.badges[1].textContent, "↓ 20", "one failure does not block the other project");
    assert.equal(p.badges[2].textContent, "↓ 30", "VSI uses its own dataset endpoint");
  }
  p = page({ responses: [[...models().map(m => m.id === "THUSI-Lab/GameScaling" ? { ...m, downloadsAllTime: 100 } : m), { id: "THUSI-Lab/Unrelated", downloadsAllTime: 9999 }], dataset()] });
  await flush(); assert.equal(p.badges[0].textContent, "↓ 180", "include the main repository and eight checkpoints, excluding unrelated repos");

  p = page({ cache: { [cacheKey("gamescaling")]: JSON.stringify({ ...cached, checked_day: "2026-10-25" }) }, responses: [Error("offline"), Error("offline"), Error("offline")] });
  await flush(); assert.equal(p.badges[0].textContent, "↓ 1,234", "API failures retain successful cache");

  p = page({ cache: { [cacheKey("gamescaling")]: JSON.stringify({ ...cached, signature: "wrong" }) } });
  await flush(); assert.equal(p.badges[0].textContent, "↓ 90", "a changed repository set invalidates the cache");
  console.log("Passed: lifetime totals, complete main-and-checkpoint sum, midnight refresh, independent daily caches, suspended tabs, zero, blocked storage, and failure retention.");
})().catch(error => { console.error(error); process.exitCode = 1; });
