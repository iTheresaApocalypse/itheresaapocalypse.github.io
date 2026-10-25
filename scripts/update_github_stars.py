#!/usr/bin/env python3
"""Refresh only GameScaling's public star-count snapshot; no dependencies."""

import json
import os
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import Request, urlopen

REPOSITORY = "THUSI-Lab/GameScaling"
ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "_data/github_stars.json"


def make_snapshot(payload):
    count = payload.get("stargazers_count")
    if payload.get("full_name") != REPOSITORY or type(count) is not int or count < 0:
        raise ValueError("GitHub did not return a valid GameScaling star count")
    return {
        "repository": REPOSITORY,
        "stars": count,
        "updated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    }


def main():
    headers = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "Kuan-Zhang-homepage-star-refresh",
    }
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = "Bearer " + token
    request = Request("https://api.github.com/repos/" + REPOSITORY, headers=headers)
    with urlopen(request, timeout=30) as response:
        snapshot = make_snapshot(json.load(response))
    # Write only after a successful response and validation. An outage leaves
    # the previously published count intact and marks the workflow as failed.
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    temporary = OUTPUT.with_suffix(".json.tmp")
    temporary.write_text(json.dumps(snapshot, indent=2) + "\n", encoding="utf-8")
    temporary.replace(OUTPUT)
    print("GameScaling stars:", snapshot["stars"])


if __name__ == "__main__":
    main()
