// Run with: node scripts/test_homepage_stars.cjs
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const source = fs.readFileSync(path.join(__dirname, "../assets/js/github-stars.js"), "utf8");
const initial = Object.values(JSON.parse(fs.readFileSync(path.join(__dirname, "../_data/github_stars.json"), "utf8")));
const flush = () => new Promise(setImmediate);
const cacheKey = repo => "github-stars-v2-" + repo;
const responsesFor = count => initial.map((m, i) => ({ full_name: m.repository, stargazers_count: count === 0 ? 0 : count + i }));

function page({ responses = [...responsesFor(100), ...responsesFor(200)], cache = {}, storageBlocked = false } = {}) {
  let now = Date.parse("2026-10-26T15:59:00Z"), timerId = 0;
  const timers = new Map(), events = {}, storage = new Map(Object.entries(cache)), calls = [];
  class Clock extends Date {
    constructor(...args) { super(...(args.length ? args : [now])); }
    static now() { return now; }
  }
  const badges = initial.map(m => ({
    textContent: "★ " + m.stars,
    getAttribute(name) { return name === "data-updated-at" ? "2026-10-25T00:00:00Z" : m.repository; },
    setAttribute() {}
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
  assert.equal(initial.length, 6, "all selected papers have a repository");
  let p = page(); p.events.pageshow(); await flush();
  assert.deepEqual(p.badges.map(b => b.textContent), initial.map((_, i) => "★ " + (100 + i)));
  assert.equal(p.calls.length, 6);
  assert(p.calls.every((url, i) => url.endsWith(initial[i].repository)));
  p.events.pageshow(); p.events.visibilitychange(); await flush();
  assert.equal(p.calls.length, 6, "same-day events must not refetch any repository");
  const midnight = [...p.timers.values()][0];
  assert.equal(midnight.delay, 61000);
  p.advance(61000); midnight.fn(); await flush();
  assert.equal(p.calls.length, 12);
  assert.deepEqual(p.badges.map(b => b.textContent), initial.map((_, i) => "★ " + (200 + i)));

  const cached = { repository: initial[0].repository, stars: 1234, updated_at: "2026-10-26T12:00:00Z", checked_day: "2026-10-26" };
  p = page({ cache: { [cacheKey(initial[0].repository)]: JSON.stringify(cached) }, responses: responsesFor(100).slice(1) });
  await flush(); assert.equal(p.calls.length, 5); assert.equal(p.badges[0].textContent, "★ 1,234");
  assert.equal(p.badges[1].textContent, "★ 101", "one cached repository does not suppress others");

  p = page(); await flush(); p.advance(2 * 86400000); p.events.visibilitychange(); await flush();
  assert.equal(p.calls.length, 12, "suspended tabs refresh all repositories on return");

  p = page({ responses: responsesFor(0), storageBlocked: true });
  await flush(); p.events.pageshow(); await flush();
  assert(p.badges.every(b => b.textContent === "★ 0")); assert.equal(p.calls.length, 6);

  p = page({ cache: { [cacheKey(initial[0].repository)]: JSON.stringify({ ...cached, checked_day: "2026-10-25" }) }, responses: [Error("rate limited"), ...responsesFor(100).slice(1)] });
  await flush(); assert.equal(p.badges[0].textContent, "★ 1,234"); assert.equal(p.badges[1].textContent, "★ 101");
  for (const invalid of [{ full_name: "someone/else", stargazers_count: 999 }, { full_name: initial[0].repository, stargazers_count: -1 }]) {
    p = page({ responses: [invalid, ...responsesFor(100).slice(1)] }); await flush();
    assert.equal(p.badges[0].textContent, "★ " + initial[0].stars);
  }
  console.log("Passed: all six repositories, independent caches, midnight, suspended tabs, blocked storage, zero stars, and isolated failures.");
})().catch(error => { console.error(error); process.exitCode = 1; });
