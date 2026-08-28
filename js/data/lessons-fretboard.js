/* lessons-fretboard.js -- Track C: knowing the neck, and improvising on it.

   The through-line: shapes are useless without knowing what the notes inside
   them are doing. Every lesson here connects a shape to a function.
*/
(function (GL) {
  'use strict';

  GL.lessons = GL.lessons || {};

  GL.lessons.fretboard = [

    {
      id: 'c1',
      track: 'C',
      title: 'Mapping the neck by octaves',
      goal: 'Find any note anywhere on the neck in under two seconds.',
      time: 20,
      tags: ['fretboard', 'notes'],
      sections: [
        { type: 'text', body:
          'Learning 132 individual positions is hopeless. Learning six string names and three octave ' +
          'shapes is not, and it gets you the same result.' },
        { type: 'heading', body: 'The three octave shapes' },
        { type: 'list', items: [
          'String 6 to string 4: up two frets. The same shape works from string 5 to string 3.',
          'String 4 to string 2: up three frets. The same shape works from string 3 to string 1.',
          'String 6 to string 1: same fret, two octaves up. Strings 6 and 1 are both E.'
        ] },
        { type: 'text', body:
          'That is it. If you know the notes on strings 6 and 5, the octave shapes give you strings 4, ' +
          '3, 2 and 1 for free.' },
        { type: 'fretboard', singleString: 6, label: 'note',
          caption: 'String 6. The natural notes are the ones to learn first -- the sharps sit between them.' },
        { type: 'fretboard', singleString: 5, label: 'note',
          caption: 'String 5. Learn these two and the octave shapes handle the rest.' },
        { type: 'callout', kind: 'tip', body:
          'Anchor on the dots. Fret 3 is G on string 6 and C on string 5. Fret 5 is A and D. Fret 7 is ' +
          'B and E. Fret 9 is C# and F#. Four pairs, and everything else is one fret away from one of them.' }
      ],
      drill: {
        name: 'One note, six strings',
        how: 'Pick a note. Find every place it occurs below the 12th fret, lowest string to highest, ' +
             'saying the string number out loud. Then a different note. Use the Trainer\'s "find the ' +
             'note" drill for the timed version.',
        bpm: { start: 50, target: 70 },
        metronome: { beatsPerBar: 4, subdivision: 1 }
      },
      checks: [
        'You can name any fret on strings 6 and 5 without counting up from the nut.',
        'You can find all six positions of a given note in under fifteen seconds.',
        'The octave shapes are automatic, not calculated.'
      ]
    },

    {
      id: 'c2',
      track: 'C',
      title: 'The major scale in five positions',
      goal: 'Play the major scale anywhere on the neck using the CAGED shapes.',
      time: 25,
      tags: ['scales', 'caged', 'major'],
      sections: [
        { type: 'text', body:
          'Five shapes cover the neck. Each one surrounds one of the five CAGED chord forms, which is ' +
          'the point -- the scale and the chord are the same information drawn two ways.' },
        { type: 'fretboard', root: 'G', scale: 'major', mode: 'box', position: 0, label: 'degree',
          caption: 'Position 1. The amber notes are the root.' },
        { type: 'fretboard', root: 'G', scale: 'major', mode: 'box', position: 2, label: 'degree',
          caption: 'Position 3, further up the neck. Same notes, different fingering.' },
        { type: 'text', body:
          'Use the Scales section to step through all five at your own pace, and to see them in any ' +
          'key. What matters here is not memorising five diagrams but noticing that they overlap: ' +
          'the top of one box is the bottom of the next.' },
        { type: 'heading', body: 'Practise them as music, not shapes' },
        { type: 'list', items: [
          'Ascending and descending is the least useful way to practise a scale, because no melody works like that.',
          'Play in thirds: 1-3, 2-4, 3-5, and so on. This is where the sound of the scale actually lives.',
          'Play sequences of four: 1-2-3-4, 2-3-4-5, 3-4-5-6.',
          'Always start and end on the root, so your ear learns where home is.'
        ] },
        { type: 'callout', kind: 'note', body:
          'You do not need all five positions before you can use one. One position, known thoroughly ' +
          'enough to make music in, beats five known vaguely. Learn position 1 properly, then add.' }
      ],
      drill: {
        name: 'Thirds through one position',
        how: 'One position, one key. Play the scale in thirds up and back down. Then in fours. Do not ' +
             'move to another position until this one is comfortable at 90 bpm.',
        bpm: { start: 60, target: 100 },
        metronome: { beatsPerBar: 4, subdivision: 2 }
      },
      checks: [
        'You can play one position in thirds without hesitating.',
        'You can find the root notes inside the shape without counting.',
        'You can start the scale on any degree, not just the root.'
      ]
    },

    {
      id: 'c3',
      track: 'C',
      title: 'The pentatonics, and connecting them',
      goal: 'Move between the five pentatonic positions without stopping at the box edges.',
      time: 25,
      tags: ['pentatonic', 'improvisation'],
      sections: [
        { type: 'text', body:
          'You almost certainly know pentatonic box 1. The problem it creates is that it is a box, and ' +
          'you get stuck in it. This lesson is about the joins.' },
        { type: 'fretboard', root: 'A', scale: 'minorPentatonic', mode: 'whole', label: 'degree',
          caption: 'A minor pentatonic across the whole neck. The boxes are arbitrary; this is the real map.' },
        { type: 'heading', body: 'Three ways out of a box' },
        { type: 'list', items: [
          'Slide. Play the highest note in the box on a string, then slide that finger up to the next note on the same string. You are now in the next position.',
          'Use the root notes. Every position contains roots. Find the root nearest your hand and move to the next one up.',
          'Play across the strings instead of along them. Two-string patterns move up the neck naturally and never feel like leaving a box.'
        ] },
        { type: 'heading', body: 'Major and minor pentatonic are the same shapes' },
        { type: 'text', body:
          'A minor pentatonic and C major pentatonic contain identical notes. The only difference is ' +
          'which note you treat as home. This is why blues players slip between the two sounds without ' +
          'changing shape -- they are moving the target, not the fingering.' },
        { type: 'fretboard', root: 'C', scale: 'majorPentatonic', mode: 'whole', label: 'degree',
          caption: 'C major pentatonic. Compare with the A minor pentatonic above: same dots, different roots.' }
      ],
      drill: {
        name: 'Two boxes, one phrase',
        how: 'Play a four-note phrase in position 1. Play the same phrase in position 2. Then play it ' +
             'starting in position 1 and finishing in position 2, using a slide to get there. Then ' +
             'reverse it.',
        bpm: { start: 66, target: 108 },
        metronome: { beatsPerBar: 4, subdivision: 2 }
      },
      checks: [
        'You can play a phrase that crosses two positions without a break in the rhythm.',
        'You know where the roots are in at least three positions.',
        'You can switch between the major and minor pentatonic sound over the same chord.'
      ]
    },

    {
      id: 'c4',
      track: 'C',
      title: 'The blue notes',
      goal: 'Use the flat 5 and the major/minor third rub without it sounding like a mistake.',
      time: 20,
      tags: ['blues', 'pentatonic'],
      sections: [
        { type: 'text', body:
          'The blues scale is the minor pentatonic with a flat 5 added. That one note is responsible ' +
          'for most of what people mean by "bluesy", and it is also the easiest note to overuse.' },
        { type: 'fretboard', root: 'A', scale: 'bluesMinor', mode: 'box', position: 0, label: 'degree',
          caption: 'A minor blues, position 1. The b5 is the note that was not there before.' },
        { type: 'heading', body: 'It is a passing note' },
        { type: 'text', body:
          'The flat 5 wants to move. Land on it and hold it and it sounds wrong, because it is wrong -- ' +
          'that is the point of it. Pass through it on the way to the 5th or back down to the 4th and ' +
          'it sounds like the blues.' },
        { type: 'heading', body: 'The third that is neither' },
        { type: 'text', body:
          'The other blue note is not on the fretboard at all. It sits between the minor and major ' +
          'third, and you get at it by bending the minor third up a bit less than a semitone, or by ' +
          'playing the two thirds close together so the ear averages them.' },
        { type: 'callout', kind: 'tip', body:
          'On a steel-string, a quarter-tone bend on the 3rd string is one of the most useful sounds ' +
          'available. Fret the minor third and push the string just far enough that it sounds ' +
          'uncomfortable. That discomfort is the sound you want.' },
        { type: 'tab', tempo: 76, tone: 'steel',
          bars: [
            '3-2:0.5 3-2b3:0.5, 2-3:1, 2-1:1, 3-2:1',
            '4-2:0.5 3-0:0.5, 3-2:1, 2-1:2'
          ],
          caption: 'A short A blues phrase. The bend in bar 1 is the quarter-tone one -- push less ' +
                   'far than the notation suggests.' }
      ],
      drill: {
        name: 'Earn the flat five',
        how: 'Improvise twelve bars using only the minor pentatonic. Then twelve bars where you may ' +
             'use the flat 5 exactly twice. Making it count is the drill.',
        bpm: { start: 70, target: 100 },
        metronome: { beatsPerBar: 4, subdivision: 2 }
      },
      checks: [
        'You can pass through the flat 5 rather than landing on it.',
        'You can produce a convincing quarter-tone bend.',
        'You use the blue notes sparingly enough that they still register.'
      ]
    },

    {
      id: 'c5',
      track: 'C',
      title: 'Modes: what they actually sound like',
      goal: 'Hear the character of each mode, and know which chord to play it over.',
      time: 30,
      tags: ['modes', 'theory', 'ear'],
      sections: [
        { type: 'text', body:
          'Modes get taught backwards. Being told that D dorian is "the white notes starting on D" is ' +
          'true and completely useless, because it tells you nothing about what it sounds like. The ' +
          'useful way is to compare each mode against the major or minor scale on the same root, and ' +
          'find the one note that differs.' },
        { type: 'heading', body: 'The four worth knowing on acoustic' },
        { type: 'list', items: [
          'Mixolydian: major with a flat 7. The sound of a folk tune that never quite settles, and of every dominant chord. Play it over a 7 chord.',
          'Dorian: minor with a natural 6. Minor but not sad. Enormous in Celtic and modal folk. Play it over a m7.',
          'Lydian: major with a sharp 4. Floating, unresolved, slightly cinematic. Play it over a maj7.',
          'Phrygian: minor with a flat 2. Spanish, dark, immediately recognisable. Play it over a minor chord with the flat 2 in the melody.'
        ] },
        { type: 'text', body:
          'The Scales section will play any of these over a root drone, and that is the only way to ' +
          'really learn them. A mode played without a reference pitch just sounds like the parent ' +
          'scale, because it is.' },
        { type: 'fretboard', root: 'D', scale: 'dorian', mode: 'box', position: 0, label: 'degree',
          caption: 'D dorian. The note to listen for is the 6 -- that is what separates it from D minor.' },
        { type: 'fretboard', root: 'G', scale: 'mixolydian', mode: 'box', position: 0, label: 'degree',
          caption: 'G mixolydian. The b7 is the whole character.' },
        { type: 'callout', kind: 'note', body:
          'Modes only exist relative to a tonal centre that is being reinforced by something. Over a ' +
          'progression that moves, you are almost always playing a key, not a mode. Modal playing ' +
          'needs a drone, a vamp, or a very static harmony.' }
      ],
      drill: {
        name: 'One note apart',
        how: 'Play D minor and D dorian back to back over a D drone. Then G major and G mixolydian. ' +
             'Say out loud which note changed. Do it until you can hear the change before you play it.',
        bpm: { start: 60, target: 90 },
        metronome: { beatsPerBar: 4, subdivision: 1 }
      },
      checks: [
        'You can name the one note that separates each mode from major or minor.',
        'You can hear dorian and aeolian apart in a blind test.',
        'You know which chord type each mode belongs over.'
      ]
    },

    {
      id: 'c6',
      track: 'C',
      title: 'Chord tones and target notes',
      goal: 'Play the changes rather than the key.',
      time: 30,
      tags: ['improvisation', 'arpeggios', 'chord tones'],
      sections: [
        { type: 'text', body:
          'This is the single largest step between sounding like someone running a scale and sounding ' +
          'like someone playing a tune. Instead of playing one scale over a whole progression, you aim ' +
          'at a note from each chord as it arrives.' },
        { type: 'heading', body: 'The method' },
        { type: 'list', items: [
          'Take a progression. Find the third of each chord.',
          'Improvise, but make sure you are on the third of the chord on beat one of every bar.',
          'Everything in between can be anything. The target is what makes it sound intentional.',
          'Then do the same with sevenths. Then alternate.'
        ] },
        { type: 'text', body:
          'The third and the seventh are the notes that define a chord. The root and fifth are the ' +
          'notes that do not -- which is why a bass player can cover them and you do not have to.' },
        { type: 'progression', key: 'G', tempo: 82, beatsPerChord: 4,
          items: [
            { symbol: 'G', frets: [3, 2, 0, 0, 0, 3] },
            { symbol: 'Em', frets: [0, 2, 2, 0, 0, 0] },
            { symbol: 'C', frets: [-1, 3, 2, 0, 1, 0] },
            { symbol: 'D', frets: [-1, -1, 0, 2, 3, 2] }
          ],
          caption: 'Play this and aim for the third of each chord on beat 1: B, G, E, F#.' },
        { type: 'callout', kind: 'tip', body:
          'If a phrase sounds wrong and you cannot work out why, check where you are landing on beat ' +
          'one. Nine times out of ten the notes are all in the key and you are landing on a note that ' +
          'is not in the chord.' }
      ],
      drill: {
        name: 'Thirds on the downbeat',
        how: 'Loop a four-chord progression. Improvise freely but land on the third of each chord on ' +
             'beat 1. Then sevenths. Then alternate third, seventh, third, seventh.',
        bpm: { start: 66, target: 100 },
        metronome: { beatsPerBar: 4, subdivision: 1 }
      },
      checks: [
        'You can name the third and seventh of any chord instantly.',
        'You can hit a target note on beat one without rushing the phrase before it.',
        'Your playing follows the chord changes audibly.'
      ]
    },

    {
      id: 'c7',
      track: 'C',
      title: 'Arpeggios across the neck',
      goal: 'Outline any chord anywhere without falling back on a scale.',
      time: 25,
      tags: ['arpeggios', 'caged'],
      sections: [
        { type: 'text', body:
          'An arpeggio is the chord tones only. Because the chord shapes are already under your ' +
          'fingers from track A, arpeggios are mostly a matter of seeing what is already there.' },
        { type: 'text', body:
          'Take an E-shape barre chord. The arpeggio is those notes plus the ones on the strings you ' +
          'are not fretting. Same hand position, a few extra notes.' },
        { type: 'heading', body: 'Why they beat scales for improvising' },
        { type: 'list', items: [
          'Every note is guaranteed to fit, so there is nothing to avoid.',
          'They outline the harmony, which makes the listener hear the chord change even without a chord.',
          'They cover wide intervals, which stops a line sounding like a scale exercise.',
          'They give you the target notes from the previous lesson, already grouped by chord.'
        ] },
        { type: 'callout', kind: 'tip', body:
          'Play an arpeggio and then add one note between each pair. Those added notes are passing ' +
          'tones, and that is how a real melodic line is built -- chord tones on the strong beats, ' +
          'anything sensible in between.' }
      ],
      drill: {
        name: 'Arpeggio, then fill',
        how: 'Play a maj7 arpeggio in one position, ascending. Then play it again adding one scale note ' +
             'between each chord tone. Then improvise using only chord tones on the beats.',
        bpm: { start: 60, target: 100 },
        metronome: { beatsPerBar: 4, subdivision: 2 }
      },
      checks: [
        'You can play a major, minor and dominant 7 arpeggio from the same root in one position.',
        'You can see the arpeggio inside the chord shape without thinking about it.'
      ]
    },

    {
      id: 'c8',
      track: 'C',
      title: 'Phrasing: motif, answer and space',
      goal: 'Play lines that sound like sentences rather than streams of notes.',
      time: 25,
      tags: ['phrasing', 'improvisation'],
      sections: [
        { type: 'text', body:
          'Most people who can improvise technically still sound aimless, and the reason is almost ' +
          'never note choice. It is that they play continuously. Speech has sentences, and so does ' +
          'music.' },
        { type: 'heading', body: 'Three things that fix it' },
        { type: 'list', items: [
          'Play a short idea -- three or four notes. Then stop for as long as the idea lasted. That silence is what makes the idea register as an idea.',
          'Answer it. Play something that is recognisably related: the same rhythm on different notes, or the same notes with a different ending.',
          'Repeat before you develop. An idea heard once is noise; heard twice it is a theme; heard three times with a change it is composition.'
        ] },
        { type: 'heading', body: 'Rhythm carries more than pitch' },
        { type: 'text', body:
          'Take a phrase you like and play it with completely different notes but exactly the same ' +
          'rhythm. It will still sound like the same phrase. Now play the same notes with a different ' +
          'rhythm; it will sound like a different phrase. Rhythm is doing most of the work, which is ' +
          'why practising scales faster rarely makes anyone sound better.' },
        { type: 'callout', kind: 'tip', body:
          'Sing the phrase first, then find it. If you cannot sing it, it is coming from your hands ' +
          'rather than your ear, and it will sound like it.' }
      ],
      drill: {
        name: 'Four bars, two ideas',
        how: 'Over a loop, play a two-bar idea, then rest for two bars, then answer it. Do not fill ' +
             'the rest. Twelve times. The discipline of the silence is the entire exercise.',
        bpm: { start: 70, target: 100 },
        metronome: { beatsPerBar: 4, subdivision: 1 }
      },
      checks: [
        'You can leave two full bars of silence without getting uncomfortable.',
        'You can repeat a phrase exactly, then vary it deliberately.',
        'You can sing what you are about to play.'
      ]
    },

    {
      id: 'c9',
      track: 'C',
      title: 'Soloing over a twelve-bar blues',
      goal: 'Improvise over the blues form in any key, following the changes.',
      time: 30,
      tags: ['blues', 'improvisation', '12-bar'],
      sections: [
        { type: 'text', body:
          'The blues is where everything in this track gets tested, because the form is short enough ' +
          'to hear whether you are following it and repetitive enough that there is nowhere to hide.' },
        { type: 'progression', key: 'A', tempo: 88, beatsPerChord: 4,
          items: [
            { symbol: 'A7', frets: [-1, 0, 2, 0, 2, 0], label: 'I7' },
            { symbol: 'D7', frets: [-1, -1, 0, 2, 1, 2], label: 'IV7' },
            { symbol: 'A7', frets: [-1, 0, 2, 0, 2, 0], label: 'I7' },
            { symbol: 'E7', frets: [0, 2, 0, 1, 0, 0], label: 'V7' }
          ],
          caption: 'The three chords. The form is I for four bars, IV for two, I for two, V, IV, I, V.' },
        { type: 'heading', body: 'Three levels of the same solo' },
        { type: 'list', items: [
          'Level one: minor pentatonic over the whole thing. Always works, never surprises anyone.',
          'Level two: follow the changes. Aim at the third of each chord as it arrives. Suddenly it sounds like you know where you are.',
          'Level three: mix major and minor pentatonic. Major over the I, minor over the IV. This is the sound of nearly every blues player worth listening to.'
        ] },
        { type: 'callout', kind: 'note', body:
          'The reason a blues in A uses A7, D7 and E7 -- all dominant chords, which does not happen in ' +
          'any normal key -- is that the blues is not really in a major key at all. It is a form with ' +
          'its own rules, and that is why the minor pentatonic works over major chords.' }
      ],
      drill: {
        name: 'One chorus each way',
        how: 'Twelve bars with minor pentatonic only. Twelve following the changes. Twelve mixing ' +
             'major and minor pentatonic. Then twelve where every phrase is answered by silence.',
        bpm: { start: 76, target: 112 },
        metronome: { beatsPerBar: 4, subdivision: 2 }
      },
      checks: [
        'You never lose your place in the form.',
        'You can hear the IV chord arrive without counting.',
        'You can play a chorus that would still make sense with no backing.'
      ]
    },

    {
      id: 'c10',
      track: 'C',
      title: 'Modal vamps and folk improvisation',
      goal: 'Improvise over static harmony without running out of ideas.',
      time: 25,
      tags: ['modal', 'folk', 'celtic'],
      sections: [
        { type: 'text', body:
          'Much traditional music does not have changes to follow. A Celtic tune might sit on two ' +
          'chords for eight bars. That is harder to improvise over, not easier, because the harmony ' +
          'gives you nothing to react to.' },
        { type: 'progression', key: 'D', tempo: 96, beatsPerChord: 4,
          items: [
            { symbol: 'Dm', frets: [-1, -1, 0, 2, 3, 1] },
            { symbol: 'C', frets: [-1, 3, 2, 0, 1, 0] }
          ],
          caption: 'A D dorian vamp. Two chords, endlessly. Everything has to come from the melody.' },
        { type: 'heading', body: 'What to lean on instead of changes' },
        { type: 'list', items: [
          'Register. Move up the neck for a second time round and back down for the third.',
          'Rhythm. Change the subdivision -- eighths to triplets to sixteenths -- while the notes stay simple.',
          'Ornament. Grace notes, hammer-ons, slides. In traditional music the ornament IS the variation.',
          'The characteristic note of the mode. In dorian that is the natural 6; place it deliberately and the mode announces itself.'
        ] },
        { type: 'callout', kind: 'tip', body:
          'Learn a traditional melody properly first, then improvise around it rather than away from ' +
          'it. That is how the tradition actually works: variation on a known tune, not invention from ' +
          'nothing.' }
      ],
      drill: {
        name: 'Eight bars, one idea',
        how: 'Over a two-chord modal vamp, take one four-note motif and play eight bars of variations ' +
             'on it -- different register, different rhythm, ornamented -- without introducing a new ' +
             'idea. Then do it again with a different motif.',
        bpm: { start: 80, target: 116 },
        metronome: { beatsPerBar: 4, subdivision: 2 }
      },
      checks: [
        'You can play eight bars over one chord without repeating yourself or running dry.',
        'You use the characteristic note of the mode deliberately.',
        'Your variations are recognisably of the same idea.'
      ]
    }
  ];
}(window.GL = window.GL || {}));
