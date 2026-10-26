# Homepage download counters

`assets/js/huggingface-downloads.js` reads Hugging Face's official
`downloadsAllTime` field, not its rolling `downloads` (last 30 days) field.
The official API documentation defines this as downloads since repository
creation: https://huggingface.co/docs/huggingface_hub/package_reference/hf_api

- Scaling in Games: sum of the eight checkpoint repositories listed in
  `_data/huggingface_downloads.json`, as linked by the official model card.
  The main `THUSI-Lab/GameScaling` repository contains the client and an index,
  not model weights, so it is excluded from the model download total.
- Video-Arena: lifetime downloads of `THUSI-Lab/Video-Arena` (dataset).

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

Run `node scripts/test_homepage_downloads.cjs` to verify refresh and failure
behavior; `node scripts/test_homepage_stars.cjs` verifies the star counter.
