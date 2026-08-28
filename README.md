# Fretwork

A JustinGuitar-style app for an intermediate acoustic steel-string player.
Pure HTML/CSS/JS. No build step, no npm, no audio files, no network calls.

## Running it

```
python serve.py
```

Then open <http://localhost:8627>.

`index.html` will also open straight from the filesystem, but the tuner will
not: browsers only hand out a microphone on a secure origin, and `localhost`
counts while `file://` does not.

## What is in it

| | |
|---|---|
| **Course** | 50 lessons across six tracks, with drills wired to the metronome and per-lesson progress |
| **Chords** | 36 chord qualities, every playable voicing up the neck, CAGED forms, and what each chord does in a key |
| **Scales** | 50 scales and modes, CAGED boxes and three-notes-per-string, played over a root drone |
| **Trainer** | Name the note, find the note, find the interval — answered on the neck |
| **Songs** | 50 public-domain songs with chords, backing band and playable tab; 249 well-known songs indexed for reference |
| **Jam** | 61 progressions in any of 12 keys, 12 backing styles, drums + bass + comping guitar |
| **Ear** | Intervals, chord qualities and progressions by ear |
| **Theory** | Interactive circle of fifths, diatonic harmony, borrowed chords |
| **Progress** | Practice routine with a timer, session log, streaks, per-track progress |
| **Practice bench** | Microphone tuner in 11 tunings, and a metronome with subdivisions, swing and a tempo ramp |

## The six course tracks

- **A — Barre chords and chord mastery** (8): the whole neck from two shapes, CAGED, triads and inversions, slash chords and walking bass, colour chords, substitution.
- **B — Fingerstyle** (10): PIMA and planting, alternating bass, Travis picking, pattern picking, Piedmont blues, twelve-bar fingerstyle, percussion, chord melody, an arranging project.
- **C — Fretboard and improvisation** (10): mapping the neck, the five positions, pentatonics and the joins, blue notes, modes, chord tones, arpeggios, phrasing, blues soloing, modal vamps.
- **D — Rhythm and groove** (8): the sixteenth grid, boom-chick, bass runs, shuffle and swing, compound time, odd meters, dynamics, metronome discipline.
- **E — Theory and ear** (8): intervals, keys and transposing, harmonising scales, hearing progressions, borrowed chords, cadences and voice leading, reharmonisation, transcribing.
- **F — Alternate tunings** (6): drop D, DADGAD, open G, open D, the wider family, and writing in an open tuning.

## The song library, and copyright

Songs with **full playable tab and chords** in this app are public domain only:
traditional folk, pre-1930 blues, bluegrass and fiddle tunes, Celtic, spirituals,
carols, and classical guitar repertoire. That is not a consolation prize — it is
most of what a folk, blues and fingerstyle player actually plays.

Songs still in copyright appear in a separate **index** carrying only factual
metadata: artist, year, key, capo, difficulty, chords used, and the shape of the
progression. Each links out to a licensed chart site, and one click builds a
backing track from the progression so the changes can be practised. No lyrics
and no transcriptions of copyrighted material appear anywhere in this app.

## Notes on the design

**Nothing is a stored diagram.** Chords, scales, modes, neck maps and
progressions are all computed. That is why the scale library covers 50 scales in
12 keys in 11 tunings, why the progression library covers 61 progressions in
every key from one stored entry each, and why the alternate-tunings track needs
no special cases — the same voicing search that answers "F barre chord" answers
"Cadd9 in DADGAD".

The one deliberate exception is a short list of canonical open-position shapes
in `chords.js`. The search finds those on its own, but it also finds forty
near-misses that score within a point, and "the shape you were taught" is a fact
about guitarists rather than about music. It is a tie-breaker only.

**Every sound is synthesised.** The guitar is a Karplus-Strong plucked-string
model with pick position, per-pitch decay and string choking. The drums are
oscillators and filtered noise. The reverb impulse is generated at startup.
Tuning accuracy across the whole neck is under a tenth of a cent.

## Layout

```
index.html            single page; script order matters (see comments)
style.css             dark studio theme
serve.py              threaded static server, port 8627
js/theory/            notes, chords, scales, progressions
js/core/              audio bus and clock, guitar, drums, backing band,
                      metronome, microphone pitch detection
js/render/            chord boxes, fretboards, tab notation -- all SVG
js/data/              lessons-*.js, songs-*.js, song-index.js
js/features/          one file per view
js/app.js             shell, router, saved state
```

## Tab format

Songs and lesson examples are written as short strings rather than note objects:

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

Bars in compound and odd meters are written in the pulse you count, so a 6/8 bar
is six beats and a 7/8 bar is seven. Set the metronome to match.

## State

Everything is kept in `localStorage` under `fretwork.v1` and merged forward, so a
save file written by an earlier version keeps working after a later one adds
fields. Clearing site data resets the app.
