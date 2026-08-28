/* lessons-barre.js -- Track A: barre chords and chord mastery.

   Lesson schema (shared by every track):

     id       stable string, used as the progress key -- never renumber these
     track    letter matching TRACKS in course.js
     title    short
     goal     one sentence: what you can do afterwards that you could not before
     time     suggested minutes
     tags     free-form, used by search later
     sections ordered content blocks, see course.js renderSection for the types
     drill    the thing to actually practise, wired to the metronome
     checks   how you know you have it, rather than "practise until good"
*/
(function (GL) {
  'use strict';

  GL.lessons = GL.lessons || {};

  /* E-shape barre at fret n, and its relatives. Written as functions so the
     lessons can show the same shape in whatever key makes the point. */
  function eShape(n, kind) {
    return {
      maj:  [n, n + 2, n + 2, n + 1, n, n],
      min:  [n, n + 2, n + 2, n, n, n],
      dom7: [n, n + 2, n, n + 1, n, n],
      min7: [n, n + 2, n, n, n, n],
      maj7: [n, n + 2, n + 1, n + 1, n, n]
    }[kind];
  }

  function aShape(n, kind) {
    return {
      maj:  [-1, n, n + 2, n + 2, n + 2, n],
      min:  [-1, n, n + 2, n + 2, n + 1, n],
      dom7: [-1, n, n + 2, n, n + 2, n],
      min7: [-1, n, n + 2, n, n + 1, n],
      maj7: [-1, n, n + 2, n + 1, n + 2, n]
    }[kind];
  }

  GL.lessons.barre = [

    {
      id: 'a1',
      track: 'A',
      title: 'The E-shape barre family',
      goal: 'Play any major, minor, dominant, minor 7th or major 7th chord with a root on the 6th string.',
      time: 20,
      tags: ['barre', 'caged', 'e-shape'],
      sections: [
        { type: 'text', body:
          'You already know the open E shapes. A barre chord is nothing more than one of those ' +
          'shapes moved up the neck, with your index finger doing the job the nut used to do. ' +
          'That is the whole idea, and everything in this track follows from it.' },
        { type: 'text', body:
          'The reason to start here is that the root sits on the 6th string. If you know where the ' +
          'notes are on the 6th string, you can play any of these five chord types in any key ' +
          'immediately. Two facts, one shape family, twelve keys.' },
        { type: 'heading', body: 'The five shapes, shown at the 1st fret' },
        { type: 'chords', items: [
          { symbol: 'F', frets: eShape(1, 'maj'), caption: 'from open E' },
          { symbol: 'Fm', frets: eShape(1, 'min'), caption: 'from open Em' },
          { symbol: 'F7', frets: eShape(1, 'dom7'), caption: 'from open E7' },
          { symbol: 'Fm7', frets: eShape(1, 'min7'), caption: 'from open Em7' },
          { symbol: 'Fmaj7', frets: eShape(1, 'maj7'), caption: 'from open Emaj7' }
        ], note: 'Click any of them to hear it. Notice the shape under the barre is exactly the open chord.' },
        { type: 'heading', body: 'Making the barre actually sound' },
        { type: 'list', items: [
          'Roll the index finger slightly onto its outside edge. The flat pad of a finger has creases in it, and the strings find them.',
          'Put the thumb behind the neck, roughly opposite the middle finger. If it is hooked over the top you cannot generate the squeeze.',
          'Pull the elbow in towards your body. Most of the force should come from the arm, not from gripping with the hand.',
          'The barre only has to press the strings the other fingers are not already covering. For the major shape that is strings 6, 2 and 1 -- so aim the pressure there.'
        ] },
        { type: 'callout', kind: 'tip', body:
          'If the chord buzzes, find out WHICH string buzzes before you squeeze harder. Play it one ' +
          'string at a time. Nine times out of ten it is the 2nd string, and the fix is rolling the ' +
          'finger, not more force.' },
        { type: 'heading', body: 'Naming them' },
        { type: 'text', body:
          'The barre fret is the root. Fret 1 on the 6th string is F, fret 3 is G, fret 5 is A, ' +
          'fret 8 is C. Learn those four and you can find the rest by stepping a fret at a time.' },
        { type: 'fretboard', singleString: 6, label: 'note',
          caption: 'The 6th string. Every one of these is the root of an E-shape barre chord.' }
      ],
      drill: {
        name: 'Five shapes, one fret',
        how: 'Sit at the 5th fret (A). Play Amaj, Am, A7, Am7, Amaj7 in that order, one bar each, ' +
             'without lifting the barre between them. Then move to the 3rd fret and do the same in G.',
        bpm: { start: 60, target: 92 },
        metronome: { beatsPerBar: 4, subdivision: 1 }
      },
      checks: [
        'Every string rings cleanly in all five shapes, checked one string at a time.',
        'You can go from any one of the five to any other without releasing the barre.',
        'You can name the chord before you play it, from the fret number alone.'
      ]
    },

    {
      id: 'a2',
      track: 'A',
      title: 'The A-shape barre family',
      goal: 'Play the same five chord types with a root on the 5th string.',
      time: 20,
      tags: ['barre', 'caged', 'a-shape'],
      sections: [
        { type: 'text', body:
          'Same idea, different anchor. These come from the open A shapes, the root is on the 5th ' +
          'string, and they are lighter than the E shapes because you are only barring five strings ' +
          'and often only need three of them fretted.' },
        { type: 'chords', items: [
          { symbol: 'Bb', frets: aShape(1, 'maj') },
          { symbol: 'Bbm', frets: aShape(1, 'min') },
          { symbol: 'Bb7', frets: aShape(1, 'dom7') },
          { symbol: 'Bbm7', frets: aShape(1, 'min7') },
          { symbol: 'Bbmaj7', frets: aShape(1, 'maj7') }
        ] },
        { type: 'heading', body: 'The ring-finger barre' },
        { type: 'text', body:
          'For the major shape, most players flatten the ring finger across strings 4, 3 and 2 rather ' +
          'than using three separate fingers. It is faster and it frees the little finger. The catch ' +
          'is that the flattened ring finger tends to touch the 1st string and kill it.' },
        { type: 'text', body:
          'There are two honest answers to that. Either arch the ring finger enough to clear the 1st ' +
          'string, which takes time to develop, or deliberately mute the 1st string and play a ' +
          'five-string chord. The second is what a lot of good players do, and nobody notices.' },
        { type: 'callout', kind: 'note', body:
          'The A-shape minor is the one that genuinely needs three separate fingers. There is no ' +
          'shortcut there, because the notes are not all on the same fret.' },
        { type: 'heading', body: 'Where the roots are' },
        { type: 'fretboard', singleString: 5, label: 'note',
          caption: 'The 5th string. Fret 1 is Bb, fret 3 is C, fret 5 is D, fret 7 is E.' }
      ],
      drill: {
        name: 'Five shapes on the 5th string',
        how: 'At the 3rd fret (C): Cmaj, Cm, C7, Cm7, Cmaj7, one bar each. Then the 5th fret (D). ' +
             'Check the 1st string every time -- decide whether you are ringing it or muting it, ' +
             'and be consistent.',
        bpm: { start: 60, target: 92 },
        metronome: { beatsPerBar: 4, subdivision: 1 }
      },
      checks: [
        'You can play the A-shape major both ways: with the ring-finger barre and with three fingers.',
        'You know the notes on the 5th string up to the 12th fret without counting.',
        'Bbm7 and Bbmaj7 are as easy as Bb.'
      ]
    },

    {
      id: 'a3',
      track: 'A',
      title: 'Two shapes, every key',
      goal: 'Play any progression anywhere on the neck by choosing the nearer of the two barre shapes.',
      time: 18,
      tags: ['barre', 'position', 'economy'],
      sections: [
        { type: 'text', body:
          'With E shapes and A shapes you can play any of those five chord types in any of the twelve ' +
          'keys, in two different places each. The skill now is choosing which one, and the rule is ' +
          'almost always: whichever is closer to where your hand already is.' },
        { type: 'text', body:
          'Take a I-vi-IV-V in C. Played entirely with 6th-string roots you would go fret 8, fret 5, ' +
          'fret 1, fret 3 -- a lot of travel. Mix the shapes and the hand barely moves.' },
        { type: 'progression', key: 'C', tempo: 84, beatsPerChord: 4,
          items: [
            { symbol: 'C', frets: aShape(3, 'maj'), label: 'A shape, fret 3' },
            { symbol: 'Am', frets: aShape(12, 'min'), label: 'A shape, fret 12' },
            { symbol: 'F', frets: eShape(1, 'maj'), label: 'E shape, fret 1' },
            { symbol: 'G', frets: eShape(3, 'maj'), label: 'E shape, fret 3' }
          ],
          caption: 'The obvious way, and it is a lot of walking.' },
        { type: 'progression', key: 'C', tempo: 84, beatsPerChord: 4,
          items: [
            { symbol: 'C', frets: aShape(3, 'maj'), label: 'A shape, fret 3' },
            { symbol: 'Am', frets: eShape(5, 'min'), label: 'E shape, fret 5' },
            { symbol: 'F', frets: aShape(8, 'maj'), label: 'A shape, fret 8' },
            { symbol: 'G', frets: eShape(3, 'maj'), label: 'E shape, fret 3' }
          ],
          caption: 'Same four chords, mixing the shapes. Listen to how much smoother it sits.' },
        { type: 'callout', kind: 'tip', body:
          'A useful working rule: if the next chord is more than five frets away in the shape you are ' +
          'holding, the other shape is probably closer.' }
      ],
      drill: {
        name: 'Nearest shape wins',
        how: 'Take any four-chord progression you know. Play it three times: all E shapes, all A ' +
             'shapes, then whichever is nearest. Notice which one you can play fastest and which ' +
             'one sounds most connected.',
        bpm: { start: 70, target: 110 },
        metronome: { beatsPerBar: 4, subdivision: 1 }
      },
      checks: [
        'For any chord you can name both places it lives below the 12th fret.',
        'You choose shapes by proximity without having to think about it.'
      ]
    },

    {
      id: 'a4',
      track: 'A',
      title: 'C, G and D forms: finishing CAGED',
      goal: 'Recognise all five moveable forms of a major chord and know which are worth playing.',
      time: 22,
      tags: ['caged', 'barre'],
      sections: [
        { type: 'text', body:
          'CAGED says the same five open shapes -- C, A, G, E, D -- cover the entire neck for any ' +
          'chord. Two of them you now play constantly. The other three are more awkward, and it is ' +
          'worth being honest about which are practical and which are mostly there to explain the ' +
          'geography.' },
        { type: 'heading', body: 'All five forms of C major' },
        { type: 'chords', items: [
          { symbol: 'C', frets: [-1, 3, 2, 0, 1, 0], caption: 'C form, open' },
          { symbol: 'C', frets: [-1, 3, 5, 5, 5, 3], caption: 'A form, fret 3' },
          { symbol: 'C', frets: [8, 7, 5, 5, 5, 8], caption: 'G form, fret 5' },
          { symbol: 'C', frets: [8, 10, 10, 9, 8, 8], caption: 'E form, fret 8' },
          { symbol: 'C', frets: [-1, -1, 10, 12, 13, 12], caption: 'D form, fret 10' }
        ], note: 'Five ways to play exactly the same chord. Play them in order and hear the voicing climb.' },
        { type: 'heading', body: 'Which ones earn their keep' },
        { type: 'list', items: [
          'E and A forms: constantly. These are your barre chords.',
          'D form: often, especially as a three or four-string voicing high up. Very useful in fingerstyle.',
          'C form: occasionally, usually with the top note as a melody. The full barred version is a stretch and rarely worth it.',
          'G form: rarely as a full barre. Its value is that it explains where the notes are, and its top half makes a good triad.'
        ] },
        { type: 'callout', kind: 'note', body:
          'The real payoff of CAGED is not five barre chords. It is that the scale shapes, the ' +
          'arpeggios and the triads all line up with these five forms, so learning one teaches the ' +
          'others. That is what the fretboard track builds on.' }
      ],
      drill: {
        name: 'One chord, five places',
        how: 'Pick a major chord. Play all five forms from the nut upward, then back down, four ' +
             'beats each. Say the form name out loud as you play it.',
        bpm: { start: 56, target: 76 },
        metronome: { beatsPerBar: 4, subdivision: 1 }
      },
      checks: [
        'You can play all five forms of at least three different major chords.',
        'You can say which form you are in without looking at the fret number.'
      ]
    },

    {
      id: 'a5',
      track: 'A',
      title: 'Triads on the top strings',
      goal: 'Play major and minor triads in all inversions on strings 1-2-3 and 2-3-4.',
      time: 22,
      tags: ['triads', 'inversions', 'comping'],
      sections: [
        { type: 'text', body:
          'A triad is three notes. A barre chord is those same three notes with some of them doubled. ' +
          'Strip the doubling away and you get small shapes high on the neck that stay out of the way ' +
          'of a singer, cut through in a band, and make chord melody possible.' },
        { type: 'text', body:
          'They are not new shapes. Every one of them is already inside a barre chord you know -- it ' +
          'is the top three strings of it.' },
        { type: 'text', body:
          'The inversion is named by whichever note is lowest. C E G is root position; E G C is first ' +
          'inversion; G C E is second. Climbing the neck you meet them in that cycle, over and over.' },
        { type: 'heading', body: 'C major on strings 1, 2 and 3' },
        { type: 'chords', items: [
          { symbol: 'C/G', frets: [-1, -1, -1, 0, 1, 0], caption: '2nd inversion, open' },
          { symbol: 'C', frets: [-1, -1, -1, 5, 5, 3], caption: 'root position' },
          { symbol: 'C/E', frets: [-1, -1, -1, 9, 8, 8], caption: '1st inversion' },
          { symbol: 'C/G', frets: [-1, -1, -1, 12, 13, 12], caption: '2nd inversion, octave up' }
        ], note: 'Same three notes each time, in a different order. Listen to how the character changes.' },
        { type: 'heading', body: 'C minor, the same places' },
        { type: 'chords', items: [
          { symbol: 'Cm', frets: [-1, -1, -1, 5, 4, 3], caption: 'root position' },
          { symbol: 'Cm/Eb', frets: [-1, -1, -1, 8, 8, 8], caption: '1st inversion' },
          { symbol: 'Cm/G', frets: [-1, -1, -1, 12, 13, 11], caption: '2nd inversion' }
        ], note: 'Three, not four: the open-position voicing would need an Eb below the open E string, ' +
                 'and the guitar does not have one.' },
        { type: 'callout', kind: 'tip', body:
          'Major becomes minor by moving exactly one note down a fret -- the third. Compare the pairs ' +
          'above and you will find it: 5-5-3 becomes 5-4-3, 9-8-8 becomes 8-8-8, 12-13-12 becomes ' +
          '12-13-11. One finger, every time. Learn which finger it is in each shape and you have ' +
          'learned both sets at once.' }
      ],
      drill: {
        name: 'Climb the inversions',
        how: 'Pick a key. Play the triad in root position on strings 1-2-3, then climb through every ' +
             'inversion to the 12th fret and back down. Then do the same on strings 2-3-4. ' +
             'Two beats each.',
        bpm: { start: 60, target: 96 },
        metronome: { beatsPerBar: 4, subdivision: 2 }
      },
      checks: [
        'You can play three inversions of any major or minor triad on the top three strings.',
        'You know which note is the third in each inversion, and can flip major to minor instantly.'
      ]
    },

    {
      id: 'a6',
      track: 'A',
      title: 'Slash chords and moving bass lines',
      goal: 'Control the bass note independently of the chord, and write a bass line that walks.',
      time: 20,
      tags: ['slash', 'bass', 'voice leading'],
      sections: [
        { type: 'text', body:
          'A slash chord just means "this chord, with that note in the bass". G/B is a G chord with B ' +
          'underneath. It matters because the bass note is the line the ear follows, and a bass line ' +
          'that moves by step sounds enormously more finished than one that jumps around.' },
        { type: 'heading', body: 'The descending line' },
        { type: 'text', body:
          'This is one of the most used devices in folk and pop, and once you hear it you will hear it ' +
          'everywhere. The chords change; the bass simply walks down.' },
        { type: 'progression', key: 'C', tempo: 78, beatsPerChord: 4,
          items: [
            { symbol: 'C', frets: [-1, 3, 2, 0, 1, 0], label: 'bass C' },
            { symbol: 'G/B', frets: [-1, 2, 0, 0, 0, 3], label: 'bass B' },
            { symbol: 'Am', frets: [-1, 0, 2, 2, 1, 0], label: 'bass A' },
            { symbol: 'Am/G', frets: [3, 0, 2, 2, 1, 0], label: 'bass G' },
            { symbol: 'F', frets: [-1, -1, 3, 2, 1, 1], label: 'bass F' },
            { symbol: 'G', frets: [3, 2, 0, 0, 0, 3], label: 'bass G' }
          ],
          caption: 'C, B, A, G, F, G. Listen to the bass on its own -- it is a melody.' },
        { type: 'heading', body: 'The other direction' },
        { type: 'progression', key: 'D', tempo: 78, beatsPerChord: 4,
          items: [
            { symbol: 'D', frets: [-1, -1, 0, 2, 3, 2] },
            { symbol: 'D/F#', frets: [2, -1, 0, 2, 3, 2] },
            { symbol: 'G', frets: [3, 2, 0, 0, 0, 3] },
            { symbol: 'A', frets: [-1, 0, 2, 2, 2, 0] }
          ],
          caption: 'D, F#, G, A -- the bass climbs into the G and pushes on to the A.' },
        { type: 'callout', kind: 'tip', body:
          'When you are stuck joining two chords, look at their bass notes. If they are three or four ' +
          'frets apart, there is almost always a slash chord that fits in between.' }
      ],
      drill: {
        name: 'Bass line first',
        how: 'Take a progression you know. Play only the bass notes, one per bar, and listen to the ' +
             'shape of that line alone. Then find slash chords that fill the gaps so it moves by ' +
             'step. Then play the whole thing.',
        bpm: { start: 66, target: 90 },
        metronome: { beatsPerBar: 4, subdivision: 1 }
      },
      checks: [
        'You can play the C-B-A-G-F line cleanly and hear the bass as a separate voice.',
        'Given any two chords, you can find a passing bass note between them.'
      ]
    },

    {
      id: 'a7',
      track: 'A',
      title: 'Colour chords, and keeping a common tone',
      goal: 'Use add9, sus, maj7, m9 and 6/9 voicings where a plain triad would be dull.',
      time: 20,
      tags: ['extensions', 'voice leading', 'acoustic'],
      sections: [
        { type: 'text', body:
          'On a steel-string, the thing that makes a chord sound rich is usually not adding a lot of ' +
          'notes. It is holding one note still while the chords move underneath it. An open high E or ' +
          'B string ringing through a whole progression will do more than any amount of theory.' },
        { type: 'heading', body: 'One finger stays put' },
        { type: 'progression', key: 'G', tempo: 80, beatsPerChord: 4,
          items: [
            { symbol: 'G', frets: [3, 2, 0, 0, 3, 3] },
            { symbol: 'Cadd9', frets: [-1, 3, 2, 0, 3, 3] },
            { symbol: 'Em7', frets: [0, 2, 2, 0, 3, 3] },
            { symbol: 'Dsus4', frets: [-1, -1, 0, 2, 3, 3] }
          ],
          caption: 'The top two strings never move. Four different chords, one unchanging colour on top.' },
        { type: 'heading', body: 'The shapes worth having' },
        { type: 'chords', items: [
          { symbol: 'Cadd9', frets: [-1, 3, 2, 0, 3, 3], caption: 'brighter C' },
          { symbol: 'Dsus2', frets: [-1, -1, 0, 2, 3, 0], caption: 'open, unresolved' },
          { symbol: 'Asus4', frets: [-1, 0, 2, 2, 3, 0], caption: 'wants to fall back to A' },
          { symbol: 'Fmaj7', frets: [-1, -1, 3, 2, 1, 0], caption: 'no barre needed' },
          { symbol: 'Em9', frets: [0, 2, 0, 0, 0, 2], caption: 'lush and easy' },
          { symbol: 'G6/9', frets: [3, -1, 0, 2, 0, 0], caption: 'jangly, folk' }
        ] },
        { type: 'callout', kind: 'note', body:
          'Suspended chords are not decorations. A sus4 is genuinely unstable -- it wants to resolve ' +
          'down to the 3rd. Play Asus4 then A and you can feel it happen. Using them well means ' +
          'using that tension, not just sprinkling them about.' }
      ],
      drill: {
        name: 'Hold the top, move the bottom',
        how: 'Fret the top two strings at the 3rd fret with your ring and little finger and leave them ' +
             'there. Now find as many chords as you can underneath them without moving those fingers. ' +
             'There are more than you expect.',
        bpm: { start: 70, target: 96 },
        metronome: { beatsPerBar: 4, subdivision: 1 }
      },
      checks: [
        'You can play a four-chord progression keeping at least one note common throughout.',
        'You use sus chords to create and release tension, not as random colour.'
      ]
    },

    {
      id: 'a8',
      track: 'A',
      title: 'Substitutions: borrowing and redirecting',
      goal: 'Replace a predictable chord with one that does the same job but sounds better.',
      time: 25,
      tags: ['harmony', 'substitution', 'theory'],
      sections: [
        { type: 'text', body:
          'A substitution works when the replacement does the same harmonic job -- points to the same ' +
          'place -- while sounding different. Four are worth knowing well; everything else is a ' +
          'variation on them.' },
        { type: 'heading', body: '1. Relative substitution' },
        { type: 'text', body:
          'Every major chord has a minor a third below it sharing two of its three notes. C and Am ' +
          'share C and E. Swapping one for the other barely changes the harmony but completely ' +
          'changes the mood.' },
        { type: 'progression', key: 'C', tempo: 84, beatsPerChord: 4,
          items: [
            { symbol: 'C', frets: [-1, 3, 2, 0, 1, 0] },
            { symbol: 'Am', frets: [-1, 0, 2, 2, 1, 0] },
            { symbol: 'F', frets: [-1, -1, 3, 2, 1, 1] },
            { symbol: 'Dm', frets: [-1, -1, 0, 2, 3, 1] }
          ],
          caption: 'C to Am, F to Dm. Each pair is nearly the same chord.' },
        { type: 'heading', body: '2. Secondary dominants' },
        { type: 'text', body:
          'Any chord can be approached by the dominant 7th a fifth above it. To make the Am in C major ' +
          'arrive with more weight, precede it with E7 -- the V of Am. It borrows a note from outside ' +
          'the key, which is exactly why it pulls.' },
        { type: 'progression', key: 'C', tempo: 84, beatsPerChord: 4,
          items: [
            { symbol: 'C', frets: [-1, 3, 2, 0, 1, 0] },
            { symbol: 'E7', frets: [0, 2, 0, 1, 0, 0], label: 'V of Am' },
            { symbol: 'Am', frets: [-1, 0, 2, 2, 1, 0] },
            { symbol: 'G', frets: [3, 2, 0, 0, 0, 3] }
          ] },
        { type: 'heading', body: '3. Modal interchange' },
        { type: 'text', body:
          'Borrow a chord from the parallel minor. In C major, the two that show up constantly in folk ' +
          'and rock are Fm (the minor iv) and Bb (the flat VII). Both are outside the key and both ' +
          'sound completely natural.' },
        { type: 'progression', key: 'C', tempo: 80, beatsPerChord: 4,
          items: [
            { symbol: 'C', frets: [-1, 3, 2, 0, 1, 0] },
            { symbol: 'F', frets: [-1, -1, 3, 2, 1, 1] },
            { symbol: 'Fm', frets: [-1, -1, 3, 1, 1, 1], label: 'borrowed iv' },
            { symbol: 'C', frets: [-1, 3, 2, 0, 1, 0] }
          ],
          caption: 'The minor iv is one of the saddest sounds available in a major key.' },
        { type: 'heading', body: '4. Tritone substitution' },
        { type: 'text', body:
          'Replace a dominant 7th with the dominant 7th three whole tones away. G7 and Db7 share the ' +
          'same two notes that make a dominant chord want to resolve, so Db7 can go to C just as G7 ' +
          'does -- and the bass line falls by a semitone instead of a fifth.' },
        { type: 'progression', key: 'C', tempo: 80, beatsPerChord: 4,
          items: [
            { symbol: 'Dm7', frets: [-1, -1, 0, 2, 1, 1] },
            { symbol: 'Db7', frets: [-1, 4, 3, 4, 2, -1], label: 'in place of G7' },
            { symbol: 'C', frets: [-1, 3, 2, 0, 1, 0] }
          ] }
      ],
      drill: {
        name: 'Rewrite a progression',
        how: 'Take a plain I-vi-IV-V. Make four versions: one with a relative substitution, one with a ' +
             'secondary dominant, one with a borrowed chord, one with a tritone sub. Play each until ' +
             'you can hear what it does rather than just knowing what it is called.',
        bpm: { start: 70, target: 96 },
        metronome: { beatsPerBar: 4, subdivision: 1 }
      },
      checks: [
        'You can name the relative minor of any major chord instantly.',
        'You can find the secondary dominant of any chord in a key.',
        'You can hear the difference between a borrowed iv and a plain IV without looking.'
      ]
    }
  ];
}(window.GL = window.GL || {}));
