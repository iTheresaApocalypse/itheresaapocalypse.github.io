(function () {
  "use strict";
  var repository = "THUSI-Lab/GameScaling";
  var badge = document.querySelector('[data-github-stars="' + repository + '"]');
  if (!badge) return;
  // This is the complete refresh program: it runs in the homepage itself,
  // without Codex, a scheduled desktop task, a token, or a backend service.
  var cacheKey = "gamescaling-github-stars-v1";
  var dayLength = 24 * 60 * 60 * 1000;
  var beijingOffset = 8 * 60 * 60 * 1000;
  var lastRefreshDay = "";
  var inFlight = false;
  var midnightTimer;
  var displayedTimestamp = Date.parse(badge.getAttribute("data-updated-at")) || 0;

  function beijingDay() {
    return new Date(Date.now() + beijingOffset).toISOString().slice(0, 10);
  }

  function valid(snapshot) {
    return snapshot && snapshot.repository === repository &&
      Number.isSafeInteger(snapshot.stars) && snapshot.stars >= 0 &&
      typeof snapshot.updated_at === "string" && !Number.isNaN(Date.parse(snapshot.updated_at));
  }

  function render(snapshot) {
    // Never replace a newer cached count with an older fallback snapshot.
    var timestamp = Date.parse(snapshot.updated_at);
    if (timestamp < displayedTimestamp) return;
    displayedTimestamp = timestamp;
    badge.textContent = "★ " + snapshot.stars.toLocaleString("en-US");
    badge.setAttribute("aria-label", snapshot.stars + " GitHub stars");
    badge.title = "GitHub stars · updated " + snapshot.updated_at + " · refreshed daily";
  }

  function refreshIfDue() {
    var today = beijingDay();
    if (lastRefreshDay === today || inFlight) return;
    try {
      var cached = JSON.parse(localStorage.getItem(cacheKey));
      if (valid(cached)) {
        render(cached);
        if (cached.checked_day === today) {
          lastRefreshDay = today;
          return;
        }
      }
    } catch (error) {
      // The program also works when browser settings disable localStorage.
    }

    inFlight = true;
    return fetch("https://api.github.com/repos/" + repository, {
    cache: "no-cache",
    headers: { Accept: "application/vnd.github+json" }
  })
    .then(function (response) {
      if (!response.ok) throw new Error("GitHub API unavailable");
      return response.json();
    })
    .then(function (payload) {
      var snapshot = {
        repository: payload.full_name,
        stars: payload.stargazers_count,
        updated_at: new Date().toISOString(),
        checked_day: today
      };
      if (!valid(snapshot)) throw new Error("Invalid GitHub star count");
      render(snapshot);
      lastRefreshDay = today;
      try { localStorage.setItem(cacheKey, JSON.stringify(snapshot)); } catch (error) {}
    })
    .catch(function () {
      // A last-known snapshot is available if the public API is limited.
      return fetch(badge.getAttribute("data-stats-url"), { cache: "no-cache" })
        .then(function (response) {
          if (!response.ok) throw new Error("Star snapshot unavailable");
          return response.json();
        })
        .then(function (snapshot) { if (valid(snapshot)) render(snapshot); })
        .catch(function () {
          // Keep the rendered last-known count when both requests fail.
        });
    })
    .finally(function () { inFlight = false; });
  }

  function scheduleNextDay() {
    clearTimeout(midnightTimer);
    var now = Date.now();
    var nextMidnight = (Math.floor((now + beijingOffset) / dayLength) + 1) * dayLength - beijingOffset;
    midnightTimer = setTimeout(function () {
      refreshIfDue();
      scheduleNextDay();
    }, Math.max(1000, nextMidnight - now + 1000));
  }

  function resume() {
    refreshIfDue();
    scheduleNextDay();
  }

  // Refresh even when a page stays open overnight or returns from suspension.
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") resume();
  });
  window.addEventListener("pageshow", resume);
  resume();
})();
