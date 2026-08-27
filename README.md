# Fretwork

A JustinGuitar-style app for an intermediate acoustic steel-string player.
Pure HTML/CSS/JS. No build step, no npm, no audio files, no network calls.

## Running it

```
python serve.py
```

Then open <http://localhost:8627>.

`index.html` will also open directly from the filesystem, but the tuner will
not: browsers only hand out a microphone on a secure origin, and `localhost`
counts while `file://` does not.

## What is here so far

**Phase 1 (done) — engine and tools**

| File | What it does |
|---|---|
| `js/theory/notes.js` | Pitch, interval and key arithmetic. Proper scale spelling (F# major comes out with an E#, not an F). Eleven tunings. |
| `js/theory/chords.js` | 36 chord qualities. Given any symbol it searches the whole fretboard for playable voicings, works out the fingering including barres, and ranks them. Tuning-agnostic. |
| `js/theory/scales.js` | 46 scales and modes, mapped onto the neck, sliced into CAGED boxes or three-notes-per-string shapes, plus diatonic harmony with roman numerals. |
| `js/core/audio.js` | The single AudioContext, the mix bus with modelled body resonance, a synthesised reverb, and the beat clock everything schedules against. |
| `js/core/synth-guitar.js` | A Karplus-Strong steel-string. Pick position, per-pitch decay, string choking, five right-hand tones, strums, slides and hammer-ons. |
| `js/core/metronome.js` | Subdivisions, accent patterns, 2-and-4-only, swing, and a tempo ramp. |
| `js/core/pitch.js` | Microphone pitch detection (McLeod NSDF), accurate to under half a cent across the guitar's range. |
| `js/render/*.js` | Chord boxes, full-neck diagrams, and tab notation, all as themed SVG. |
| `js/features/tools.js` | The practice bench: tuner, metronome, sound check. |

**Phase 2 (done) — the libraries**

| File | What it does |
|---|---|
| `js/features/chordlib.js` | Chord explorer. Every playable voicing up the neck with its CAGED form, the chord's notes on the full fretboard, which keys it is diatonic to and what its function is there, and where to go next. |
| `js/features/scalelib.js` | Scale explorer. Whole neck, CAGED boxes or three-notes-per-string, played back over a root drone, with the diatonic chords the scale harmonises into. |
| `js/features/fretboard-trainer.js` | Three drills: name the note, find the note, find the interval. The last one is answered by clicking the neck, and is the one that makes CAGED usable. |

**Phases 3–6 (to come)** — ~50 lessons, the song library and tab player, jam
tracks and ear training, practice logging. The nav lists them now so the shape
of the app is honest about what is coming.

## The song library, and copyright

Songs with **full playable tab** in this app are public domain only: traditional
folk, pre-1930 blues, bluegrass and fiddle tunes, Celtic, spirituals, ragtime,
carols, and classical guitar repertoire. That is not a consolation prize — it is
most of what a folk, blues and fingerstyle player actually plays.

Songs still in copyright appear in a separate **index**, carrying only factual
metadata: artist, year, key, capo, difficulty, chords used, and the shape of the
progression. Each links out to a licensed chart site, and can generate a backing
track from its progression so you can practise the changes. No lyrics and no
transcriptions of copyrighted material are reproduced anywhere in this app.

## Notes on the design

**Nothing is a stored diagram.** Chords, scales, modes and neck maps are all
computed. That is why the scale library covers 46 scales in 12 keys in 11
tunings, and why the alternate-tunings material needs no special cases — the
same voicing search that answers "F barre chord" answers "Cadd9 in DADGAD".

The one deliberate exception is a short list of canonical open-position shapes
in `chords.js`. The search finds those on its own, but it also finds forty
near-misses that score within a point, and "the shape you were taught" is a fact
about guitarists rather than about music. It is a tie-breaker only; every other
voicing is still returned.

**The guitar sound is synthesised, not sampled.** A noise burst is fed into a
delay line one period long and filtered slightly on each pass, which is close to
what a real string does — the tone starts bright and mellows as it rings.

## Tab format

Songs are written as short strings rather than note objects:

```
"6-3:1, 4-0+3-0:1, 2-1:0.5 2-3:0.5, 1-0h2:1"
```

String 6 fret 3 for a beat; strings 4 and 3 together for a beat; two half-beat
notes on string 2; then string 1 open hammered to the 2nd fret.

- `n-f` — string `n` (6 = low E), fret `f`
- `a+b` — sounded together
- `:d` — duration in beats, default 1
- `h p s b` — hammer-on, pull-off, slide, bend, followed by the destination fret
- `r` rest, `x` dead note, `~` let ring
- Commas and spaces both separate events; the difference is only for readability

## State

Everything is kept in `localStorage` under `fretwork.v1` and merged forward, so
a save file written by an earlier phase keeps working after a later one adds
fields. Clearing site data resets the app.
