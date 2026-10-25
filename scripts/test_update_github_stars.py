"""Network-boundary checks for daily star refreshes."""

import importlib.util
import io
import json
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest
from unittest.mock import patch
from urllib.error import HTTPError

spec = importlib.util.spec_from_file_location("stars", Path(__file__).with_name("update_github_stars.py"))
stars = importlib.util.module_from_spec(spec)
spec.loader.exec_module(stars)


class SnapshotRefreshTest(unittest.TestCase):
    def run_refresh(self, payload=None, failure=None, expect_failure=False):
        with TemporaryDirectory() as directory:
            output = Path(directory) / "snapshot.json"
            previous = {"repository": stars.REPOSITORY, "stars": 358}
            output.write_text(json.dumps(previous))
            response = io.BytesIO(json.dumps(payload).encode())
            with patch.object(stars, "OUTPUT", output), patch.object(
                stars, "urlopen", side_effect=failure, return_value=response
            ):
                if expect_failure:
                    with self.assertRaises((HTTPError, ValueError)):
                        stars.main()
                    self.assertEqual(json.loads(output.read_text()), previous)
                else:
                    stars.main()
                    self.assertEqual(json.loads(output.read_text())["stars"], payload["stargazers_count"])

    def test_zero_is_a_valid_count(self):
        self.run_refresh({"full_name": stars.REPOSITORY, "stargazers_count": 0})

    def test_api_outage_preserves_last_count(self):
        self.run_refresh(failure=HTTPError("https://api.github.com", 503, "Unavailable", {}, None), expect_failure=True)

    def test_unrelated_repository_preserves_last_count(self):
        self.run_refresh({"full_name": "someone/else", "stargazers_count": 999}, expect_failure=True)

    def test_malformed_count_preserves_last_count(self):
        for invalid in [True, "358", None, -1]:
            with self.subTest(invalid=invalid):
                self.run_refresh({"full_name": stars.REPOSITORY, "stargazers_count": invalid}, expect_failure=True)


if __name__ == "__main__":
    unittest.main()
