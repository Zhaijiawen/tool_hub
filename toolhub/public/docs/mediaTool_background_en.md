# Media Processing — Technical Background

This tool processes audio and video in the browser using a WASM build of **FFmpeg**, with three features: **video transcode**, **audio extraction**, and **video to GIF**. On first use it downloads the ~32MB FFmpeg core (with a progress bar, cancellable, then cached for instant re-use). Everything runs locally.

## Video transcode

- **MP4 (H.264)**: best compatibility, plays on almost any device.
- **WebM (VP8)**: usually smaller, good for embedding on the web.
- Quality is expressed as **CRF** (constant rate factor), range 18-40; higher = lower quality but smaller file. 23-28 is a daily-use sweet spot.
- Optional scaling: original, 1280px, 960px, 720px, 480px.

## Audio extraction

Pull the audio track out of a video (or audio) file, to **MP3 / M4A(AAC) / WAV / OGG / Opus**. For example, extract pure audio from a lecture recording to listen on a commute.

## Video to GIF

Turn a video clip into an animated GIF. Adjustable **frame rate** (5-30fps, higher = smoother but larger) and **width** (80-800px, smaller = lighter). GIF has no audio, so only the picture is kept.

## Privacy and limits

- Files never leave the browser, good for private recordings.
- The FFmpeg WASM build cannot read detailed `stderr` logs, so errors are only reported generically; some very unusual codec combinations may not be supported by the WASM build.
- Processing time depends on file size and your device; large videos take patience.
