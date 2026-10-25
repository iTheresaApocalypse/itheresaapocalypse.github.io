// Run with: node scripts/test_homepage_stars.cjs
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const source = fs.readFileSync(path.join(__dirname, "../assets/js/github-stars.js"), "utf8");
const repository = "THUSI-Lab/GameScaling";
const cacheKey = "gamescaling-github-stars-v1";
const flush = () => new Promise(setImmediate);

function page({ cache = null, responses = [400, 401], storageBlocked = false } = {}) {
  let now = Date.parse("2026-10-25T15:59:00Z"); // 23:59 Beijing.
  let calls = 0, timerId = 0;
  const timers = new Map(), events = {}, storage = new Map();
  if (cache) storage.set(cacheKey, JSON.stringify(cache));
  class Clock extends Date {
    constructor(...args) { super(...(args.length ? args : [now])); }
    static now() { return now; }
  }
  const badge = {
    textContent: "★ 369",
    getAttribute(name) { return name === "data-updated-at" ? "2026-10-18T00:00:00Z" : "https://example.org/snapshot.json"; },
    setAttribute() {}
  };
  const document = {
    visibilityState: "visible",
    querySelector: () => badge,
    addEventListener: (name, fn) => { events[name] = fn; }
  };
  vm.runInNewContext(source, {
    Date: Clock, document,
    window: { addEventListener: (name, fn) => { events[name] = fn; } },
    setTimeout(fn, delay) { const id = ++timerId; timers.set(id, { fn, delay }); return id; },
    clearTimeout(id) { timers.delete(id); },
    localStorage: {
      getItem(key) { if (storageBlocked) throw Error("blocked"); return storage.get(key) || null; },
      setItem(key, value) { if (storageBlocked) throw Error("blocked"); storage.set(key, value); }
    },
    fetch() {
      const response = responses[calls++];
      if (response instanceof Error || response === undefined) return Promise.reject(Error("offline"));
      const payload = typeof response === "number" ? { full_name: repository, stargazers_count: response } : response;
      return Promise.resolve({ ok: true, json: () => Promise.resolve(payload) });
    }
  });
  return { badge, events, timers, storage, calls: () => calls, advance: ms => { now += ms; } };
}

(async () => {
  let p = page(); await flush();
  assert.equal(p.badge.textContent, "★ 400");
  assert.equal([...p.timers.values()][0].delay, 61000);
  p.events.pageshow(); p.events.visibilitychange(); await flush();
  assert.equal(p.calls(), 1, "same-day resume must not refetch");
  const timer = [...p.timers.values()][0];
  p.advance(61000); timer.fn(); await flush();
  assert.equal(p.calls(), 2, "an open page refreshes after Beijing midnight");
  assert.equal(p.badge.textContent, "★ 401");
  assert.equal(JSON.parse(p.storage.get(cacheKey)).checked_day, "2026-10-26");

  p = page({ cache: { repository, stars: 412, updated_at: "2026-10-25T12:00:00Z", checked_day: "2026-10-25" } });
  await flush(); assert.equal(p.calls(), 0); assert.equal(p.badge.textContent, "★ 412");

  p = page(); await flush(); p.advance(2 * 86400000); p.events.visibilitychange(); await flush();
  assert.equal(p.calls(), 2, "a suspended tab refreshes when revisited on a later day");

  p = page({ responses: [0], storageBlocked: true }); await flush(); p.events.pageshow(); await flush();
  assert.equal(p.badge.textContent, "★ 0"); assert.equal(p.calls(), 1);

  p = page({
    cache: { repository, stars: 499, updated_at: "2026-10-24T12:00:00Z", checked_day: "2026-10-24" },
    responses: [Error("offline"), { repository, stars: 369, updated_at: "2026-10-18T00:00:00Z" }]
  });
  await flush(); assert.equal(p.badge.textContent, "★ 499", "an old fallback must not overwrite a newer cache");

  p = page({ responses: [{ full_name: "someone/else", stargazers_count: 999 }] }); await flush();
  assert.equal(p.badge.textContent, "★ 369", "invalid responses retain the rendered count");
  console.log("Passed: midnight, same-day cache, suspended tabs, blocked storage, zero stars, and failure retention.");
})().catch(error => { console.error(error); process.exitCode = 1; });
