# Homepage publication statistics

Selected papers show stars from their linked GitHub repository.
`.github/workflows/update-homepage-stats.yml` runs daily at 08:17 Asia/Shanghai
(00:17 UTC), on updater changes, or through Actions' Run workflow button.
GitHub may delay scheduled jobs when its runners are busy.

`scripts/update_homepage_stats.py` reads GitHub's official `stargazers_count`
and Hugging Face's official
`downloadsAllTime` field, not its rolling `downloads` (last 30 days) field.
The official API documentation defines this as downloads since repository
creation: https://huggingface.co/docs/huggingface_hub/package_reference/hf_api

- Scaling in Games: sum of nine official repositories and twelve reviewed community
  quantization repositories in `_data/huggingface_downloads.json` (21 total).
  The official list includes `THUSI-Lab/GameScaling` (client and index) and eight
  weight repositories. The community list includes mradermacher's eight GGUF
  conversions (0.8B, 2B, 9B and 27B; S1 and S3) and CBA-Research's four FP8
  conversions (9B and 27B; S1 and S3). See the provenance notes below.
- GameDojo Benchmark & Dataset: lifetime downloads of `THUSI-Lab/GameDojo`
  (one dataset repository shared by the benchmark and dataset).
- GameDojo Model: lifetime downloads of `THUSI-Lab/GameDojo-4B` plus the reviewed
  community conversion `mradermacher/GameDojo-4B-GGUF` (two repositories total).
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
page HTML, including accessible labels and tooltip timestamps. Hover over a
download number to see its scope and last successful update time. Visitors do
not make GitHub/Hugging Face API calls or cache these counters in localStorage.
Failed metrics retain their last count and timestamp; successful metrics are
still published and the job reports the failures. The updater retries network
errors and rejects missing models, duplicate records, invalid counts and
30-day download fields. Missing counts for any configured official or community
repository retain that metric's previous complete total and timestamp. Single
repositories use the matching model or dataset API; model families use their
configured `search` term before filtering by the exact reviewed repository IDs.

## GameScaling community provenance

The community list was reviewed on 2026-11-28:

- [mradermacher's GGUF conversions](https://huggingface.co/models?author=mradermacher&search=GameScaling)
  declare the corresponding official checkpoint in `base_model:quantized:` tags
  and link their original model in the model card.
- [CBA-Research's FP8 conversions](https://huggingface.co/models?author=CBA-Research&search=GameScaling)
  describe themselves as FP8 reuploads and link their official GameScaling source.
  Their configs use `compressed-tensors` float quantization with 8-bit weights.
  Their inherited base-model tags refer to Qwen, so a lineage-tag-only search
  would miss these conversions.

## GameDojo community provenance

Reviewed on 2026-11-28: [mradermacher/GameDojo-4B-GGUF](https://huggingface.co/mradermacher/GameDojo-4B-GGUF)
declares `base_model:quantized:THUSI-Lab/GameDojo-4B`, links the official source
in its model card, and contains GGUF quantized weights. Both the name search and
the official model's declared base-model relationship search returned this one
community conversion.

## Inclusion and update policy

Only exact IDs in `repositories` and `community_repositories` are included;
unrelated name matches are ignored and duplicate IDs across the two lists are
rejected. Downloads of different quantization files within one repository are
not summed separately: each repository's Hugging Face lifetime count is used
once. The API search spans all authors, and every configured ID must be present
before a new total can be published. New official checkpoints or community
conversions must be reviewed and added to the appropriate JSON list. The daily
job automatically refreshes counts for all listed repositories; it does not
automatically include unreviewed models.

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
