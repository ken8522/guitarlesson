/* lessons-theory.js -- Track E: theory that changes what you play, and ear
   training that makes it usable.

   Everything here is aimed at a player, not an exam. If a piece of theory does
   not change a decision at the fretboard, it is not in this track.
*/
(function (GL) {
  'use strict';

  GL.lessons = GL.lessons || {};

  GL.lessons.theory = [

    {
      id: 'e1',
      track: 'E',
      title: 'Intervals: the unit everything is built from',
      goal: 'Recognise every interval by ear and find it instantly on the neck.',
      time: 25,
      tags: ['intervals', 'ear'],
      sections: [
        { type: 'text', body:
          'An interval is the distance between two notes. Chords are stacks of them, scales are ' +
          'sequences of them, and melodies are journeys through them. Learn to hear intervals and ' +
          'almost everything else in theory becomes a description of something you already recognise.' },
        { type: 'heading', body: 'On the neck' },
        { type: 'list', items: [
          'On one string, the interval is just the fret distance: 2 frets is a major 2nd, 4 is a major 3rd, 7 is a perfect 5th.',
          'Across two adjacent strings the shapes are consistent, except between strings 3 and 2 where everything shifts a fret. That one exception is the whole difficulty of guitar geometry.',
          'The Trainer\'s interval drill is the fastest way to make this automatic. Ten minutes a day for a fortnight is genuinely enough.'
        ] },
        { type: 'heading', body: 'By ear' },
        { type: 'text', body:
          'The classic method is to attach each interval to a tune you already know. It works, and ' +
          'the tune does not have to be anyone else\'s -- your own associations stick better.' },
        { type: 'list', items: [
          'Minor 2nd: the two-note shark motif. Unmistakable.',
          'Major 2nd: the first two notes of Happy Birthday.',
          'Minor 3rd: Greensleeves, first two notes. Also every doorbell.',
          'Major 3rd: a bugle call, or the opening of Kumbaya.',
          'Perfect 4th: Auld Lang Syne, first two notes. Also Amazing Grace.',
          'Tritone: nothing sounds like it, which is its own identifier.',
          'Perfect 5th: Twinkle Twinkle, first two notes.',
          'Major 6th: My Bonnie Lies Over the Ocean.',
          'Minor 7th: tense, wants to fall. The top of a dominant chord.',
          'Major 7th: sharp and glassy, one semitone short of home.',
          'Octave: Somewhere Over the Rainbow.'
        ] },
        { type: 'callout', kind: 'tip', body:
          'Practise descending intervals separately. Most people learn ascending ones and then ' +
          'discover they cannot recognise anything going down, which is a problem given that melodies ' +
          'go both ways.' }
      ],
      drill: {
        name: 'Sing it, then find it',
        how: 'Play a note. Sing the interval you want. Then find it on the neck and check. Getting it ' +
             'wrong is fine and informative; guessing without singing first is not.',
        bpm: { start: 50, target: 70 },
        metronome: { beatsPerBar: 4, subdivision: 1 }
      },
      checks: [
        'You can identify any ascending interval by ear within two guesses.',
        'You can find any interval from any note on the neck without counting frets.',
        'You can sing an interval before you play it.'
      ]
    },

    {
      id: 'e2',
      track: 'E',
      title: 'Keys, the circle of fifths, and transposing on the fly',
      goal: 'Know what is in any key, and move a song to another one without rewriting it.',
      time: 22,
      tags: ['keys', 'circle of fifths', 'transposing'],
      sections: [
        { type: 'text', body:
          'The circle of fifths is a map of how closely related keys are. Neighbours share all but one ' +
          'note; opposites share almost nothing. That single fact explains why some key changes sound ' +
          'smooth and others sound like a jolt.' },
        { type: 'list', items: [
          'Going clockwise adds a sharp each time: C, G, D, A, E, B, F#.',
          'Going anticlockwise adds a flat: C, F, Bb, Eb, Ab, Db.',
          'The relative minor of any major key sits three semitones below it and shares its notes exactly.',
          'Adjacent keys differ by one note. That is why moving to the key a fifth up feels like a lift rather than a lurch.'
        ] },
        { type: 'heading', body: 'Transposing without thinking' },
        { type: 'text', body:
          'The practical method is not to transpose the chords one at a time. It is to think in roman ' +
          'numerals: a song is I, V, vi, IV, and then you decide what key. Once a progression is stored ' +
          'that way, changing key is free.' },
        { type: 'progression', key: 'G', tempo: 84, beatsPerChord: 4,
          items: [
            { symbol: 'G', frets: [3, 2, 0, 0, 0, 3], label: 'I' },
            { symbol: 'D', frets: [-1, -1, 0, 2, 3, 2], label: 'V' },
            { symbol: 'Em', frets: [0, 2, 2, 0, 0, 0], label: 'vi' },
            { symbol: 'C', frets: [-1, 3, 2, 0, 1, 0], label: 'IV' }
          ],
          caption: 'I V vi IV in G.' },
        { type: 'progression', key: 'D', tempo: 84, beatsPerChord: 4,
          items: [
            { symbol: 'D', frets: [-1, -1, 0, 2, 3, 2], label: 'I' },
            { symbol: 'A', frets: [-1, 0, 2, 2, 2, 0], label: 'V' },
            { symbol: 'Bm', frets: [-1, 2, 4, 4, 3, 2], label: 'vi' },
            { symbol: 'G', frets: [3, 2, 0, 0, 0, 3], label: 'IV' }
          ],
          caption: 'The same progression in D. Different chords, identical music.' },
        { type: 'callout', kind: 'tip', body:
          'The capo is a transposing tool, not a beginner\'s crutch. If a singer needs Eb, a capo on ' +
          'the first fret with D shapes gets you there with open strings ringing -- and open strings ' +
          'are most of what a steel-string is for.' }
      ],
      drill: {
        name: 'Numerals, not chords',
        how: 'Take a song you know. Write it out as roman numerals. Play it in its original key, then ' +
             'a fifth up, then a fourth up, from the numerals alone. Then with a capo in two positions.',
        bpm: { start: 70, target: 100 },
        metronome: { beatsPerBar: 4, subdivision: 1 }
      },
      checks: [
        'You can name the notes and the diatonic chords of any major key.',
        'You can transpose a progression to any key without writing it down.',
        'You know which capo position turns a shape into a given key.'
      ]
    },

    {
      id: 'e3',
      track: 'E',
      title: 'Harmonising a scale',
      goal: 'Derive the chords of any key from the scale, rather than memorising lists.',
      time: 22,
      tags: ['harmony', 'diatonic'],
      sections: [
        { type: 'text', body:
          'Take a scale. Build a chord on each degree by stacking every other note. That is the whole ' +
          'procedure, and it produces the same pattern of chord qualities in every major key.' },
        { type: 'text', body:
          'Major, minor, minor, major, major, minor, diminished. I ii iii IV V vi vii. Learn that ' +
          'sequence once and you know the chords of all twelve major keys.' },
        { type: 'text', body:
          'Stack one more third and you get sevenths: maj7, m7, m7, maj7, 7, m7, m7b5. The single ' +
          'dominant 7 chord in the set sits on the fifth degree, which is exactly why the V chord ' +
          'pulls home so strongly -- it is the only one that contains the tritone.' },
        { type: 'heading', body: 'Try it yourself' },
        { type: 'text', body:
          'The Scales section harmonises any of the 46 scales into triads and sevenths, in any key. ' +
          'Harmonising the harmonic minor scale is particularly worth doing: it is where the ' +
          'diminished 7th chord comes from, and where the minor key gets a real dominant.' },
        { type: 'progression', key: 'C', tempo: 84, beatsPerChord: 2,
          items: [
            { symbol: 'Cmaj7', frets: [-1, 3, 2, 0, 0, 0], label: 'Imaj7' },
            { symbol: 'Dm7', frets: [-1, -1, 0, 2, 1, 1], label: 'ii7' },
            { symbol: 'Em7', frets: [0, 2, 0, 0, 0, 0], label: 'iii7' },
            { symbol: 'Fmaj7', frets: [-1, -1, 3, 2, 1, 0], label: 'IVmaj7' },
            { symbol: 'G7', frets: [3, 2, 0, 0, 0, 1], label: 'V7' },
            { symbol: 'Am7', frets: [-1, 0, 2, 0, 1, 0], label: 'vi7' },
            { symbol: 'Bm7b5', frets: [-1, 2, 3, 2, 3, -1], label: 'viim7b5' }
          ],
          caption: 'Every seventh chord in C major, in order.' },
        { type: 'callout', kind: 'note', body:
          'The vii chord is the one nobody uses on its own. Its job is to be most of a V7 chord -- ' +
          'Bm7b5 is G7 without the root -- which is why it behaves like a dominant.' }
      ],
      drill: {
        name: 'Seven chords, any key',
        how: 'Pick a key. Play all seven diatonic triads in order, then all seven sevenths, saying the ' +
             'numeral out loud. Then a different key. Then a minor key.',
        bpm: { start: 60, target: 88 },
        metronome: { beatsPerBar: 4, subdivision: 1 }
      },
      checks: [
        'You can name the seven chords of any major key without working through the scale.',
        'You know why the V chord is the only dominant 7 in the set.',
        'You can do the same for a natural minor key.'
      ]
    },

    {
      id: 'e4',
      track: 'E',
      title: 'Hearing progressions',
      goal: 'Work out the chords of a song by ear, in real time.',
      time: 30,
      tags: ['ear', 'progressions', 'analysis'],
      sections: [
        { type: 'text', body:
          'This is the most useful single skill in this course. It rests on one observation: most ' +
          'popular and traditional music uses a small number of progressions, and if you know what ' +
          'they sound like you are recognising rather than deducing.' },
        { type: 'heading', body: 'The ones to know cold' },
        { type: 'list', items: [
          'I V vi IV -- and its rotations. Vast quantities of pop.',
          'I IV V -- blues, folk, rock and roll, most traditional song.',
          'vi IV I V -- the same four chords starting on the minor. Darker opening, same resolution.',
          'ii V I -- the fundamental jazz cadence, and common in folk too.',
          'I bVII IV -- the mixolydian rock progression. The bVII is not in the key, which is the point.',
          'i bVI bIII bVII -- the minor-key equivalent of the pop four.',
          'I vi IV V -- doo-wop. Fifties, and never quite went away.'
        ] },
        { type: 'heading', body: 'A working method' },
        { type: 'list', items: [
          'Find the tonic first. Hum the note the song wants to end on. Everything is measured from there.',
          'Decide major or minor. Usually obvious once you have the tonic.',
          'Listen for the bass. The bass note is nearly always the root of the chord, and the bass line is far easier to hear than the chord.',
          'Guess from the common progressions before you try to work it out note by note. You will be right most of the time.'
        ] },
        { type: 'callout', kind: 'tip', body:
          'Learning to spot the IV and the V chord is 80 per cent of the job. The IV feels like moving ' +
          'away and the V feels like tension needing release. Once those two are reliable, everything ' +
          'else is a small step from one of them.' }
      ],
      drill: {
        name: 'Three songs a day',
        how: 'Take three songs you have never worked out. Find the tonic by humming. Guess the ' +
             'progression from the common list. Check with the guitar. Getting it wrong quickly teaches ' +
             'faster than getting it right slowly.',
        bpm: { start: 60, target: 80 },
        metronome: { beatsPerBar: 4, subdivision: 1 }
      },
      checks: [
        'You can find the tonic of a song within a few seconds.',
        'You can recognise I V vi IV by ear.',
        'You can hear a IV chord and a V chord apart reliably.'
      ]
    },

    {
      id: 'e5',
      track: 'E',
      title: 'Borrowed chords and modal interchange',
      goal: 'Recognise and use the chords that come from outside the key.',
      time: 22,
      tags: ['harmony', 'modal interchange'],
      sections: [
        { type: 'text', body:
          'When a song in a major key uses a chord that is not in that key and it still sounds right, ' +
          'the chord has almost always been borrowed from the parallel minor -- the minor key with the ' +
          'same root.' },
        { type: 'heading', body: 'The ones that turn up constantly' },
        { type: 'list', items: [
          'bVII -- from the mixolydian sound. In C that is Bb. Rock, folk, everything.',
          'iv -- the minor four. In C that is Fm. Instantly wistful, and one of the strongest effects in tonal music.',
          'bVI -- in C, Ab. Heavy and cinematic, usually going to bVII or back to I.',
          'bIII -- in C, Eb. Often paired with bVI and bVII in a rock cadence.',
          'The Picardy third, the reverse: a minor-key song ending on a major tonic chord. Very common in traditional music.'
        ] },
        { type: 'progression', key: 'C', tempo: 80, beatsPerChord: 4,
          items: [
            { symbol: 'C', frets: [-1, 3, 2, 0, 1, 0], label: 'I' },
            { symbol: 'Bb', frets: [-1, 1, 3, 3, 3, 1], label: 'bVII' },
            { symbol: 'F', frets: [-1, -1, 3, 2, 1, 1], label: 'IV' },
            { symbol: 'C', frets: [-1, 3, 2, 0, 1, 0], label: 'I' }
          ],
          caption: 'I bVII IV I. The bVII is borrowed, and it is the whole character of the phrase.' },
        { type: 'callout', kind: 'note', body:
          'Borrowing is not a rule being broken. The parallel minor is close enough that the ear ' +
          'accepts the chord as an alternative colour rather than a wrong note -- which is exactly ' +
          'what makes it useful.' }
      ],
      drill: {
        name: 'Borrow one chord',
        how: 'Take a plain major-key progression. Replace exactly one chord with a borrowed one -- ' +
             'IV becomes iv, or add a bVII. Play both versions back to back and describe the ' +
             'difference in a word.',
        bpm: { start: 70, target: 92 },
        metronome: { beatsPerBar: 4, subdivision: 1 }
      },
      checks: [
        'You can hear a minor iv arrive and know what it is.',
        'You can name the borrowed chords available in any major key.'
      ]
    },

    {
      id: 'e6',
      track: 'E',
      title: 'Cadences and voice leading',
      goal: 'Understand why progressions resolve, and make your chord changes smoother.',
      time: 22,
      tags: ['harmony', 'cadence', 'voice leading'],
      sections: [
        { type: 'text', body:
          'A cadence is how a phrase ends, and it is the punctuation of music. Four are worth knowing ' +
          'by sound rather than by name.' },
        { type: 'list', items: [
          'Perfect: V to I. A full stop. The strongest ending there is.',
          'Plagal: IV to I. The "amen" cadence. Softer, more settled, very common in folk and gospel.',
          'Imperfect: something to V. A comma -- the phrase pauses but is clearly unfinished.',
          'Interrupted: V to vi. The listener expects I and gets the relative minor instead. Used to keep a song going past where it wanted to end.'
        ] },
        { type: 'heading', body: 'Why V wants to go to I' },
        { type: 'text', body:
          'The V7 chord contains a tritone, and the two notes of that tritone are both a semitone away ' +
          'from notes in the I chord. In C major, G7 contains B and F: B pulls up to C, F pulls down to ' +
          'E. That double semitone pull is the mechanism behind almost all tonal resolution.' },
        { type: 'heading', body: 'Voice leading' },
        { type: 'text', body:
          'Voice leading means moving each note of a chord to the nearest note of the next one, rather ' +
          'than jumping every voice at once. It is why some voicings of the same progression sound ' +
          'much smoother than others, and it is worth choosing shapes for.' },
        { type: 'progression', key: 'C', tempo: 76, beatsPerChord: 4,
          items: [
            { symbol: 'Dm7', frets: [-1, -1, 0, 2, 1, 1], label: 'ii7' },
            { symbol: 'G7', frets: [3, -1, 3, 4, 3, -1], label: 'V7' },
            { symbol: 'Cmaj7', frets: [-1, 3, 5, 4, 5, -1], label: 'Imaj7' }
          ],
          caption: 'A ii-V-I with the voices moving as little as possible. Listen for how little changes.' },
        { type: 'callout', kind: 'tip', body:
          'When a change sounds clumsy, look at the top note. If it leaps while everything else steps, ' +
          'find a voicing where it steps too.' }
      ],
      drill: {
        name: 'Four endings',
        how: 'Take an eight-bar phrase. End it four ways: perfect, plagal, imperfect, interrupted. ' +
             'Play them back to back and be able to hear which is which with your eyes shut.',
        bpm: { start: 66, target: 88 },
        metronome: { beatsPerBar: 4, subdivision: 1 }
      },
      checks: [
        'You can identify all four cadences by ear.',
        'You can explain why V7 resolves to I in terms of the notes.',
        'You choose voicings for smooth voice leading rather than habit.'
      ]
    },

    {
      id: 'e7',
      track: 'E',
      title: 'Reharmonisation',
      goal: 'Put different chords under a melody you already know.',
      time: 25,
      tags: ['reharmonisation', 'arranging'],
      sections: [
        { type: 'text', body:
          'Reharmonising means keeping the tune and changing what sits underneath it. It is how ' +
          'arrangers make a familiar melody worth hearing again, and it is one of the most enjoyable ' +
          'things you can do with a traditional song.' },
        { type: 'heading', body: 'Techniques, roughly in order of safety' },
        { type: 'list', items: [
          'Relative substitution. Swap a chord for its relative major or minor. Almost always works.',
          'Add sevenths and extensions. Change the colour without changing the function.',
          'Secondary dominants. Approach any chord with the dominant 7 a fifth above it.',
          'Diatonic passing chords. Fill a two-bar chord with a step-wise pair.',
          'Bass line reharmonisation. Keep the melody, write a descending bass, and let the chords fall out of the two.',
          'Modal interchange. Borrow from the parallel minor, as in the previous lesson.'
        ] },
        { type: 'heading', body: 'The constraint that makes it work' },
        { type: 'text', body:
          'The melody note has to fit the new chord -- as a chord tone, an available extension, or a ' +
          'passing note that moves on quickly. If a melody note sits on a chord it clashes with and ' +
          'stays there, no amount of theory will rescue it.' },
        { type: 'callout', kind: 'tip', body:
          'Start with the last two bars. Endings tolerate more harmonic movement than beginnings, and ' +
          'a reharmonised ending is the change most likely to sound deliberate rather than odd.' }
      ],
      drill: {
        name: 'Three chords under one note',
        how: 'Play a single melody note and find three different chords that support it. Then take ' +
             'four bars of a tune you know and reharmonise them, keeping the melody exactly.',
        bpm: { start: 60, target: 80 },
        metronome: { beatsPerBar: 4, subdivision: 1 }
      },
      checks: [
        'You can find at least three chords that fit any given melody note.',
        'You have reharmonised eight bars of something and it still sounds like the tune.'
      ]
    },

    {
      id: 'e8',
      track: 'E',
      title: 'Transcribing by ear',
      goal: 'Take a part off a recording without tab.',
      time: 30,
      tags: ['ear', 'transcription'],
      sections: [
        { type: 'text', body:
          'Transcribing is where ear training stops being an exercise and becomes a tool. It is slow ' +
          'at first and it gets dramatically faster, and there is no substitute for it.' },
        { type: 'heading', body: 'A method that works' },
        { type: 'list', items: [
          'Find the key first. Hum until you find the note the music resolves to.',
          'Get the bass line next. It is the easiest line to hear and it tells you the chords.',
          'Work in two-bar chunks and loop them. Do not try to hold more than that in your head.',
          'Sing the phrase before you look for it on the guitar. If you can sing it, finding it is quick; if you cannot, playing it is guesswork.',
          'Slow the recording down if you need to, but only after you have tried at speed.',
          'Write it down. What you do not write down, you will lose.'
        ] },
        { type: 'heading', body: 'What to transcribe' },
        { type: 'text', body:
          'Start far below your playing level. An eight-bar melody you already know is a better first ' +
          'transcription than a solo you admire, because the goal is to build the connection between ' +
          'ear and hand rather than to acquire the notes.' },
        { type: 'callout', kind: 'note', body:
          'The moment it clicks is usually around the tenth transcription, and it feels like a ' +
          'different sense switching on. Almost everyone who gives up does so before then.' }
      ],
      drill: {
        name: 'Eight bars a week',
        how: 'One eight-bar melody a week, by ear, written down. Bass line first, then melody. Play it ' +
             'along with the recording to check. Keep the notebook.',
        bpm: { start: 60, target: 80 },
        metronome: { beatsPerBar: 4, subdivision: 1 }
      },
      checks: [
        'You have transcribed at least one melody with no tab or chart.',
        'You sing phrases before hunting for them.',
        'You can hear a bass line separately from the rest of a mix.'
      ]
    }
  ];
}(window.GL = window.GL || {}));
