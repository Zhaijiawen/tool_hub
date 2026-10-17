# Media Processing — Examples

## Convert a MOV to a universally playable MP4

**Input:** `clip.mov` (phone recording, 120 MB)
**Action:** transcode, MP4 (H.264), CRF 26, original size
**Output:** `clip.mp4` (~38 MB)

H.264 MP4 has the best compatibility — anyone can play it directly.

## Extract audio from a lecture recording

**Input:** `lecture.mp4` (90 min, 800 MB)
**Action:** extract audio, MP3
**Output:** `lecture.mp3` (~110 MB)

Listen on a commute without using video bandwidth or space.

## Turn a highlight into a GIF

**Input:** `goal.mp4` (8-sec clip, 20 MB)
**Action:** to GIF, 12fps, width 480px
**Output:** `goal.gif` (~4 MB)

A short looping clip for a group chat — don't use the original size or the GIF gets too big to send.

## Shrink a web background video

**Input:** `bg.webm` (uncompressed, 60 MB)
**Action:** transcode, WebM (VP8), CRF 32, width 1280px
**Output:** `bg.webm` (~9 MB)

Web background video should be small; WebM with higher CRF balances size and looks.
