/* lessons-tunings.js -- Track F: alternate tunings.

   Sections in this track carry a `tuning` key. The chord diagrams, the neck
   diagrams and the playback all honour it, and any chord without pinned frets
   is worked out by the voicing search in that tuning -- which is the whole
   reason the engine was built to be tuning-agnostic.
*/
(function (GL) {
  'use strict';

  GL.lessons = GL.lessons || {};

  GL.lessons.tunings = [

    {
      id: 'f1',
      track: 'F',
      title: 'Drop D and double drop D',
      goal: 'Use the lowered 6th string for power, drones and easier bass lines.',
      time: 18,
      tags: ['drop d', 'tuning'],
      sections: [
        { type: 'text', body:
          'Drop D lowers the 6th string a whole tone to D. It is the smallest possible change to ' +
          'standard tuning and it buys three things: a lower bass note, one-finger power chords on the ' +
          'bottom three strings, and a D drone you can leave ringing under everything.' },
        { type: 'text', body:
          'Tune down by matching the 6th string to the 4th string, an octave apart. Play both and ' +
          'lower the 6th until the beating stops.' },
        { type: 'heading', body: 'What it makes easy' },
        { type: 'chords', tuning: 'dropD', items: [
          { symbol: 'D', frets: [0, 0, 0, 2, 3, 2], caption: 'huge open D' },
          { symbol: 'D5', frets: [0, 0, 0, -1, -1, -1], caption: 'one finger, no finger' },
          { symbol: 'G5', frets: [5, 5, 5, -1, -1, -1], caption: 'one finger barre' },
          { symbol: 'A5', frets: [7, 7, 7, -1, -1, -1], caption: 'same shape, moved' },
          { symbol: 'Dsus4', frets: [0, 0, 0, 2, 3, 3], caption: 'drone-friendly' }
        ], note: 'The power-chord shape is a single finger flattened across three strings, movable anywhere.' },
        { type: 'heading', body: 'Double drop D' },
        { type: 'text', body:
          'Drop the 1st string to D as well and you have D A D G B D. Now you have a D drone at both ' +
          'ends of the guitar, which is why so much modal folk uses it. Neil Young built a career ' +
          'partly on this tuning.' },
        { type: 'chords', tuning: 'doubleDropD', items: [
          { symbol: 'D' }, { symbol: 'G' }, { symbol: 'Am' }, { symbol: 'C' }
        ], note: 'These shapes were found by searching the neck in double drop D. Click to hear them.' },
        { type: 'callout', kind: 'tip', body:
          'The trap with drop D is that everything on the 6th string is now two frets higher than your ' +
          'fingers expect. Bass runs are the first place it catches you out.' }
      ],
      drill: {
        name: 'Riff on the bottom three',
        how: 'In drop D, play a riff using only the one-finger power chord shape moved around the ' +
             'bottom three strings, while the open D rings. Then play a bass run and notice how wrong ' +
             'your hand gets it the first few times.',
        bpm: { start: 70, target: 110 },
        metronome: { beatsPerBar: 4, subdivision: 2 }
      },
      checks: [
        'You can tune to drop D by ear against the 4th string.',
        'You can find the notes on the lowered 6th string without counting.',
        'You can play a full song in drop D without reaching for a standard-tuning shape by mistake.'
      ]
    },

    {
      id: 'f2',
      track: 'F',
      title: 'DADGAD',
      goal: 'Play in the tuning that made modern Celtic guitar possible.',
      time: 25,
      tags: ['dadgad', 'celtic', 'modal'],
      sections: [
        { type: 'text', body:
          'D A D G A D. Davey Graham brought it back from Morocco, Bert Jansch and Martin Carthy made ' +
          'it English, and it has been the default tuning for Celtic guitar ever since. The open ' +
          'strings give you Dsus4 -- no third at all -- which is precisely why it suits modal music. ' +
          'The tuning refuses to decide whether it is major or minor, so the tune can.' },
        { type: 'text', body:
          'From standard: drop the 6th, 2nd and 1st strings each by a whole tone. The middle three ' +
          'do not move.' },
        { type: 'chords', tuning: 'dadgad', items: [
          { symbol: 'Dsus4', frets: [0, 0, 0, 0, 0, 0], caption: 'the open strings' },
          { symbol: 'D' }, { symbol: 'Dm' }, { symbol: 'G' }, { symbol: 'Am' }, { symbol: 'Em7' }
        ], note: 'Everything except the open Dsus4 was found by the voicing search, in DADGAD.' },
        { type: 'heading', body: 'How to think in it' },
        { type: 'list', items: [
          'Stop looking for standard-tuning shapes. The strings are a fourth, a fifth and a fourth apart at the bottom, which changes everything.',
          'Let strings ring. The reason to use this tuning is the drones; muting them defeats the point.',
          'Play melodies on the top two strings over open strings underneath. That is the core Celtic guitar sound.',
          'A one-finger barre across all six strings at any fret gives you a sus4 chord in that key. Fret 2 is Esus4, fret 5 is Gsus4, fret 7 is Asus4.'
        ] },
        { type: 'heading', body: 'D mixolydian on the neck' },
        { type: 'fretboard', tuning: 'dadgad', root: 'D', scale: 'mixolydian', mode: 'whole', label: 'degree',
          caption: 'D mixolydian in DADGAD. Notice how the open strings all fall in the scale -- ' +
                   'that is why it feels so easy to improvise in.' },
        { type: 'callout', kind: 'note', body:
          'DADGAD is not a shortcut. It is a different instrument with the same body, and the fluency ' +
          'you have in standard tuning does not transfer. Give it a few weeks of only playing in it.' }
      ],
      drill: {
        name: 'Melody over drones',
        how: 'Play a simple modal melody on the top two strings while letting the low D, A and D ring ' +
             'underneath. Do not fret the bass strings at all. Then add a single fretted bass note per ' +
             'bar and hear how much it changes.',
        bpm: { start: 76, target: 116 },
        metronome: { beatsPerBar: 6, subdivision: 1 }
      },
      checks: [
        'You can play a tune in DADGAD without hunting for standard shapes.',
        'You can find D, G and A chords without a chart.',
        'You are letting the drones ring rather than damping them out of habit.'
      ]
    },

    {
      id: 'f3',
      track: 'F',
      title: 'Open G',
      goal: 'Play slide-flavoured blues and country in the tuning of the open chord.',
      time: 22,
      tags: ['open g', 'blues', 'slide'],
      sections: [
        { type: 'text', body:
          'D G D G B D. The open strings are a G major chord, so a barre at any fret gives you that ' +
          'major chord. It is the tuning of a great deal of country blues, of Delta slide playing, and ' +
          'of a fair proportion of Keith Richards.' },
        { type: 'text', body:
          'From standard: drop the 6th, 5th and 1st strings each by a whole tone. Many players simply ' +
          'remove the 6th string altogether, which is what Richards does -- in open G the low D adds ' +
          'little and gets in the way.' },
        { type: 'chords', tuning: 'openG', items: [
          { symbol: 'G', frets: [0, 0, 0, 0, 0, 0], caption: 'open' },
          { symbol: 'C', frets: [5, 5, 5, 5, 5, 5], caption: 'barre at 5' },
          { symbol: 'D', frets: [7, 7, 7, 7, 7, 7], caption: 'barre at 7' },
          { symbol: 'Em' }, { symbol: 'Am' }, { symbol: 'G7' }
        ], note: 'Three one-finger chords give you a whole blues. The rest the engine found.' },
        { type: 'heading', body: 'The two-finger trick' },
        { type: 'text', body:
          'Barre a fret, then add your ring finger two frets higher on the 4th string and your little ' +
          'finger two frets higher on the 3rd. That is the standard open-G riff shape, and moving ' +
          'between the plain barre and that shape is most of the vocabulary.' },
        { type: 'callout', kind: 'tip', body:
          'For slide, open G is the easiest tuning to start in: a straight barre with the slide gives ' +
          'you a chord, so intonation is the only thing you have to get right. Keep the slide directly ' +
          'over the fret wire, not behind it.' }
      ],
      drill: {
        name: 'Three chords, one finger',
        how: 'Twelve-bar blues in G using only barres at frets 0, 5 and 7. Then add the two-finger ' +
             'riff shape on each chord. Then try it with a slide.',
        bpm: { start: 72, target: 108 },
        metronome: { beatsPerBar: 4, subdivision: 2, swing: 0.6 }
      },
      checks: [
        'You can play a twelve-bar in open G with barres alone.',
        'You can find the minor chords, which are the awkward ones in this tuning.',
        'You know which fret gives you which chord without counting.'
      ]
    },

    {
      id: 'f4',
      track: 'F',
      title: 'Open D',
      goal: 'Play the darker open tuning, and understand why it suits slide and drones.',
      time: 20,
      tags: ['open d', 'slide', 'blues'],
      sections: [
        { type: 'text', body:
          'D A D F# A D. Like open G, the open strings form a major chord, but with the root at the ' +
          'bottom and the top, which makes it heavier and more resonant. It is the tuning of a great ' +
          'deal of Delta blues and a lot of modern fingerstyle.' },
        { type: 'text', body:
          'From standard: drop the 6th, 2nd and 1st strings a whole tone, and the 3rd string a ' +
          'semitone. Tuned up a whole tone it becomes open E, which is the same shapes with more ' +
          'string tension -- fine on an electric, hard on an old acoustic.' },
        { type: 'chords', tuning: 'openD', items: [
          { symbol: 'D', frets: [0, 0, 0, 0, 0, 0], caption: 'open' },
          { symbol: 'G', frets: [5, 5, 5, 5, 5, 5], caption: 'barre at 5' },
          { symbol: 'A', frets: [7, 7, 7, 7, 7, 7], caption: 'barre at 7' },
          { symbol: 'Dm' }, { symbol: 'Bm' }, { symbol: 'D7' }
        ] },
        { type: 'heading', body: 'Minor for free' },
        { type: 'text', body:
          'The 3rd string carries the major third. Lower it one more semitone and the whole tuning ' +
          'becomes open D minor -- every barre is now a minor chord. That is a five-second retune and ' +
          'a completely different emotional register.' },
        { type: 'callout', kind: 'note', body:
          'Open tunings put far more tension on some strings and far less on others. If your guitar ' +
          'buzzes or the intonation drifts after retuning, give it a few minutes to settle before ' +
          'blaming the setup.' }
      ],
      drill: {
        name: 'Drone and move',
        how: 'Let the open D bass strings ring throughout. Play a melody on the top three strings that ' +
             'moves against them. Then add barres at 5 and 7 and hear how the drone interacts with the ' +
             'changing harmony.',
        bpm: { start: 70, target: 100 },
        metronome: { beatsPerBar: 4, subdivision: 1 }
      },
      checks: [
        'You can retune to open D and back without a tuner once you know the sound.',
        'You can play a twelve-bar in open D.',
        'You have tried lowering the 3rd string to make it minor.'
      ]
    },

    {
      id: 'f5',
      track: 'F',
      title: 'The wider family: CGDGCD, open C and the rest',
      goal: 'Work out any unfamiliar tuning for yourself rather than looking for a chart.',
      time: 22,
      tags: ['tunings', 'exploration'],
      sections: [
        { type: 'text', body:
          'Once you have played in three or four tunings the specific tuning stops mattering, because ' +
          'you know how to find your way. The method is always the same.' },
        { type: 'heading', body: 'How to learn any tuning in twenty minutes' },
        { type: 'list', items: [
          'Play the open strings and name them. Work out what chord they make -- major, minor, sus, or something with no name.',
          'Find the root. Barre every fret and name the chord that results.',
          'Find the octaves. Which pairs of strings are an octave apart? Those are your landmarks.',
          'Find one scale. Play the major scale of the open chord\'s root, anywhere, however awkwardly. That tells you where the semitones fell.',
          'Only then look for chord shapes. If you start there you learn shapes; if you finish there you learn the tuning.'
        ] },
        { type: 'heading', body: 'CGDGCD' },
        { type: 'text', body:
          'A DADGAD-like tuning a fourth lower on the outer strings. Very deep, very resonant, and ' +
          'popular in modern fingerstyle. The open strings give you Csus2 with a G on top.' },
        { type: 'chords', tuning: 'cgdgcd', items: [
          { symbol: 'Csus2' }, { symbol: 'C' }, { symbol: 'F' }, { symbol: 'G' }, { symbol: 'Am' }
        ], note: 'Found by search in CGDGCD. The tuning is not in most chord books; the engine does not care.' },
        { type: 'heading', body: 'Open C' },
        { type: 'chords', tuning: 'openC', items: [
          { symbol: 'C' }, { symbol: 'F' }, { symbol: 'G' }, { symbol: 'Am' }
        ], note: 'C G C G C E. Enormous, and hard on a light-gauge set.' },
        { type: 'callout', kind: 'warning', body:
          'Tuning strings up rather than down is where guitars get damaged. Open C requires the 5th ' +
          'string to go up a tone if you come from standard -- go down to it from open D instead, or ' +
          'use a heavier gauge.' }
      ],
      drill: {
        name: 'Twenty minutes in a new tuning',
        how: 'Pick a tuning you have never used. Work through the five steps above with a timer. At ' +
             'the end, write down four chord shapes you found yourself. Do not look anything up.',
        bpm: { start: 60, target: 90 },
        metronome: { beatsPerBar: 4, subdivision: 1 }
      },
      checks: [
        'You can identify the chord made by any set of open strings.',
        'You found your own shapes rather than looking them up.',
        'You know which strings you are raising and by how much before you retune.'
      ]
    },

    {
      id: 'f6',
      track: 'F',
      title: 'Writing in an open tuning',
      goal: 'Use a tuning as a compositional tool rather than a party trick.',
      time: 25,
      tags: ['composition', 'tunings'],
      sections: [
        { type: 'text', body:
          'The reason to write in an alternate tuning is not novelty. It is that your hands go to ' +
          'different places, and different places produce different music. A tuning is a way of ' +
          'getting out of your own habits.' },
        { type: 'heading', body: 'What tunings are good at' },
        { type: 'list', items: [
          'Drones. Open strings ringing under a moving line, which standard tuning makes awkward in most keys.',
          'Wide voicings. Notes spread further apart than a hand can manage in standard tuning, which is why open-tuned guitars sound bigger.',
          'Unusual intervals. Seconds and fourths that would need a stretch become adjacent open strings.',
          'Simplicity. A one-finger chord frees the other three fingers for a melody.'
        ] },
        { type: 'heading', body: 'A way in' },
        { type: 'list', items: [
          'Retune, then play nothing but open strings for a minute. Listen to what the tuning wants.',
          'Find one shape you like. Move it up and down the neck without changing it. Open tunings reward this far more than standard does.',
          'Keep at least two strings open in every chord. That is the sound you retuned for.',
          'Write the melody on the top two strings and let everything else drone.',
          'Do not transcribe it into standard tuning afterwards. It will not survive.'
        ] },
        { type: 'callout', kind: 'tip', body:
          'Record everything while you explore. Almost nobody remembers the shape they found ten ' +
          'minutes ago in an unfamiliar tuning, and a lot of good ideas are lost that way.' }
      ],
      drill: {
        name: 'One shape, whole neck',
        how: 'In DADGAD or open G, find a fingering that uses two fretted notes and four open strings. ' +
             'Move it to every fret from 0 to 12 without changing the shape. Note which positions sound ' +
             'good. Build a piece from three of them.',
        bpm: { start: 66, target: 96 },
        metronome: { beatsPerBar: 4, subdivision: 1 }
      },
      checks: [
        'You have written something in an alternate tuning that you could not have written in standard.',
        'At least two strings ring open in most of your chords.',
        'You can play it from memory a week later.'
      ]
    }
  ];
}(window.GL = window.GL || {}));
