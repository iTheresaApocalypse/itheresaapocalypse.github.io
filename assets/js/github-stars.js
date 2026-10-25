(function () {
  "use strict";
  var repository = "THUSI-Lab/GameScaling";
  var badge = document.querySelector('[data-github-stars="' + repository + '"]');
  if (!badge) return;
  var cacheKey = "gamescaling-github-stars-v1";
  // One refresh per Beijing calendar day; no credentials reach the browser.
  var today = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().slice(0, 10);

  function valid(snapshot) {
    return snapshot && snapshot.repository === repository &&
      Number.isSafeInteger(snapshot.stars) && snapshot.stars >= 0;
  }

  function render(snapshot) {
    badge.textContent = "★ " + snapshot.stars.toLocaleString("en-US");
    badge.setAttribute("aria-label", snapshot.stars + " GitHub stars");
    badge.title = "GitHub stars · updated " + snapshot.updated_at + " · refreshed daily";
  }

  try {
    var cached = JSON.parse(localStorage.getItem(cacheKey));
    if (valid(cached) && cached.checked_day === today) {
      render(cached);
      return;
    }
  } catch (error) {
    // Privacy settings may disable localStorage. The live fetch still works.
  }

  fetch("https://api.github.com/repos/" + repository, {
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
      try { localStorage.setItem(cacheKey, JSON.stringify(snapshot)); } catch (error) {}
    })
    .catch(function () {
      // The daily published snapshot also works if the public API is limited.
      return fetch(badge.getAttribute("data-stats-url"), { cache: "no-cache" })
        .then(function (response) {
          if (!response.ok) throw new Error("Star snapshot unavailable");
          return response.json();
        })
        .then(function (snapshot) { if (valid(snapshot)) render(snapshot); })
        .catch(function () {
          // Keep the rendered last-known count when both requests fail.
        });
    });
})();
