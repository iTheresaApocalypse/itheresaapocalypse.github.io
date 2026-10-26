(function () {
  "use strict";
  var badges = document.querySelectorAll("[data-hf-downloads]");
  if (!badges.length) return;
  var dayLength = 86400000;
  var beijingOffset = 8 * 3600000;
  var midnightTimer;

  // Hugging Face maintains lifetime totals. Read those directly: differences
  // between rolling 30-day counts cannot reconstruct lifetime downloads.
  var metrics = Array.from(badges).map(function (badge) {
    var repositories = badge.getAttribute("data-hf-repositories").split(",").sort();
    var kind = badge.getAttribute("data-hf-kind");
    return {
      badge: badge,
      repositories: repositories,
      kind: kind,
      signature: kind + ":" + repositories.join(","),
      cacheKey: "hf-lifetime-downloads-v1-" + badge.getAttribute("data-hf-downloads"),
      timestamp: Date.parse(badge.getAttribute("data-hf-updated-at")) || 0,
      checkedDay: "",
      inFlight: false
    };
  });

  function today() {
    return new Date(Date.now() + beijingOffset).toISOString().slice(0, 10);
  }

  function valid(metric, snapshot) {
    return snapshot && snapshot.signature === metric.signature &&
      Number.isSafeInteger(snapshot.total) && snapshot.total >= 0 &&
      typeof snapshot.updated_at === "string" &&
      Number.isFinite(Date.parse(snapshot.updated_at)) &&
      Date.parse(snapshot.updated_at) <= Date.now() + 60000;
  }

  function render(metric, snapshot) {
    var timestamp = Date.parse(snapshot.updated_at);
    if (timestamp < metric.timestamp) return;
    metric.timestamp = timestamp;
    metric.badge.textContent = "↓ " + snapshot.total.toLocaleString("en-US");
    var scope = metric.kind === "models" ? "summed across " + metric.repositories.length + " model checkpoints" : "dataset";
    metric.badge.setAttribute("aria-label", snapshot.total + " all-time Hugging Face downloads, " + scope);
    metric.badge.title = "All-time Hugging Face downloads · " + scope + " · updated " + snapshot.updated_at + " · refreshed daily";
  }

  function endpoint(metric) {
    if (metric.kind === "models") {
      return "https://huggingface.co/api/models?author=THUSI-Lab&search=GameScaling&limit=100&expand%5B%5D=downloadsAllTime";
    }
    return "https://huggingface.co/api/datasets/" + metric.repositories[0] + "?expand%5B%5D=downloadsAllTime";
  }

  function totalFromPayload(metric, payload) {
    var records = metric.kind === "models" ? payload : [payload];
    if (!Array.isArray(records)) throw new Error("Invalid Hugging Face response");
    var seen = new Set();
    var total = 0;
    records.forEach(function (record) {
      if (!record || metric.repositories.indexOf(record.id) === -1) return;
      if (seen.has(record.id) || !Number.isSafeInteger(record.downloadsAllTime) || record.downloadsAllTime < 0) {
        throw new Error("Invalid lifetime download count");
      }
      seen.add(record.id);
      total += record.downloadsAllTime;
    });
    // An incomplete model list must never replace the complete total.
    if (seen.size !== metric.repositories.length || !Number.isSafeInteger(total)) {
      throw new Error("Incomplete Hugging Face download counts");
    }
    return total;
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
    fetch(endpoint(metric), { cache: "no-cache", signal: controller.signal })
      .then(function (response) {
        if (!response.ok) throw new Error("Hugging Face API unavailable");
        return response.json();
      })
      .then(function (payload) {
        var snapshot = {
          signature: metric.signature,
          total: totalFromPayload(metric, payload),
          updated_at: new Date().toISOString(),
          checked_day: day
        };
        render(metric, snapshot);
        metric.checkedDay = day;
        try { localStorage.setItem(metric.cacheKey, JSON.stringify(snapshot)); } catch (error) {}
      })
      .catch(function () {
        // Keep the last successful cache or the Jekyll-rendered snapshot.
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
