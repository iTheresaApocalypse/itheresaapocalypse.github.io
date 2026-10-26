# Homepage publication statistics

All six Selected papers show stars from their linked GitHub repository.
`assets/js/github-stars.js` refreshes each repository independently once per
Beijing calendar day. `_data/github_stars.json` provides rendered fallback
values; API failures retain those values or a newer successful local cache.

`assets/js/huggingface-downloads.js` reads Hugging Face's official
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

The program runs on the homepage. Each browser fetches once per Beijing
calendar day, caches successful values locally, and refreshes after midnight
or when a suspended page is revisited. Failed requests retain the latest known
count. The JSON file provides the initial fallback when JavaScript or the API
is unavailable. New checkpoint repositories must be added to that file.

There is no Codex task, token, server, or shared daily archive. Days without
visitors do not cause missing lifetime downloads: the next successful read
returns the total maintained by Hugging Face. This does not reconstruct a
day-by-day historical series. For rolling counts M(t), the difference
M(t) - M(t-1) equals d(t) - d(t-30), not d(t).

The Selected filter preserves the curated source order. All sorts descending
by each card's `data-published` date, independently of pinning. The eight arXiv
papers use first-submission dates from the official arXiv API; Harnessing
Diversity has year precision (2025). Switching back to Selected restores the
curated order.

Run `node scripts/test_homepage_downloads.cjs` to verify refresh and failure
behavior; `node scripts/test_homepage_stars.cjs` verifies all six star counters.
`node scripts/test_publication_filter.cjs` verifies the two ordering modes.
