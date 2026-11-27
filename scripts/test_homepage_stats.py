import datetime as dt
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

import update_homepage_stats as stats


class HomepageStatsTests(unittest.TestCase):
    def test_github_validation(self):
        metric = {"repository": "THUSI-Lab/GameScaling"}
        for value in (0, 484):
            self.assertEqual(stats.stars(metric, lambda url: {
                "full_name": metric["repository"], "stargazers_count": value}), value)
        for value in (-1, True, "484", None, stats.MAX_COUNT + 1):
            with self.assertRaises(ValueError):
                stats.stars(metric, lambda url: {
                    "full_name": metric["repository"], "stargazers_count": value})
        with self.assertRaises(ValueError):
            stats.stars(metric, lambda url: {"full_name": "other/repo", "stargazers_count": 99})

    def test_lifetime_totals_require_every_configured_model(self):
        metric = json.loads((stats.ROOT / "_data/huggingface_downloads.json").read_text())["gamescaling"]
        official = [{"id": repo, "downloadsAllTime": 10, "downloads": 999} for repo in metric["repositories"]]
        community = [{"id": repo, "downloadsAllTime": 20, "downloads": 999}
                     for repo in metric["community_repositories"]]
        records = official + community
        expected = len(official) * 10 + len(community) * 20
        self.assertEqual(len(official), 9)
        self.assertGreater(len(community), 0)
        def fetch(url):
            self.assertNotIn("author=", url)
            self.assertIn("downloadsAllTime", url)
            return records
        self.assertEqual(stats.downloads(metric, fetch), expected)
        self.assertEqual(stats.downloads(metric, lambda url: records + [
            {"id": "someone/GameScaling-unverified", "downloadsAllTime": 10000}]), expected)
        invalid = [official, community, records[:-1], records + [records[-1]],
                   [{"id": r["id"], "downloads": 999} for r in records],
                   official + [{**r, "downloadsAllTime": -1} for r in community],
                   [{**r, "downloadsAllTime": stats.MAX_COUNT} for r in records]]
        for payload in invalid:
            with self.assertRaises(ValueError):
                stats.downloads(metric, lambda url: payload)

    def test_duplicate_repository_configuration_is_rejected(self):
        for metric in (
            {"kind": "models", "repositories": []},
            {"kind": "models", "repositories": ["a/b", "a/b"]},
            {"kind": "models", "repositories": ["a/b"], "community_repositories": ["a/b"]},
            {"kind": "models", "repositories": ["a/b"], "community_repositories": ["c/d", "c/d"]},
        ):
            with self.assertRaises(ValueError):
                stats.downloads(metric, lambda url: self.fail("Invalid configuration must not be fetched"))

    def test_single_model_and_dataset_use_exact_repository_lifetime_counts(self):
        for kind, repository in (("models", "THUSI-Lab/GameDojo-4B"), ("datasets", "THUSI-Lab/GameDojo")):
            metric = {"kind": kind, "repositories": [repository]}
            def fetch(url):
                self.assertEqual(url, "https://huggingface.co/api/" + kind + "/" + repository + "?expand%5B%5D=downloadsAllTime")
                return {"id": repository, "downloadsAllTime": 123, "downloads": 9}
            self.assertEqual(stats.downloads(metric, fetch), 123)
            for payload in ({"id": "other/model", "downloadsAllTime": 999},
                            {"id": repository, "downloads": 123},
                            {"id": repository, "downloadsAllTime": True}):
                with self.assertRaises(ValueError):
                    stats.downloads(metric, lambda url: payload)

    def test_gamedojo_includes_community_without_querying_gamescaling(self):
        metric = json.loads((stats.ROOT / "_data/huggingface_downloads.json").read_text())["gamedojo_model"]
        def fetch(url):
            from urllib.parse import urlparse, parse_qs
            self.assertEqual(parse_qs(urlparse(url).query)["search"], ["GameDojo"])
            return [{"id": repository, "downloadsAllTime": 10, "downloads": 999}
                    for repository in metric["repositories"] + metric["community_repositories"]] + [
                        {"id": "unverified/GameDojo-clone", "downloadsAllTime": 1000}]
        self.assertEqual(stats.downloads(metric, fetch), 10 * (len(metric["repositories"]) + len(metric["community_repositories"])))

    def test_partial_failure_keeps_old_count_and_time(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "_data").mkdir()
            original = {}
            for name in ("github_stars.json", "huggingface_downloads.json"):
                original[name] = json.loads((stats.ROOT / "_data" / name).read_text())
                (root / "_data" / name).write_text(json.dumps(original[name]))
            metric_count = sum(len(metrics) for metrics in original.values())
            def fetch(url):
                if "api.github.com" in url:
                    repo = url.split("/repos/")[1]
                    if repo == original["github_stars.json"]["gamescaling"]["repository"]:
                        raise OSError("offline")
                    return {"full_name": repo, "stargazers_count": 0}
                if "/api/models?" in url:
                    from urllib.parse import urlparse, parse_qs
                    query = parse_qs(urlparse(url).query)
                    models = next(m for m in original["huggingface_downloads.json"].values()
                                  if m.get("search") == query["search"][0])
                    return [{"id": repo, "downloadsAllTime": 5}
                            for repo in models["repositories"] + models.get("community_repositories", [])]
                return {"id": url.split("/api/")[1].split("/", 1)[1].split("?")[0], "downloadsAllTime": 17}
            now = dt.datetime(2026, 11, 5, 0, 17, tzinfo=dt.timezone.utc)
            succeeded, failed = stats.refresh(root, fetch, now)
            self.assertEqual((len(succeeded), len(failed)), (metric_count - 1, 1))
            stars = json.loads((root / "_data/github_stars.json").read_text())
            downloads = json.loads((root / "_data/huggingface_downloads.json").read_text())
            self.assertEqual(stars["gamescaling"], original["github_stars.json"]["gamescaling"])
            self.assertEqual(stars["video_arena"]["stars"], 0)
            self.assertEqual(stars["video_arena"]["updated_at"], "2026-11-05T00:17:00Z")
            model = downloads["gamescaling"]
            self.assertEqual(model["total"], 5 * (len(model["repositories"]) + len(model["community_repositories"])))
            complete_model = model.copy()
            complete_gamedojo = downloads["gamedojo_model"].copy()
            def missing_community(url):
                payload = fetch(url)
                return payload[:-1] if "/api/models?" in url else payload
            stats.refresh(root, missing_community, now + dt.timedelta(days=1))
            retained = json.loads((root / "_data/huggingface_downloads.json").read_text())
            self.assertEqual(retained["gamescaling"], complete_model)
            self.assertEqual(retained["gamedojo_model"], complete_gamedojo)
            self.assertEqual(retained["gamedojo_dataset"]["updated_at"], "2026-11-06T00:17:00Z")
            self.assertEqual(retained["video_arena"]["updated_at"], "2026-11-06T00:17:00Z")
            before = {p.name: p.read_text() for p in (root / "_data").iterdir()}
            def offline(url):
                raise OSError("offline")
            succeeded, failed = stats.refresh(root, offline, now)
            self.assertEqual((len(succeeded), len(failed)), (0, metric_count))
            self.assertEqual(before, {p.name: p.read_text() for p in (root / "_data").iterdir()})

    def test_github_token_is_not_sent_to_hugging_face(self):
        from io import BytesIO
        requests = []
        def open_request(request, timeout):
            requests.append(request)
            return BytesIO(b'{}')
        with patch.dict(stats.os.environ, {"GITHUB_TOKEN": "test-only-token"}), \
                patch.object(stats.urllib.request, "urlopen", open_request):
            stats.fetch_json("https://api.github.com/repos/a/b")
            stats.fetch_json("https://huggingface.co/api/models")
        self.assertEqual(requests[0].get_header("Authorization"), "Bearer test-only-token")
        self.assertIsNone(requests[1].get_header("Authorization"))


if __name__ == "__main__":
    unittest.main()
