# Homepage video previews

These silent previews use public videos from the author's project pages. The
full source frame is preserved with scaling and padding, never cropping.
Encoding: H.264, 20 fps, with MP4 metadata at the start for playback.

## GameScaling

Project: https://gamescaling.github.io/

`gamescaling-grid-3x3.mp4` is a fixed 3 x 3 grid. All nine gameplay clips play
simultaneously at their original speed in a 14-second, 1440 x 912 silent loop.
The panel composition stays fixed: two Minecraft tasks, two ViZDoom tasks,
two OmniGameArena games, and three GameWorld games. All use GameScaling-27B-S3.
The complete source frame and original annotations are preserved in every panel.

| Position | Benchmark | Task/game | Source interval |
| --- | --- | --- | --- |
| Row 1, column 1 | Minecraft | Mine birch log | 0.8-7.8s (repeated twice) |
| Row 1, column 2 | Minecraft | Fight zombie | 0.5-7.5s (repeated twice) |
| Row 1, column 3 | ViZDoom | Defend the line | 27-41s |
| Row 2, column 1 | ViZDoom | Defend the center | 24-38s |
| Row 2, column 2 | OmniGameArena | Monster Shoot | 7-21s |
| Row 2, column 3 | OmniGameArena | Scene Escape | 45-59s |
| Row 3, column 1 | GameWorld | Pac-Man | 1-15s |
| Row 3, column 2 | GameWorld | Boxel Rebound | 0.2-7.2s (repeated twice) |
| Row 3, column 3 | GameWorld | Gentleman's Adventure | 1-15s |

Source videos:

- minecraft-birch: https://gamescaling.github.io/videos/mixture/mcu/mine_birch_log/27b_s3.mp4
- minecraft-zombie: https://gamescaling.github.io/videos/mixture/mcu/kill_zombie/27b_s3.mp4
- doom-line: https://gamescaling.github.io/videos/mixture/vizdoom/defend_the_line/27b_s3.mp4
- doom-center: https://gamescaling.github.io/videos/mixture/vizdoom/defend_the_center/27b_s3.mp4
- oga-shoot: https://gamescaling.github.io/videos/mixture/oga/monster_shoot/27b_s3.mp4
- oga-escape: https://gamescaling.github.io/videos/mixture/oga/scene_escape/27b_s3.mp4
- gw-pacman: https://gamescaling.github.io/videos/mixture/gw/pacman/27b_s3.mp4
- gw-boxel: https://gamescaling.github.io/videos/mixture/gw/boxel_rebound/27b_s3.mp4
- gw-adventure: https://gamescaling.github.io/videos/mixture/gw/gentlemans_adventure/27b_s3.mp4

The poster is `images/previews/gamescaling-grid-3x3.jpg`, extracted at 2 seconds.
New filenames ensure browsers fetch the updated preview. The homepage loops
the preview automatically; its demo link opens the complete project introduction.
Older sequential and 2 x 2 previews remain available for old links.

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
