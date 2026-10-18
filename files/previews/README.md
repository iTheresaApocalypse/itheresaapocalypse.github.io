# Homepage video previews

These silent previews use public videos from the author's project pages. The
full source frame is preserved with scaling and padding, never cropping.
Encoding: H.264, 20 fps, with MP4 metadata at the start for playback.

## GameScaling

Project: https://gamescaling.github.io/

`gamescaling-six-groups.mp4` is a 30-second, 960 x 608 silent loop. Six different
2 x 2 groups run for exactly 5 seconds each. Every group has one Minecraft task,
one Doom task, one OmniGameArena game, and one GameWorld game. All footage is
from the project's GameScaling-27B-S3 demos and plays at its original speed.
Each label sits above the complete source frame, including original annotations.

| Loop interval | Minecraft | Doom | OmniGameArena | GameWorld |
| --- | --- | --- | --- | --- |
| 0-5s | Mine birch log | Defend the line | Monster Shoot | Pac-Man |
| 5-10s | Fight zombie | Defend the center | Scene Escape | Boxel Rebound |
| 10-15s | Craft enchanting table | Defend the line | Monster Shoot | Gentleman's Adventure |
| 15-20s | Mine birch log | Defend the center | Scene Escape | Pac-Man |
| 20-25s | Fight zombie | Defend the line | Monster Shoot | Boxel Rebound |
| 25-30s | Craft enchanting table | Defend the center | Scene Escape | Gentleman's Adventure |

Source intervals (seconds in the original clips, same column order):

- Group 1: 0.8-5.8s, 27-32s, 7-12s, 1-6s.
- Group 2: 0.5-5.5s, 8-13s, 18-23s, 0.2-5.2s.
- Group 3: 5-10s, 35-40s, 17-22s, 1-6s.
- Group 4: 3.5-8.5s, 24-29s, 45-50s, 10-15s.
- Group 5: 3.5-8.5s, 45-50s, 30-35s, 2.3-7.3s.
- Group 6: 18-23s, 40-45s, 78-83s, 11-16s.

Source videos:

- doom-center: https://gamescaling.github.io/videos/mixture/vizdoom/defend_the_center/27b_s3.mp4
- doom-line: https://gamescaling.github.io/videos/mixture/vizdoom/defend_the_line/27b_s3.mp4
- gw-adventure: https://gamescaling.github.io/videos/mixture/gw/gentlemans_adventure/27b_s3.mp4
- gw-boxel: https://gamescaling.github.io/videos/mixture/gw/boxel_rebound/27b_s3.mp4
- gw-pacman: https://gamescaling.github.io/videos/mixture/gw/pacman/27b_s3.mp4
- minecraft-birch: https://gamescaling.github.io/videos/mixture/mcu/mine_birch_log/27b_s3.mp4
- minecraft-crafting: https://gamescaling.github.io/videos/mixture/mcu/craft_enchanting_table/27b_s3.mp4
- minecraft-zombie: https://gamescaling.github.io/videos/mixture/mcu/kill_zombie/27b_s3.mp4
- oga-escape: https://gamescaling.github.io/videos/mixture/oga/scene_escape/27b_s3.mp4
- oga-shoot: https://gamescaling.github.io/videos/mixture/oga/monster_shoot/27b_s3.mp4

The matching poster is `images/previews/gamescaling-six-groups.jpg`, extracted
at 2 seconds. New filenames ensure browsers fetch the updated preview. The video
loops automatically on the homepage; the demo link opens the full project introduction.
The older `gamescaling.mp4` and `gamescaling-grid.mp4` remain available for old links.

## Video-Arena

Project: https://videoarena-bench.github.io/

Source: https://videoarena-bench.github.io/videos/promo.mp4

The 17.2-second, 640 × 360 preview uses the continuous gameplay sequence at 38.3–55.5s:
Go, chess, Doudizhu, Counter-Strike 2, StarCraft II, and football. The original
event-perception, state-interpretation, and state-tracking captions remain visible. The homepage's demo link opens the complete 84-second video.

The Video-Arena poster in `images/previews/` is extracted at 1.8 seconds.
Game footage remains attributed to its original
publishers, as described on the project pages.

## OneWM publication figure

Project: https://selen-suyue.github.io/OneWMNet/

`images/onewm-method.webp` is the complete method figure from the paper,
converted to WebP without cropping:
https://arxiv.org/html/2610.21095v1/onewm-method-pipeline.png
