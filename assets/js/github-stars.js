(function () {
  "use strict";
  var badges = document.querySelectorAll("[data-github-stars]");
  if (!badges.length) return;
  // Every selected paper has an independent daily cache and failure state.
  var dayLength = 86400000;
  var beijingOffset = 8 * 3600000;
  var midnightTimer;
  var metrics = Array.from(badges).map(function (badge) {
    var repository = badge.getAttribute("data-github-stars");
    return {
      badge: badge,
      repository: repository,
      cacheKey: "github-stars-v2-" + repository,
      timestamp: Date.parse(badge.getAttribute("data-updated-at")) || 0,
      checkedDay: "",
      inFlight: false
    };
  });

  function today() {
    return new Date(Date.now() + beijingOffset).toISOString().slice(0, 10);
  }

  function valid(metric, snapshot) {
    return snapshot && snapshot.repository === metric.repository &&
      Number.isSafeInteger(snapshot.stars) && snapshot.stars >= 0 &&
      typeof snapshot.updated_at === "string" &&
      Number.isFinite(Date.parse(snapshot.updated_at)) &&
      Date.parse(snapshot.updated_at) <= Date.now() + 60000;
  }

  function render(metric, snapshot) {
    var timestamp = Date.parse(snapshot.updated_at);
    if (timestamp < metric.timestamp) return;
    metric.timestamp = timestamp;
    metric.badge.textContent = "★ " + snapshot.stars.toLocaleString("en-US");
    metric.badge.setAttribute("aria-label", snapshot.stars + " GitHub stars");
    metric.badge.title = "GitHub stars · updated " + snapshot.updated_at + " · refreshed daily";
  }

  function refresh(metric) {
    var day = today();
    if (metric.checkedDay === day || metric.inFlight) return;
    try {
      var cached = JSON.parse(localStorage.getItem(metric.cacheKey));
      if (valid(metric, cached)) {
        render(metric, cached);
        if (cached.checked_day === day) {
          metric.checkedDay = day;
          return;
        }
      }
    } catch (error) {}

    metric.inFlight = true;
    var controller = new AbortController();
    var timeout = setTimeout(function () { controller.abort(); }, 15000);
    fetch("https://api.github.com/repos/" + metric.repository, {
      cache: "no-cache", signal: controller.signal,
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
          checked_day: day
        };
        if (!valid(metric, snapshot)) throw new Error("Invalid GitHub star count");
        render(metric, snapshot);
        metric.checkedDay = day;
        try { localStorage.setItem(metric.cacheKey, JSON.stringify(snapshot)); } catch (error) {}
      })
      .catch(function () {
        // Retain the latest local cache or Jekyll-rendered snapshot on rate limits.
      })
      .finally(function () { clearTimeout(timeout); metric.inFlight = false; });
  }

  function resume() {
    metrics.forEach(refresh);
    clearTimeout(midnightTimer);
    var now = Date.now();
    var nextMidnight = (Math.floor((now + beijingOffset) / dayLength) + 1) * dayLength - beijingOffset;
    midnightTimer = setTimeout(resume, Math.max(1000, nextMidnight - now + 1000));
  }
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") resume();
  });
  window.addEventListener("pageshow", resume);
  resume();
})();
