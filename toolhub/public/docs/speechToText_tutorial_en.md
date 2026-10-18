# Speech to Text — How to Use

Upload an audio or video file, pick a task, and get text. First use downloads the engine and model (~52MB, with progress and cancel); everything after that is cached.

## Transcribing: keep the original language

1. Upload an audio file (MP3 / WAV / M4A / OGG / Opus / FLAC) or a video with an audio track
2. Task: **Transcribe**
3. Language: leave **Auto-detect**, or pin it if you already know
4. Click **Start Recognition**

The output appears in the original language. For a Japanese recording you get Japanese text; for English, English.

## Translating: any language to English

Same steps, but set the task to **Translate to English**. The output is English text regardless of the spoken language. Typical use: pulling English subtitles from foreign-language videos and podcasts.

## Timestamps and subtitles

Turn on **Segment timestamps** to get per-segment time codes shown under the transcript. With timestamps on, you can download **SRT** — a standard subtitle file you can drop into any player or video editor:

```
1
00:00:00,000 --> 00:00:04,320
And so my fellow Americans, ask not

2
00:00:04,320 --> 00:00:07,480
what your country can do for you
```

Without timestamps you can still download a plain **TXT**.

## Live partial results

Turn on **Live partial results** and intermediate text from each 30-second chunk streams in while later chunks are still processing. Useful for long recordings — you can start reading (or stop early) without waiting for the whole file.

## Options explained

**Language** — Auto-detect works well for clips over ~10 seconds. Short clips can misdetect; pin the language manually when unsure. 12 languages are offered (Chinese, English, Japanese, Korean, French, German, Spanish, Russian, Italian, Portuguese, Dutch, Turkish).

**Cancel** — the button next to progress stops both download and inference. Already-processed chunks are discarded, so you start fresh next time.

## What to expect

- **First run**: ~52MB download (engine ~10.5MB + model ~41.6MB), then inference begins
- **Speed**: roughly 1–3x realtime — 10 minutes of audio usually finishes within minutes
- **Keep the tab open**: browsers throttle background tabs and inference slows accordingly

## Tips

- Noisy audio? Extract a clean track first with the site's "Audio & Video Toolkit", or the "Audio Converter" to strip video and normalize
- Names, jargon, and numbers are where tiny models are weakest — budget a proofread pass
- For best accuracy, use files recorded close to the microphone; phone-room recordings degrade noticeably
