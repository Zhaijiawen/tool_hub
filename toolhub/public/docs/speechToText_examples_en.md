# Speech to Text — Usage Examples

Concrete scenarios with expected inputs and outputs.

## 1. Transcribe an English meeting recording

**Input**: `meeting.mp3`, 12 min 40 s, English, two speakers
**Settings**: Task = Transcribe, Language = Auto-detect, Timestamps = on, Live partials = on

**Result**: transcript in English with segment time codes; download as TXT for a full record, or SRT to paste into the meeting video.

## 2. English subtitles for a Japanese podcast clip

**Input**: `podcast_ep12.m4a`, 4 min 18 s, Japanese
**Settings**: Task = **Translate to English**, Language = Auto-detect, Timestamps = on

**Result**: English text like:

```
1
00:00:00,240 --> 00:00:03,910
I'm going to give you a new video.

2
00:00:03,910 --> 00:00:08,050
Today I want to talk about why most
people quit learning English in week two.
```

Download the SRT and it loads directly in any player. (Verified output for the first segment.)

## 3. Chinese voice memo to text

**Input**: `voice_note.wav`, 1 min 05 s, Mandarin, recorded close to the phone
**Settings**: Task = Transcribe, Language = Chinese, Timestamps = off

**Result**: Chinese paragraph text; copy directly into notes. With clear recording, punctuation comes out mostly usable.

## 4. Extract the audio track from a video

**Input**: `lecture.mp4` (video with audio), 35 min
**Settings**: Task = Transcribe, Language = English, Timestamps = on, Live partials = on

**Result**: the video container is decoded for its audio track only; the transcript streams in per 30-second chunk. A 35-minute lecture typically finishes in roughly 15–35 minutes — keep the tab open.

## 5. SRT for a home video

**Input**: `family_clip.mov`, 2 min 30 s, mixed Chinese/English
**Settings**: Task = Transcribe, Language = Auto-detect, Timestamps = on

**Result**: segments alternate between Chinese and English as spoken; SRT export keeps each segment on its own timeline entry.

## What the numbers look like

| Input | Model load | Rough processing time |
|---|---|---|
| 1 min audio | ~52MB first run, cached after | ~30 s – 3 min |
| 5 min audio | cached | ~3 – 15 min |
| 30 min audio | cached | ~15 – 90 min |

Roughly 1–3x realtime on a typical desktop CPU; a fast machine lands near 3x.

## Not the right tool when…

- You need broadcast-grade accuracy — use a large model on a GPU (Whisper large-v3, or a commercial API)
- You need live microphone captioning — this transcribes files
- The audio is mostly music — Whisper is a speech model and hallucinates lyrics badly
- You need speaker diarization ("who said what") — Whisper tiny does not label speakers
