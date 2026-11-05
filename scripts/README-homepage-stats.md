# Homepage publication statistics

All six Selected papers show stars from their linked GitHub repository.
`.github/workflows/update-homepage-stats.yml` runs daily at 08:17 Asia/Shanghai
(00:17 UTC), on updater changes, or through Actions' Run workflow button.
GitHub may delay scheduled jobs when its runners are busy.

`scripts/update_homepage_stats.py` reads GitHub's official `stargazers_count`
and Hugging Face's official
`downloadsAllTime` field, not its rolling `downloads` (last 30 days) field.
The official API documentation defines this as downloads since repository
creation: https://huggingface.co/docs/huggingface_hub/package_reference/hf_api

- Scaling in Games: sum of the main repository and eight checkpoint repositories listed in
  `_data/huggingface_downloads.json`, as linked by the official model card.
  This includes `THUSI-Lab/GameScaling` (client and index) as well as the eight
  weight repositories, for nine repositories in total.
- Video-Arena: lifetime downloads of `THUSI-Lab/Video-Arena` (dataset).
- Towards Spatial Supersensing in the Wild: lifetime downloads of
  `THUSI-Lab/VSI-Super-Wild` (dataset).

Survey, GameVerse, and Handling show GitHub stars only, as requested; they
have no Hugging Face counter configured.

These are Hugging Face download events, not unique people. Model and dataset
download counting follows Hugging Face's respective rules:
https://huggingface.co/docs/hub/models-download-stats
https://huggingface.co/docs/hub/datasets-download-stats

The updater saves counts and successful timestamps in `_data/github_stars.json`
and `_data/huggingface_downloads.json`, commits them, then explicitly requests
a Pages rebuild. The explicit request is essential: pushes made with
`GITHUB_TOKEN` do not automatically trigger GitHub Pages builds. The workflow
uses the repository's built-in token with contents/write and pages/write;
no personal token or extra service is needed. The existing branch-based
Jekyll publishing setup remains in use.

All counters and their last successful update times are rendered into the
page HTML, including accessible labels and tooltip timestamps. Visitors do
not make GitHub/Hugging Face API calls or cache these counters in localStorage.
Failed metrics retain their last count and timestamp; successful metrics are
still published and the job reports the failures. The updater retries network
errors and rejects missing models, duplicate records, invalid counts and
30-day download fields. New checkpoint repositories must be added to the JSON.

There is no Codex task or browser dependency. Daily snapshots are retained in
Git history. Days without visitors do not cause missing lifetime downloads:
the updater reads the total maintained by Hugging Face. This does not reconstruct a
day-by-day historical series. For rolling counts M(t), the difference
M(t) - M(t-1) equals d(t) - d(t-30), not d(t).

The Selected filter preserves the curated source order. All sorts descending
by each card's `data-published` date, independently of pinning. The eight arXiv
papers use first-submission dates from the official arXiv API; Harnessing
Diversity has year precision (2025). Switching back to Selected restores the
curated order.

Run `python3 -m unittest discover -s scripts -p test_homepage_stats.py` to verify
count validation, complete lifetime totals, partial-failure retention and
GitHub token isolation. `python3 scripts/update_homepage_stats.py` fetches live
counts and updates the local JSON files.
`node scripts/test_publication_filter.cjs` verifies the two ordering modes.
