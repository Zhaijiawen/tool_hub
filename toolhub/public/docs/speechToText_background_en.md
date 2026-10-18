# Speech to Text: How It Works

## Why browsers need a local speech engine

Browser-native speech recognition is essentially a dead end:

- The **Web Speech API** (Chrome's `webkitSpeechRecognition`) sends your audio to Google's cloud servers — it stops working offline, and nothing about it is private
- **macOS / Windows system dictation** only works inside OS-level input boxes and can't process files
- Online "upload and transcribe" services mean handing over meeting recordings, interviews, and voice memos to someone else's server

This tool takes a third path: run **OpenAI's Whisper tiny model entirely inside your browser** via WebAssembly. Audio never leaves your device, and once the model is cached it works offline.

## The engine: Whisper tiny + ONNX Runtime (WASM)

The stack has three layers:

1. **[Whisper tiny](https://github.com/openai/whisper) (int8 quantized)** — OpenAI's open-source speech recognition model. The "tiny" variant is ~39M parameters, int8-quantized to about 41.6MB across 7 files. Small, but verified to transcribe Chinese, Japanese, and English correctly
2. **[transformers.js 2.17.2](https://github.com/huggingface/transformers.js)** — Hugging Face's JS inference runtime, which packages the model as a standard `automatic-speech-recognition` pipeline
3. **[ONNX Runtime Web 1.19.2](https://onnxruntime.ai)** — executes the ONNX graph through a SIMD + multi-threaded wasm build (~10.5MB)

Inference runs inside a **Web Worker**, so even minute-long audio won't freeze the page. You can cancel at any point — including mid-download of the engine and model.

## What it can actually do

**Transcribe (original language)** — auto-detects the language and outputs text in that language. Feed it a Japanese podcast, you get Japanese text; an English meeting, English text. You can also pin the language manually.

**Translate (to English)** — Whisper's built-in translation task. Speech in *any* language comes out as English text. We verified this end to end: Japanese speech in, `"I'm going to give you a new video."` out. This is the fastest way to get English subtitles for foreign-language material without a separate translation step.

**Timestamps + SRT export** — segment-level time codes, exportable as standard `.srt` subtitle files.

**Long audio** — anything over 30 seconds is automatically chunked into 30-second windows with a sliding context, and partial results stream back live while later chunks are still processing.

## The honest limits

- **The tiny model is small, not magic.** Clear speech at a normal pace works well; heavy background noise, crosstalk, and strong accents raise the error rate noticeably. For broadcast-quality needs, a large-v3 model on a desktop GPU is the right tool — this one is for browser-local convenience
- **Roughly 1–3x realtime.** A 10-minute recording typically finishes in a few minutes. Keep the tab open; browsers throttle background tabs
- **First use costs a ~52MB download** (engine + model). It's cached afterward, and the download itself is resumable in the sense that completed files persist — only missing files re-fetch
- **Not real-time.** This is file transcription, not live captioning of a microphone stream

## Privacy and technical notes

- All inference is local. The model is self-hosted with this site, and the runtime is configured with `allowRemoteModels = false` — it can never silently fetch from Hugging Face
- Audio is decoded with the Web Audio API at 16kHz mono (Whisper's native input format); the browser handles resampling and channel mixing
- Formats: MP3 / WAV / M4A / OGG / Opus / FLAC, plus any video container with an audio track (the audio is extracted, the video is discarded)
