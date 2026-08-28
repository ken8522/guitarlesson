/* lessons-fingerstyle.js -- Track B: the right hand.

   This is the track that matters most for a steel-string player. Every tab
   example is playable in the app, so you can hear the pattern before you try
   to read it.
*/
(function (GL) {
  'use strict';

  GL.lessons = GL.lessons || {};

  GL.lessons.fingerstyle = [

    {
      id: 'b1',
      track: 'B',
      title: 'The right hand: PIMA and planting',
      goal: 'Assign fingers to strings deliberately, and get a consistent tone from each one.',
      time: 15,
      tags: ['technique', 'right hand'],
      sections: [
        { type: 'text', body:
          'The classical labels are p for thumb, i for index, m for middle, a for ring. They are worth ' +
          'using even if you never play a note of classical music, because they let you talk about ' +
          'what the right hand is doing instead of hoping it works out.' },
        { type: 'text', body:
          'The default assignment for steel-string fingerpicking: thumb takes strings 6, 5 and 4; ' +
          'index takes string 3; middle takes string 2; ring takes string 1. The thumb roams, the ' +
          'fingers mostly stay put. That one rule removes most of the confusion.' },
        { type: 'heading', body: 'Planting' },
        { type: 'text', body:
          'Planting means putting the finger on the string before you play it, so the note starts when ' +
          'you decide rather than whenever the finger happens to arrive. It kills the string it is ' +
          'resting on, which sounds like a fault and is actually the point: it is how you control ' +
          'when notes stop as well as when they start.' },
        { type: 'text', body:
          'Practise it slowly and deliberately. Play a note, and while it rings, place the next finger. ' +
          'Then play. The gap between placing and playing is where the control lives.' },
        { type: 'heading', body: 'Two ways to strike' },
        { type: 'list', items: [
          'Free stroke: the finger moves past the string and into the air. Lighter, and it lets the neighbouring strings keep ringing. This is the default for pattern picking.',
          'Rest stroke: the finger follows through and comes to rest on the next string. Louder and fatter, and it stops that next string. Use it for a melody note that has to cut through.',
          'The thumb has its own version: strike down through the string and land on the next one for a solid bass note, or lift away for a lighter one.'
        ] },
        { type: 'callout', kind: 'tip', body:
          'Nail length matters more than anyone admits. A little nail past the fingertip gives you the ' +
          'attack; flesh alone gives you a soft, dull tone that will make every pattern in this track ' +
          'sound muddy no matter how well you play it.' },
        { type: 'tab', tempo: 66, tone: 'finger',
          bars: [
            '5-3:1, 3-0:1, 2-1:1, 1-0:1',
            '5-3:1, 3-0:1, 2-1:1, 1-0:1'
          ],
          caption: 'p, i, m, a on a C chord. Slowly. Listen for four notes of equal weight.' }
      ],
      drill: {
        name: 'Four equal notes',
        how: 'Hold a C chord. Play p-i-m-a as quarter notes, planting each finger before it plays. ' +
             'The goal is not speed, it is four notes you cannot tell apart in volume. Record yourself ' +
             'if you can -- the ring finger is almost always the quiet one.',
        bpm: { start: 60, target: 100 },
        metronome: { beatsPerBar: 4, subdivision: 1 }
      },
      checks: [
        'All four notes are the same volume, especially the one played with the ring finger.',
        'You can plant the next finger while the current note is still ringing.',
        'You can play the same phrase free stroke and rest stroke and hear the difference.'
      ]
    },

    {
      id: 'b2',
      track: 'B',
      title: 'The alternating bass',
      goal: 'Keep a steady alternating bass with the thumb while the fingers do something else.',
      time: 25,
      tags: ['travis', 'alternating bass', 'folk'],
      sections: [
        { type: 'text', body:
          'This is the engine under folk, country, ragtime and most acoustic blues. The thumb plays a ' +
          'bass note on every beat, alternating between two strings, and it does not stop for anything. ' +
          'Everything else is decoration on top.' },
        { type: 'text', body:
          'Start with the thumb alone. It sounds trivial and it is not -- the whole style depends on ' +
          'that thumb being metronomic while your attention is elsewhere.' },
        { type: 'tab', tempo: 76, tone: 'thumb',
          bars: [
            '5-3:1, 4-2:1, 5-3:1, 4-2:1',
            '6-3:1, 4-0:1, 6-3:1, 4-0:1'
          ],
          caption: 'Bar 1: C, alternating between the root on string 5 and the third on string 4. ' +
                   'Bar 2: G, alternating root on string 6 and the fifth on string 4.' },
        { type: 'heading', body: 'Which two strings?' },
        { type: 'list', items: [
          'Chords rooted on string 6 (G, E, Em, F): alternate strings 6 and 4.',
          'Chords rooted on string 5 (C, A, Am, D7): alternate strings 5 and 4.',
          'Chords rooted on string 4 (D, Dm): alternate strings 4 and 3, or cheat and use 5 and 4 if the note fits.',
          'The second note is usually the fifth of the chord, sometimes the third. Both work; the fifth is more neutral.'
        ] },
        { type: 'heading', body: 'Adding the fingers' },
        { type: 'text', body:
          'Now put a melody note on the off-beat between each bass note. The thumb does not change at ' +
          'all -- that is the whole test.' },
        { type: 'tab', tempo: 72, tone: 'finger',
          bars: [
            '5-3:0.5 2-1:0.5, 4-2:0.5 1-0:0.5, 5-3:0.5 2-1:0.5, 4-2:0.5 3-0:0.5',
            '6-3:0.5 2-0:0.5, 4-0:0.5 1-3:0.5, 6-3:0.5 2-0:0.5, 4-0:0.5 3-0:0.5'
          ],
          caption: 'C then G. The bass notes fall on 1, 2, 3, 4 and the finger notes on every "and".' },
        { type: 'callout', kind: 'warning', body:
          'The commonest failure is the thumb pausing when the fingers get busy. If that happens, stop ' +
          'and play only the thumb for a full minute at the tempo you are struggling with. The thumb ' +
          'has to be automatic before anything can be layered on it.' }
      ],
      drill: {
        name: 'Thumb on autopilot',
        how: 'Play the alternating bass on C for one minute without stopping. While you do it, say the ' +
             'beat numbers out loud, or hold a conversation. If the thumb falters when you talk, it is ' +
             'not automatic yet. Then add the off-beat fingers.',
        bpm: { start: 60, target: 100 },
        metronome: { beatsPerBar: 4, subdivision: 1 }
      },
      checks: [
        'The thumb keeps time while you talk over it.',
        'You can change chord without the bass hesitating.',
        'The bass notes are noticeably louder than the finger notes.'
      ]
    },

    {
      id: 'b3',
      track: 'B',
      title: 'The pinch, and syncopation',
      goal: 'Play thumb and finger together, and start placing melody notes off the beat.',
      time: 20,
      tags: ['travis', 'syncopation'],
      sections: [
        { type: 'text', body:
          'A pinch is a bass note and a melody note struck at the same instant. It is the punctuation ' +
          'mark of fingerstyle: it marks the start of a phrase, or lands on a chord change.' },
        { type: 'tab', tempo: 74, tone: 'finger',
          bars: [
            '5-3+1-0:1, 4-2:1, 5-3+2-1:1, 4-2:1',
            '6-3+1-3:1, 4-0:1, 6-3+2-0:1, 4-0:1'
          ],
          caption: 'Pinches on beats 1 and 3, plain bass on 2 and 4.' },
        { type: 'heading', body: 'Syncopation is the whole point' },
        { type: 'text', body:
          'What makes Travis picking sound like Travis picking rather than an exercise is that the ' +
          'melody notes mostly do NOT land on the beat. The bass is square; the tune floats across it. ' +
          'Play the two parts separately and you will hear how ordinary each is on its own.' },
        { type: 'tab', tempo: 72, tone: 'finger',
          bars: [
            '5-3+1-0:0.5 2-1:0.5, 4-2:0.5 1-0:0.5, 5-3:0.5 2-1:0.5, 4-2:0.5 1-0:0.5',
            '6-3+1-3:0.5 2-0:0.5, 4-0:0.5 3-0:0.5, 6-3:0.5 2-0:0.5, 4-0:0.5 1-3:0.5'
          ],
          caption: 'The melody now lands mostly on the off-beats. This is the sound.' },
        { type: 'callout', kind: 'tip', body:
          'Count out loud: "one and two and three and four and". Play the bass on the numbers and the ' +
          'melody on the "ands". Once that is easy, start moving individual melody notes onto the ' +
          'beat for emphasis. Syncopation only reads as syncopation if the beat is solid underneath.' }
      ],
      drill: {
        name: 'Bass on numbers, melody on ands',
        how: 'One chord, two bars, endlessly. Bass on 1-2-3-4, melody on every "and". Then change one ' +
             'melody note to land on the beat as a pinch, and hear how it changes the phrase.',
        bpm: { start: 58, target: 96 },
        metronome: { beatsPerBar: 4, subdivision: 2 }
      },
      checks: [
        'You can pinch cleanly, with both notes arriving at exactly the same moment.',
        'You can play a full bar with no melody note on a beat and still feel the pulse.'
      ]
    },

    {
      id: 'b4',
      track: 'B',
      title: 'Travis picking, properly',
      goal: 'Play a full Travis pattern through a chord progression without the bass breaking.',
      time: 30,
      tags: ['travis', 'folk', 'country'],
      sections: [
        { type: 'text', body:
          'Everything so far combines into this. The thumb alternates, the fingers play a syncopated ' +
          'figure on top, and the pattern carries across chord changes without a seam. Merle Travis ' +
          'and Chet Atkins built careers on it; so did most of the folk revival.' },
        { type: 'tab', tempo: 70, tone: 'finger',
          bars: [
            '5-3+1-0:0.5 2-1:0.5, 4-2:0.5 1-0:0.5, 5-3:0.5 2-1:0.5, 4-2:0.5 2-1:0.5',
            '6-3+1-3:0.5 2-0:0.5, 4-0:0.5 1-3:0.5, 6-3:0.5 2-0:0.5, 4-0:0.5 2-0:0.5',
            '5-0+1-0:0.5 2-1:0.5, 4-2:0.5 1-0:0.5, 5-0:0.5 2-1:0.5, 4-2:0.5 2-1:0.5',
            '6-3+1-3:0.5 2-0:0.5, 4-0:0.5 3-0:0.5, 6-3:0.5 2-0:0.5, 4-0:0.5 1-3:0.5'
          ],
          caption: 'C, G, Am, G. Four bars, one continuous thumb.' },
        { type: 'heading', body: 'Changing chords without stopping' },
        { type: 'text', body:
          'The trick is that the thumb note on beat 1 of the new chord is the only note that absolutely ' +
          'has to be right. Get the bass note and the rest can catch up. Practise changing on the beat ' +
          'with only the thumb, then add the fingers back.' },
        { type: 'chords', items: [
          { symbol: 'C', frets: [-1, 3, 2, 0, 1, 0] },
          { symbol: 'G', frets: [3, 2, 0, 0, 0, 3] },
          { symbol: 'Am', frets: [-1, 0, 2, 2, 1, 0] },
          { symbol: 'Em', frets: [0, 2, 2, 0, 0, 0] },
          { symbol: 'F', frets: [-1, -1, 3, 2, 1, 1] },
          { symbol: 'D7', frets: [-1, -1, 0, 2, 1, 2] }
        ], note: 'The six chords that carry most of the Travis repertoire.' },
        { type: 'callout', kind: 'note', body:
          'Notice how many of these keep the same fingers on strings 1 and 2. That is not an accident. ' +
          'Fingerstyle players choose voicings so the melody strings stay available.' }
      ],
      drill: {
        name: 'Four bars, no seams',
        how: 'C, G, Am, G, one bar each, round and round. Start slow enough that the chord change never ' +
             'interrupts the thumb. If it does, halve the tempo. This drill is worth ten minutes a day ' +
             'for a month.',
        bpm: { start: 56, target: 104 },
        metronome: { beatsPerBar: 4, subdivision: 1 }
      },
      checks: [
        'Four bars round the loop with no hesitation at any chord change.',
        'You can drop the melody out and back in without the bass noticing.',
        'It sounds like music at 60 bpm, not like an exercise.'
      ]
    },

    {
      id: 'b5',
      track: 'B',
      title: 'Pattern picking in 4/4 and 6/8',
      goal: 'Play arpeggio patterns that suit a song rather than defaulting to one shape.',
      time: 20,
      tags: ['arpeggio', 'folk', '6/8'],
      sections: [
        { type: 'text', body:
          'Not everything needs an alternating bass. A lot of folk and singer-songwriter material is ' +
          'better served by a plain arpeggio: one note at a time, rolling through the chord. The skill ' +
          'is choosing a pattern that fits the song rather than using the same one for everything.' },
        { type: 'heading', body: 'The standard folk pattern, 4/4' },
        { type: 'tab', tempo: 84, tone: 'finger',
          bars: [
            '5-3:0.5 3-0:0.5, 2-1:0.5 1-0:0.5, 3-0:0.5 2-1:0.5, 3-0:0.5 2-1:0.5',
            '6-3:0.5 3-0:0.5, 2-0:0.5 1-3:0.5, 3-0:0.5 2-0:0.5, 3-0:0.5 2-0:0.5'
          ],
          caption: 'p i m a i m i m. Even eighths, no syncopation, lets a vocal sit on top.' },
        { type: 'heading', body: 'Six-eight' },
        { type: 'text', body:
          'In 6/8 you have six eighth notes to a bar, grouped in twos threes: ONE two three FOUR five ' +
          'six. It rocks rather than marches, which is why so many ballads and Celtic airs use it.' },
        { type: 'tab', tempo: 100, timeSig: [6, 4], tone: 'finger',
          bars: [
            '5-3:1, 3-0:1, 2-1:1, 4-2:1, 3-0:1, 2-1:1',
            '6-3:1, 3-0:1, 2-0:1, 4-0:1, 3-0:1, 2-0:1'
          ],
          caption: 'Counted here as six beats to the bar so the metronome lines up. Accent beats 1 and 4.' },
        { type: 'callout', kind: 'tip', body:
          'Choose the pattern by asking what the song needs, not what your hand does automatically. ' +
          'A busy pattern under a busy vocal is the most common mistake in fingerstyle accompaniment.' }
      ],
      drill: {
        name: 'Same chords, three patterns',
        how: 'Take a four-chord progression. Play it with the 4/4 folk pattern, then with a plain ' +
             'ascending arpeggio, then in 6/8. Decide which one you would use behind a singer, and ' +
             'be able to say why.',
        bpm: { start: 66, target: 104 },
        metronome: { beatsPerBar: 4, subdivision: 2 }
      },
      checks: [
        'You can play the folk pattern through a chord change without thinking about it.',
        'You can feel 6/8 as two groups of three, not six separate beats.'
      ]
    },

    {
      id: 'b6',
      track: 'B',
      title: 'Piedmont blues',
      goal: 'Play a syncopated ragtime-flavoured blues with an alternating bass.',
      time: 25,
      tags: ['blues', 'piedmont', 'ragtime'],
      sections: [
        { type: 'text', body:
          'Piedmont is the east-coast fingerstyle blues -- Blind Blake, Reverend Gary Davis, Blind Boy ' +
          'Fuller. It is ragtime harmony played with a Travis thumb, and it swings hard. The difference ' +
          'from Delta blues is that Piedmont keeps the alternating bass going while the melody gets ' +
          'genuinely intricate on top.' },
        { type: 'text', body:
          'Almost all of it is in E or A, using open strings, because that is what lets the bass keep ' +
          'moving while the fingers work.' },
        { type: 'heading', body: 'A bar of E' },
        { type: 'tab', tempo: 84, tone: 'finger',
          bars: [
            '6-0+1-0:0.5 2-0:0.5, 4-2:0.5 1-0:0.5, 6-0:0.5 2-0:0.5, 4-2:0.5 3-1:0.5',
            '6-0+3-1:0.5 2-0:0.5, 4-2:0.5 1-0:0.5, 6-0:0.5 3-1:0.5, 4-2:0.5 2-0:0.5'
          ],
          caption: 'Thumb on 6 and 4 throughout. Play it with a swing feel -- the second eighth of ' +
                   'each pair lands late.' },
        { type: 'heading', body: 'The swing is not optional' },
        { type: 'text', body:
          'Written as straight eighths this sounds stiff and wrong. Set the metronome to eighths and ' +
          'push the swing slider up to about 60 per cent, then play along. That long-short feel is ' +
          'most of what makes it blues.' },
        { type: 'callout', kind: 'tip', body:
          'Add a hammer-on from the minor third to the major third on the way up and you have the ' +
          'single most characteristic gesture in the style. On an E chord that is the 3rd string, ' +
          'open to fret 1.' },
        { type: 'tab', tempo: 80, tone: 'finger',
          bars: [
            '6-0+3-0h1:1, 4-2:1, 6-0+2-0:1, 4-2:1'
          ],
          caption: 'The hammer-on, on its own, with the thumb continuing underneath.' }
      ],
      drill: {
        name: 'Swung thumb',
        how: 'Set the metronome to eighth notes with swing at 60 per cent. Play the alternating bass ' +
             'alone until the swing feels natural rather than forced. Then add the melody.',
        bpm: { start: 66, target: 100 },
        metronome: { beatsPerBar: 4, subdivision: 2 }
      },
      checks: [
        'The swing feel is in your hands, not something you have to think about.',
        'The alternating bass survives the hammer-ons.',
        'You can play eight bars without the tempo creeping up.'
      ]
    },

    {
      id: 'b7',
      track: 'B',
      title: 'Fingerstyle blues in E and A',
      goal: 'Play a twelve-bar blues fingerstyle, keeping bass and melody independent.',
      time: 25,
      tags: ['blues', '12-bar', 'fingerstyle'],
      sections: [
        { type: 'text', body:
          'The twelve-bar form in E is where fingerstyle blues lives, because every chord in it has an ' +
          'open bass string: E on 6, A on 5, B on 5 at the 2nd fret. That means the thumb never has to ' +
          'compete with the fretting hand.' },
        { type: 'heading', body: 'The form' },
        { type: 'progression', key: 'E', tempo: 80, beatsPerChord: 4,
          items: [
            { symbol: 'E7', frets: [0, 2, 0, 1, 0, 0], label: 'bars 1-4' },
            { symbol: 'A7', frets: [-1, 0, 2, 0, 2, 0], label: 'bars 5-6' },
            { symbol: 'E7', frets: [0, 2, 0, 1, 0, 0], label: 'bars 7-8' },
            { symbol: 'B7', frets: [-1, 2, 1, 2, 0, 2], label: 'bar 9' },
            { symbol: 'A7', frets: [-1, 0, 2, 0, 2, 0], label: 'bar 10' },
            { symbol: 'E7', frets: [0, 2, 0, 1, 0, 0], label: 'bars 11-12' }
          ],
          caption: 'The twelve-bar blues in E, one chord per box.' },
        { type: 'heading', body: 'A turnaround' },
        { type: 'text', body:
          'The last two bars are where the blues restates itself and points back to the top. This one ' +
          'is a descending line over an E pedal -- the oldest turnaround there is, and still the best.' },
        { type: 'tab', tempo: 76, tone: 'finger',
          bars: [
            '6-0+3-4:1, 6-0+3-3:1, 6-0+3-2:1, 6-0+3-1:1',
            '6-0+3-1:2, 5-2+4-1:2'
          ],
          caption: 'The bass stays on E while the inner voice walks down. Bar 2 lands on a B7.' },
        { type: 'callout', kind: 'note', body:
          'This is the general principle of blues fingerstyle: one voice stays still while another ' +
          'moves. Pedal tones and moving lines. Everything else is ornament.' }
      ],
      drill: {
        name: 'Twelve bars, no chart',
        how: 'Play the whole form in E from memory with the alternating bass, adding whatever melody ' +
             'you can manage. Then do it in A. Then do it in E with a swing feel at 90 bpm.',
        bpm: { start: 66, target: 96 },
        metronome: { beatsPerBar: 4, subdivision: 2 }
      },
      checks: [
        'You know the twelve-bar form without counting on your fingers.',
        'You can play the turnaround cleanly and land it exactly on bar 1.',
        'You can play it in A as well as E.'
      ]
    },

    {
      id: 'b8',
      track: 'B',
      title: 'Percussion: slaps, taps and mutes',
      goal: 'Get a backbeat out of the guitar without losing the pattern.',
      time: 18,
      tags: ['percussion', 'technique', 'modern fingerstyle'],
      sections: [
        { type: 'text', body:
          'A solo acoustic guitar has no drummer, so players learned to be one. Three techniques cover ' +
          'most of it, and they all go in the same place: beats 2 and 4.' },
        { type: 'list', items: [
          'Thumb slap: the side of the thumb strikes the bass strings against the fretboard. Sounds like a kick drum with a note attached.',
          'Body tap: the ring and little fingers strike the soundboard just behind the bridge. That is the snare.',
          'String mute: the fretting hand relaxes so the strings are damped but still touched, and you strum. A dry percussive chuck with a hint of the chord in it.'
        ] },
        { type: 'heading', body: 'Where they go' },
        { type: 'text', body:
          'Play a bar of alternating bass and add a body tap on beats 2 and 4. That is all it takes. ' +
          'The temptation is to add more; resist it. Percussion works because it is sparse and exactly ' +
          'in time, not because it is busy.' },
        { type: 'callout', kind: 'warning', body:
          'Tap behind the bridge or on the upper bout, not on the soundboard between the soundhole and ' +
          'the bridge. That area is the thinnest part of the top and it is where a guitar cracks.' },
        { type: 'heading', body: 'Muted strums between chords' },
        { type: 'text', body:
          'The fretting-hand mute is the most useful of the three because it costs nothing. Release the ' +
          'pressure without lifting the fingers off, strum, and the strings give you a percussive click ' +
          'instead of a chord. Used on the off-beats it turns a plain strum into a groove.' }
      ],
      drill: {
        name: 'Two and four',
        how: 'Alternating bass on one chord. Add a body tap on 2 and 4 and nothing else. One full ' +
             'minute. Then swap the tap for a muted strum. Then alternate: tap on 2, mute on 4.',
        bpm: { start: 66, target: 100 },
        metronome: { beatsPerBar: 4, subdivision: 1, mode: 'backbeat' }
      },
      checks: [
        'The tap lands exactly with the click, not near it.',
        'The bass pattern is unaffected by the percussion.',
        'The muted strum is dry, with no pitch audible.'
      ]
    },

    {
      id: 'b9',
      track: 'B',
      title: 'Chord melody: harmonising a tune',
      goal: 'Play a melody with the chord underneath it, on one guitar, at the same time.',
      time: 30,
      tags: ['chord melody', 'arranging', 'triads'],
      sections: [
        { type: 'text', body:
          'Chord melody means the tune is the top note and the harmony sits under it. The reason the ' +
          'triads from track A matter is that they give you three ways to voice every chord, so you ' +
          'can always find one with the melody note on top.' },
        { type: 'heading', body: 'The method' },
        { type: 'list', items: [
          'Learn the melody on the top two strings alone. Nothing else, until it is solid.',
          'Work out the chord under each melody note.',
          'For each one, find a voicing of that chord whose highest note IS the melody note. That is the whole trick, and it is why you learned inversions.',
          'Drop notes ruthlessly. Three notes is usually plenty; two is often enough. The melody must stay clearly on top.'
        ] },
        { type: 'heading', body: 'The same C chord, three melody notes' },
        { type: 'chords', items: [
          { symbol: 'C', frets: [-1, 3, 2, 0, 1, 0], caption: 'melody E' },
          { symbol: 'C', frets: [-1, 3, 2, 0, 1, 3], caption: 'melody G' },
          { symbol: 'C', frets: [-1, 3, 5, 5, 5, 8], caption: 'melody C, up the neck' }
        ], note: 'Same chord, three different top notes. Note that the third one forced a move up ' +
                 'the neck: the C you needed on top was not available down here. That is normal, and ' +
                 'it is why a chord-melody arrangement travels.' },
        { type: 'callout', kind: 'tip', body:
          'When a melody note is not in the chord, you have three options: harmonise it with a ' +
          'different chord, leave it as a single note with no harmony, or let it be a passing tone ' +
          'over the chord you already have. All three are correct. The third is usually easiest.' },
        { type: 'tab', tempo: 62, tone: 'finger',
          bars: [
            '5-3+2-1:2, 5-3+1-0:2',
            '4-0+1-3:2, 5-3+1-0:2'
          ],
          caption: 'A fragment: melody on top, bass underneath, nothing in between. Sparse works.' }
      ],
      drill: {
        name: 'Harmonise eight bars',
        how: 'Take a simple tune you know by ear -- a carol, a fiddle tune, anything traditional. ' +
             'Play the melody alone on strings 1 and 2. Then add a bass note under the first beat of ' +
             'each bar. Then fill in the middle only where it sounds thin.',
        bpm: { start: 50, target: 80 },
        metronome: { beatsPerBar: 4, subdivision: 1 }
      },
      checks: [
        'The melody is clearly the loudest voice throughout.',
        'You can find a voicing with any given note on top for the common chords.',
        'You left some notes unharmonised, on purpose.'
      ]
    },

    {
      id: 'b10',
      track: 'B',
      title: 'Arranging project: make it yours',
      goal: 'Turn a traditional tune into your own fingerstyle arrangement.',
      time: 45,
      tags: ['arranging', 'project'],
      sections: [
        { type: 'text', body:
          'Everything in this track exists to make this possible. Pick a public-domain tune -- there is ' +
          'a library of them in the Songs section -- and build an arrangement rather than just playing ' +
          'the notes.' },
        { type: 'heading', body: 'A working order' },
        { type: 'list', items: [
          'Learn the melody, in one position, cleanly. Sing it if you can.',
          'Work out the harmony. Simple is fine; most traditional tunes need three chords.',
          'Choose a right-hand approach: alternating bass, plain arpeggio, or chord melody. One of them, not all three.',
          'Play it through once, simply, all the way to the end. Resist decorating it yet.',
          'Now decide what changes between verses. Something must, or it will not hold attention for three minutes.',
          'Add an introduction that is four bars of the ending, and an ending that resolves properly rather than fading out.'
        ] },
        { type: 'heading', body: 'What makes an arrangement rather than a performance' },
        { type: 'text', body:
          'Contrast. A verse in a low register followed by one an octave up. A verse with the bass ' +
          'and one without. A verse in straight time and one with a swing. Pick two contrasts and use ' +
          'them deliberately -- that is the difference between an arrangement and playing it again.' },
        { type: 'callout', kind: 'note', body:
          'Record yourself and listen back the next day. It is uncomfortable and there is no ' +
          'substitute for it. Almost everything you need to fix will be obvious within ten seconds, ' +
          'and almost none of it will be what you thought it was while playing.' }
      ],
      drill: {
        name: 'Three verses, two contrasts',
        how: 'Arrange one tune in three verses. Verse 1 plain. Verse 2 with one deliberate change of ' +
             'register or texture. Verse 3 with a second change, then an ending. Play the whole thing ' +
             'to a metronome without stopping, twice.',
        bpm: { start: 60, target: 88 },
        metronome: { beatsPerBar: 4, subdivision: 1 }
      },
      checks: [
        'You can play it start to finish without stopping.',
        'Someone listening could tell verse 2 apart from verse 1.',
        'It has a real ending, not a fade.'
      ]
    }
  ];
}(window.GL = window.GL || {}));
