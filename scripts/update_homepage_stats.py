#!/usr/bin/env python3
"""Refresh Jekyll's publication counters on the server; stdlib only."""
import concurrent.futures
import datetime as dt
import json
import os
from pathlib import Path
import sys
import time
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
MAX_COUNT = 2**53 - 1


def fetch_json(url):
    headers = {"User-Agent": "homepage-publication-statistics", "Accept": "application/json"}
    if url.startswith("https://api.github.com/") and os.environ.get("GITHUB_TOKEN"):
        headers["Authorization"] = "Bearer " + os.environ["GITHUB_TOKEN"]
    for attempt in range(3):
        try:
            request = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(request, timeout=20) as response:
                return json.load(response)
        except (urllib.error.URLError, TimeoutError, ValueError):
            if attempt == 2:
                raise
            time.sleep(2**attempt)


def count(value):
    if type(value) is not int or not 0 <= value <= MAX_COUNT:
        raise ValueError("Invalid count")
    return value


def stars(metric, fetch):
    repository = metric["repository"]
    payload = fetch("https://api.github.com/repos/" + repository)
    if payload.get("full_name", "").lower() != repository.lower():
        raise ValueError("Unexpected GitHub repository")
    return count(payload.get("stargazers_count"))


def downloads(metric, fetch):
    repositories = metric["repositories"]
    if len(set(repositories)) != len(repositories) or not repositories:
        raise ValueError("Invalid repository list")
    if metric["kind"] == "models":
        payload = fetch("https://huggingface.co/api/models?author=THUSI-Lab&search=GameScaling&limit=100&expand%5B%5D=downloadsAllTime")
    elif metric["kind"] == "datasets" and len(repositories) == 1:
        payload = [fetch("https://huggingface.co/api/datasets/" + repositories[0] + "?expand%5B%5D=downloadsAllTime")]
    else:
        raise ValueError("Unexpected Hugging Face metric")
    if not isinstance(payload, list):
        raise ValueError("Invalid Hugging Face response")
    seen = set()
    total = 0
    for record in payload:
        if not isinstance(record, dict) or record.get("id") not in repositories:
            continue
        if record["id"] in seen:
            raise ValueError("Duplicate repository in response")
        seen.add(record["id"])
        total += count(record.get("downloadsAllTime"))
    if seen != set(repositories):
        raise ValueError("Incomplete lifetime download counts")
    return count(total)


def refresh(root=ROOT, fetch=fetch_json, now=None):
    timestamp = (now or dt.datetime.now(dt.timezone.utc)).isoformat(timespec="seconds").replace("+00:00", "Z")
    files = {
        "github_stars.json": (stars, "stars"),
        "huggingface_downloads.json": (downloads, "total"),
    }
    documents = {name: json.loads((root / "_data" / name).read_text()) for name in files}
    successes, failures = [], []
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        jobs = {pool.submit(reader, metric, fetch): (name, key, field)
                for name, (reader, field) in files.items()
                for key, metric in documents[name].items()}
        for job in concurrent.futures.as_completed(jobs):
            name, key, field = jobs[job]
            try:
                value = job.result()
            except Exception as error:
                failures.append(f"{key} ({field}): {type(error).__name__}: {error}")
                continue
            documents[name][key].update({field: value, "updated_at": timestamp})
            successes.append(f"{key} ({field}): {value}")
    # Failed metrics keep both their last count and their last successful time.
    for name, document in documents.items():
        path = root / "_data" / name
        content = json.dumps(document, indent=2, ensure_ascii=False) + "\n"
        if path.read_text() != content:
            temporary = path.with_suffix(".json.tmp")
            temporary.write_text(content)
            temporary.replace(path)
    return successes, failures


if __name__ == "__main__":
    succeeded, failed = refresh()
    print("\n".join(sorted(succeeded)))
    for failure in sorted(failed):
        print("Retained previous value: " + failure, file=sys.stderr)
    sys.exit(bool(failed))
