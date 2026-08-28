/* lessons-rhythm.js -- Track D: the right hand as a rhythm section.

   Note on the tab in this track: bars in compound and odd meters are written in
   the pulse you actually count, so a 6/8 bar is six beats and a 7/8 bar is
   seven. Set the metronome to match and it lines up.
*/
(function (GL) {
  'use strict';

  GL.lessons = GL.lessons || {};

  GL.lessons.rhythm = [

    {
      id: 'd1',
      track: 'D',
      title: 'The sixteenth grid and the hand that never stops',
      goal: 'Play any strumming pattern by deciding which strokes to miss, not which to make.',
      time: 20,
      tags: ['strumming', 'rhythm'],
      sections: [
        { type: 'text', body:
          'Almost every strumming problem comes from thinking about a pattern as a list of strokes to ' +
          'play. The fix is to think of it the other way round: the hand moves up and down continuously ' +
          'in sixteenths, and a pattern is the set of strokes where the hand happens to touch the ' +
          'strings.' },
        { type: 'text', body:
          'Count "one-e-and-a two-e-and-a". Your hand goes down on the numbers and the "ands", up on ' +
          'the "e"s and "a"s. It never stops, never reverses, never hesitates. Everything else follows.' },
        { type: 'heading', body: 'Why this works' },
        { type: 'list', items: [
          'You never have to work out which direction a stroke is. It is determined by where it falls in the bar.',
          'Missing a stroke is easy; inserting one is hard. Continuous motion turns every pattern into a subtraction.',
          'The tempo lives in your arm rather than your head, which is why it stops drifting.'
        ] },
        { type: 'callout', kind: 'tip', body:
          'Practise the motion with the hand two inches away from the strings, silently, while the ' +
          'metronome runs. When the motion is genuinely automatic, move in and let it touch. Most ' +
          'people skip this and spend months on a problem it would have solved in a week.' },
        { type: 'heading', body: 'Building a pattern' },
        { type: 'text', body:
          'Take the folk staple: down, down-up, up-down-up. Written on the grid it is strokes 1, 3, 4, ' +
          '6, 7, 8 of the eight eighth-note positions. Your hand still makes all eight movements; it ' +
          'only makes contact on six of them.' }
      ],
      drill: {
        name: 'Silent hand',
        how: 'Metronome on quarters. Strum continuously in eighths, out loud, for one minute. Then in ' +
             'sixteenths for one minute. Then, keeping the motion identical, start missing strokes to ' +
             'make patterns. The motion never changes.',
        bpm: { start: 60, target: 100 },
        metronome: { beatsPerBar: 4, subdivision: 4 }
      },
      checks: [
        'Your strumming hand keeps moving through a missed stroke without a hitch.',
        'You can name the direction of any stroke in the bar without playing it.',
        'You can change pattern mid-bar without the motion changing.'
      ]
    },

    {
      id: 'd2',
      track: 'D',
      title: 'Boom-chick: country and bluegrass rhythm',
      goal: 'Play a bass-and-chord rhythm that a band could actually play over.',
      time: 20,
      tags: ['country', 'bluegrass', 'rhythm'],
      sections: [
        { type: 'text', body:
          'Bass note on 1 and 3, chord on 2 and 4. That is the whole thing, and it is the backbone of ' +
          'country, bluegrass, old-time and a good deal of folk. It works because it splits the ' +
          'guitar into two instruments: a bass and a snare.' },
        { type: 'tab', tempo: 92, tone: 'steel',
          bars: [
            '6-3:1, 3-0+2-0+1-3:1, 4-0:1, 3-0+2-0+1-3:1',
            '5-3:1, 3-0+2-1+1-0:1, 4-2:1, 3-0+2-1+1-0:1'
          ],
          caption: 'A bar of G, then a bar of C. The chord strokes are the top three strings only.' },
        { type: 'heading', body: 'Making it sound like bluegrass rather than a metronome' },
        { type: 'list', items: [
          'The chord on 2 and 4 should be short and hard. Damp it immediately with the fretting hand -- it is a snare hit, not a chord.',
          'The bass note should be long and full. Let it ring under the chop.',
          'Hit only three or four strings on the chop. A full six-string strum turns it into mush.',
          'Bluegrass tempo is faster than you think and the chop is drier than you think.'
        ] },
        { type: 'callout', kind: 'tip', body:
          'If it sounds stiff, the chop is too long. Try making it half as long as feels right and see ' +
          'whether it improves. It usually does.' }
      ],
      drill: {
        name: 'Bass long, chop short',
        how: 'One chord, boom-chick, one minute. Exaggerate the difference: bass notes ringing for a ' +
             'full beat, chops cut dead the instant they sound. Then change chords every bar.',
        bpm: { start: 80, target: 132 },
        metronome: { beatsPerBar: 4, subdivision: 1 }
      },
      checks: [
        'The chop is genuinely short and damped, not just quieter.',
        'The bass note is clearly a different voice from the chord.',
        'It holds together at 120 bpm.'
      ]
    },

    {
      id: 'd3',
      track: 'D',
      title: 'Bass runs between chords',
      goal: 'Walk from one chord to the next instead of jumping.',
      time: 20,
      tags: ['bass runs', 'country', 'bluegrass'],
      sections: [
        { type: 'text', body:
          'A bass run is a short scale line in the last bar before a chord change that carries the ear ' +
          'from one root to the next. It is what stops a boom-chick rhythm sounding mechanical, and ' +
          'in bluegrass it is expected rather than optional.' },
        { type: 'heading', body: 'G to C' },
        { type: 'text', body:
          'The roots are G and C. A fourth apart, so the run is G, A, B, C -- four notes, the last one ' +
          'landing on the downbeat of the new chord.' },
        { type: 'tab', tempo: 92, tone: 'steel',
          bars: [
            '6-3:1, 3-0+2-0+1-3:1, 6-3:0.5 6-5:0.5, 5-2:0.5 5-3:0.5',
            '5-3:1, 3-0+2-1+1-0:1, 4-2:1, 3-0+2-1+1-0:1'
          ],
          caption: 'The run occupies beats 3 and 4 of the G bar and lands on C.' },
        { type: 'heading', body: 'Building your own' },
        { type: 'list', items: [
          'Find the root you are leaving and the root you are arriving at.',
          'Fill the gap with scale notes from the key. Two or three is plenty.',
          'The arrival note must land exactly on beat 1. Everything else is negotiable.',
          'If the roots are far apart, run down instead of up -- or use the fifth as a stepping stone.'
        ] },
        { type: 'callout', kind: 'note', body:
          'A run replaces the chop, it does not join it. While you are running, the rhythm is carried ' +
          'entirely by the bass line, so it has to be dead in time.' }
      ],
      drill: {
        name: 'Every change gets a run',
        how: 'G, C, G, D, one bar each. Put a two-note run in the second half of every bar. Then try ' +
             'three-note runs starting on the "and" of 3.',
        bpm: { start: 76, target: 120 },
        metronome: { beatsPerBar: 4, subdivision: 2 }
      },
      checks: [
        'Every run lands on beat 1 of the new chord.',
        'You can build a run between any two chords in a key without working it out first.'
      ]
    },

    {
      id: 'd4',
      track: 'D',
      title: 'Shuffle and swing',
      goal: 'Play a convincing swing feel, and know how much swing a style wants.',
      time: 22,
      tags: ['shuffle', 'swing', 'blues'],
      sections: [
        { type: 'text', body:
          'Swing means the beat is divided into three rather than two: the first eighth of each pair ' +
          'takes two thirds of the beat and the second takes one. Long, short. It is not a rhythm you ' +
          'can notate accurately in eighths, which is why it is written straight and marked "swing".' },
        { type: 'heading', body: 'How much swing' },
        { type: 'list', items: [
          'Hard shuffle, near-triplet: Chicago blues, jump blues. The metronome swing slider around 60 to 66 per cent.',
          'Medium swing: jazz, western swing. Around 50 to 60 per cent, and it loosens as the tempo rises.',
          'Light swing: a lot of folk and country sits at 15 to 30 per cent -- not straight, but nowhere near a triplet.',
          'Fast tempos flatten out. Above about 200 bpm almost everyone plays close to straight eighths.'
        ] },
        { type: 'text', body:
          'The metronome in this app has a swing slider. Set it to eighth notes, push the swing up, ' +
          'and play along until the feel is in your hands rather than in your counting.' },
        { type: 'heading', body: 'A shuffle rhythm' },
        { type: 'tab', tempo: 84, tone: 'steel',
          bars: [
            '5-0+4-2:0.5 5-0+4-4:0.5, 5-0+4-2:0.5 5-0+4-4:0.5, 5-0+4-2:0.5 5-0+4-4:0.5, 5-0+4-2:0.5 5-0+4-4:0.5'
          ],
          caption: 'The classic two-string blues shuffle in A. Play it swung, not straight.' },
        { type: 'callout', kind: 'warning', body:
          'The commonest mistake is swinging the eighths but leaving the quarter notes rigid, which ' +
          'produces a lurching feel. The swing is in the subdivision; the pulse itself stays even.' }
      ],
      drill: {
        name: 'Straight to swung and back',
        how: 'Play the shuffle figure with swing at zero. Then 33 per cent. Then 60. Then back to zero. ' +
             'Being able to move deliberately between them is more useful than being able to do one.',
        bpm: { start: 70, target: 110 },
        metronome: { beatsPerBar: 4, subdivision: 2, swing: 0.6 }
      },
      checks: [
        'You can play straight and swung on demand without thinking.',
        'Your quarter-note pulse stays even when the eighths swing.',
        'You can hear roughly how much swing a recording has.'
      ]
    },

    {
      id: 'd5',
      track: 'D',
      title: 'Compound time: 6/8, 3/4 and 12/8',
      goal: 'Play in three and in six without it collapsing back into four.',
      time: 20,
      tags: ['6/8', 'waltz', 'meter'],
      sections: [
        { type: 'text', body:
          'Three-feel is everywhere in traditional music -- jigs, waltzes, slow airs, a great many ' +
          'ballads -- and it is the meter most guitarists are weakest in, because four is so ' +
          'ingrained that three keeps trying to become it.' },
        { type: 'heading', body: '3/4: three beats, each split in two' },
        { type: 'text', body:
          'A waltz. Bass on 1, chord on 2 and 3. The accent is firmly on 1, and the two chords after ' +
          'it are lighter.' },
        { type: 'tab', tempo: 132, timeSig: [3, 4], tone: 'steel',
          bars: [
            '5-3:1, 3-0+2-1+1-0:1, 3-0+2-1+1-0:1',
            '6-3:1, 3-0+2-0+1-3:1, 3-0+2-0+1-3:1'
          ],
          caption: 'Waltz time. C then G.' },
        { type: 'heading', body: '6/8: two beats, each split in three' },
        { type: 'text', body:
          'This is the difference that matters. 6/8 is not "six beats"; it is two big beats each ' +
          'divided into three. Count "ONE two three FOUR five six" and put weight on 1 and 4. Jigs ' +
          'live here, and so do a lot of Celtic-flavoured songs.' },
        { type: 'tab', tempo: 200, timeSig: [6, 4], tone: 'finger',
          bars: [
            '6-0:1, 3-0:1, 2-0:1, 4-2:1, 3-0:1, 2-0:1',
            '5-0:1, 3-2:1, 2-1:1, 4-2:1, 3-2:1, 2-1:1'
          ],
          caption: 'Em then Am, in 6/8. Set the metronome to 6 beats a bar and accent 1 and 4.' },
        { type: 'callout', kind: 'tip', body:
          'To feel 6/8 rather than count it, tap your foot only twice a bar. If your foot wants to tap ' +
          'six times you are still counting, and it will sound like it.' }
      ],
      drill: {
        name: 'Two taps a bar',
        how: 'Metronome at 6 beats a bar with the accent on 1. Play a 6/8 pattern while tapping your ' +
             'foot only on beats 1 and 4. Five minutes. Then switch to 3/4 and tap only on 1.',
        bpm: { start: 120, target: 200 },
        metronome: { beatsPerBar: 6, subdivision: 1 }
      },
      checks: [
        'You can play in 6/8 while tapping twice a bar.',
        'You can tell a jig from a reel by ear.',
        'Three-feel does not drift into four after a few bars.'
      ]
    },

    {
      id: 'd6',
      track: 'D',
      title: 'Odd meters',
      goal: 'Play in 5 and 7 by grouping them, not by counting them.',
      time: 20,
      tags: ['odd meter', 'folk', '5/4', '7/8'],
      sections: [
        { type: 'text', body:
          'Balkan, Nordic and a fair amount of contemporary folk lives in fives and sevens. They are ' +
          'far easier than they look, because nobody actually counts to seven. They group.' },
        { type: 'heading', body: 'Five as 3 + 2' },
        { type: 'text', body:
          'Count "ONE two three FOUR five" -- a group of three followed by a group of two. It is a ' +
          'limp, and once you feel it as two uneven beats rather than five even ones it becomes easy.' },
        { type: 'tab', tempo: 150, timeSig: [5, 4], tone: 'steel',
          bars: [
            '6-0:1, 3-0+2-0:1, 3-0+2-0:1, 5-2:1, 3-0+2-0:1',
            '5-0:1, 3-2+2-1:1, 3-2+2-1:1, 4-2:1, 3-2+2-1:1'
          ],
          caption: 'Em then Am in 5, grouped 3 + 2. Accent beats 1 and 4.' },
        { type: 'heading', body: 'Seven as 2 + 2 + 3' },
        { type: 'text', body:
          'The commonest grouping, and the one that sounds most natural on a guitar. Count ' +
          '"ONE two THREE four FIVE six seven". The long group at the end gives it the lurch.' },
        { type: 'tab', tempo: 190, timeSig: [7, 4], tone: 'steel',
          bars: [
            '6-0:1, 3-0:1, 5-2:1, 3-0:1, 6-0:1, 3-0:1, 2-0:1'
          ],
          caption: 'Seven, grouped 2 + 2 + 3. Accent beats 1, 3 and 5.' },
        { type: 'callout', kind: 'tip', body:
          'Say the groups out loud as words while you play: "apple apple pineapple" for 2+2+3. It ' +
          'sounds silly and it works far better than counting.' }
      ],
      drill: {
        name: 'Group, do not count',
        how: 'Set the metronome to 5 beats a bar with an accent on 1. Play a 3+2 pattern until you stop ' +
             'counting. Then 7 as 2+2+3. Then try 7 as 3+2+2 and hear how different the same meter feels.',
        bpm: { start: 120, target: 190 },
        metronome: { beatsPerBar: 5, subdivision: 1 }
      },
      checks: [
        'You can play in 5 without counting.',
        'You can play 7 in two different groupings and hear the difference.'
      ]
    },

    {
      id: 'd7',
      track: 'D',
      title: 'Dynamics, accents and ghost strums',
      goal: 'Make a repeated pattern interesting without changing a single note.',
      time: 18,
      tags: ['dynamics', 'strumming', 'groove'],
      sections: [
        { type: 'text', body:
          'The gap between a competent strummer and a good one is almost entirely dynamics. Same ' +
          'chords, same pattern, same tempo -- and one of them is worth listening to for three ' +
          'minutes and the other is not.' },
        { type: 'heading', body: 'Three tools' },
        { type: 'list', items: [
          'Accents. Pick two strokes in the bar to be noticeably louder. Usually 2 and 4, but moving the accent to an off-beat transforms the feel.',
          'Ghost strums. Strokes that barely touch the strings, or touch them muted. They keep the motion going and add texture without adding volume.',
          'Shape across bars. A four-bar phrase that gets louder into bar 4 and drops back for bar 1 sounds composed. A flat one sounds like practice.'
        ] },
        { type: 'text', body:
          'Ghost strums are the one most people miss. If your hand is already moving continuously, the ' +
          'strokes you decided to miss can instead become almost-silent contacts. The pattern stays ' +
          'the same; the groove appears.' },
        { type: 'callout', kind: 'tip', body:
          'Record thirty seconds of a pattern played flat, then thirty seconds with accents on 2 and 4 ' +
          'and ghost strums in between. Listening back is far more convincing than reading about it.' }
      ],
      drill: {
        name: 'One pattern, four dynamics',
        how: 'One chord, one pattern, four bars each: flat, accented on 2 and 4, accented on the "and" ' +
             'of 2, and with a crescendo across four bars. Do not change the notes.',
        bpm: { start: 70, target: 104 },
        metronome: { beatsPerBar: 4, subdivision: 2, mode: 'backbeat' }
      },
      checks: [
        'Your accents are clearly audible without the pattern speeding up.',
        'You use ghost strums, and they are quiet enough to be texture rather than notes.',
        'You can shape a four-bar phrase deliberately.'
      ]
    },

    {
      id: 'd8',
      track: 'D',
      title: 'Metronome discipline',
      goal: 'Keep time yourself, rather than being kept in time.',
      time: 18,
      tags: ['timing', 'practice'],
      sections: [
        { type: 'text', body:
          'Practising with a click on every beat teaches you to follow. That is worth something, but ' +
          'it is not the same as having time. The exercises that build actual time all involve taking ' +
          'the click away.' },
        { type: 'heading', body: 'The progression' },
        { type: 'list', items: [
          'Click on every beat. Fine for learning a part; stop as soon as you can.',
          'Click on 2 and 4 only. Now the click is the backbeat and you have to place beat 1 yourself. This is the single most valuable setting on a metronome.',
          'Click on beat 1 only. A whole bar of your own time between references.',
          'Click on beat 1 of every other bar. Two bars of you.',
          'Click on the "and" of 2. Disorientating at first, and it teaches subdivision better than anything else.'
        ] },
        { type: 'text', body:
          'The metronome in this app does all of these. If beat 1 arrives before or after the click ' +
          'when you go back to every-beat mode, you have found something worth working on.' },
        { type: 'heading', body: 'The tempo ramp' },
        { type: 'text', body:
          'Practising a passage at one tempo teaches you that tempo. Ramping slowly from below your ' +
          'comfortable speed to above it, over ten minutes without stopping, teaches you the passage. ' +
          'Use the ramp on every drill in this course.' },
        { type: 'callout', kind: 'note', body:
          'Rushing is more common than dragging, and it almost always happens in the easy bars rather ' +
          'than the hard ones. If a piece speeds up, look at the simple sections first.' }
      ],
      drill: {
        name: 'Take the click away',
        how: 'Play something you know well. Click on every beat for one minute, then 2 and 4 for two ' +
             'minutes, then bar 1 only for two minutes. Then back to every beat and see whether you ' +
             'are still where you thought.',
        bpm: { start: 80, target: 80 },
        metronome: { beatsPerBar: 4, subdivision: 1, mode: 'backbeat' }
      },
      checks: [
        'You are comfortable with the click on 2 and 4.',
        'You can play a full bar with no click and land beat 1 in the right place.',
        'You know whether you rush or drag, and where.'
      ]
    }
  ];
}(window.GL = window.GL || {}));
