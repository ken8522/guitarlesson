/* song-charts.js -- bar-by-bar chord charts for songs still in copyright.

   Chords and song structure are facts about a piece of music: what key it is
   in, where the capo goes, which chord falls on which bar. That is the same
   class of information as a recipe's ingredient list, and it is what every
   chord site publishes. Lyrics are a different thing entirely -- they are the
   protected expression -- so there are none here and there never will be. Each
   chart carries a link to a licensed site for the words.

   `capo` is where the capo goes; `chords` are the SHAPES you hold with it on,
   which is what your hands need. `key` is what actually comes out.

   Matching to the index is by title + artist, done in songs.js.
*/
(function (GL) {
  'use strict';

  function C(o) {
    o.timeSig = o.timeSig || [4, 4];
    o.capo = o.capo || 0;
    return o;
  }

  GL.songCharts = [

    /* ------------------------------------------------ modern acoustic pop */

    C({ title: 'Perfect', artist: 'Ed Sheeran', key: 'Ab', capo: 1, tempo: 64, timeSig: [3, 4],
      feel: '6/8 ballad — count it in three, or as two big beats to the bar',
      strum: 'Bass note, then two light strums. Down / down-up / down-up.',
      note: 'Capo 1 and play G shapes. The whole song is one four-chord loop, so the only hard part is keeping the 6/8 lilt steady.',
      sections: [
        { name: 'Verse', bars: ['G', 'Em', 'C', 'D'] },
        { name: 'Pre-chorus', bars: ['G', 'Em', 'C', 'D'] },
        { name: 'Chorus', bars: ['G', 'Em', 'C', 'D', 'G', 'Em', 'C', 'D'] },
        { name: 'Bridge', bars: ['C', 'D', 'G', 'Em', 'C', 'D', 'G', 'G'] }
      ] }),

    C({ title: 'Photograph', artist: 'Ed Sheeran', key: 'E', capo: 4, tempo: 108,
      feel: 'Slow, spacious, mostly arpeggiated',
      strum: 'Pick the chords rather than strumming: bass, then the top strings.',
      note: 'Capo 4, C shapes. Ed plays this fingerstyle with a lot of space — resist filling every beat.',
      sections: [
        { name: 'Verse', bars: ['C', 'C', 'Em', 'Em', 'Am', 'Am', 'G', 'G'] },
        { name: 'Chorus', bars: ['C', 'C', 'Em', 'Em', 'Am', 'Am', 'G', 'G'] }
      ] }),

    C({ title: 'Thinking Out Loud', artist: 'Ed Sheeran', key: 'D', capo: 0, tempo: 79,
      feel: 'Slow soul, swung sixteenths',
      strum: 'Percussive and swung. Mute on 2 and 4.',
      note: 'The signature is the walk-up between D and G — D, D/F#, G, A. Play the bass notes deliberately.',
      sections: [
        { name: 'Verse', bars: ['D', 'D/F#', 'G', 'A', 'D', 'D/F#', 'G', 'A'] },
        { name: 'Pre-chorus', bars: ['Em', 'A', 'D', 'D/F#', 'G', 'A', 'D', 'D'] },
        { name: 'Chorus', bars: ['G', 'A', 'D', 'D/F#', 'G', 'A', 'D', 'D'] }
      ] }),

    C({ title: 'Shape of You', artist: 'Ed Sheeran', key: 'C#m', capo: 2, tempo: 96,
      feel: 'Tropical-house groove, four to the floor',
      strum: 'Short, muted, percussive. More rhythm than chord.',
      note: 'Capo 2, Bm shapes. Four chords the whole way through — the interest is entirely in the rhythm.',
      sections: [
        { name: 'Whole song', bars: ['Bm', 'Em', 'G', 'A'] }
      ] }),

    C({ title: 'Someone Like You', artist: 'Adele', key: 'A', capo: 2, tempo: 67,
      feel: 'Piano ballad, rolling arpeggios',
      strum: 'Arpeggiate. Thumb on the bass, fingers rolling up.',
      note: 'Capo 2, G shapes. The E/G# in the original becomes a B/D# shape — most guitarists just play Em and nobody minds.',
      sections: [
        { name: 'Verse', bars: ['G', 'D/F#', 'Em', 'C'] },
        { name: 'Chorus', bars: ['G', 'D/F#', 'Em', 'C', 'G', 'D/F#', 'Em', 'C'] }
      ] }),

    C({ title: 'Someone You Loved', artist: 'Lewis Capaldi', key: 'C', capo: 0, tempo: 110,
      feel: 'Piano ballad',
      strum: 'Let each chord ring a full bar. Do not busy it up.',
      note: 'The four-chord loop is the whole song. C - G - Am - F, over and over, and it works.',
      sections: [
        { name: 'Verse', bars: ['C', 'G', 'Am', 'F'] },
        { name: 'Chorus', bars: ['C', 'G', 'Am', 'F', 'C', 'G', 'Am', 'F'] }
      ] }),

    C({ title: 'Say You Won\'t Let Go', artist: 'James Arthur', key: 'E', capo: 4, tempo: 85,
      feel: 'Gentle, swung',
      strum: 'Down, down-up, up-down-up.',
      note: 'Capo 4, C shapes. One of the easiest modern songs to sing and play at the same time.',
      sections: [
        { name: 'Whole song', bars: ['C', 'G', 'Am', 'F'] }
      ] }),

    C({ title: 'Riptide', artist: 'Vance Joy', key: 'C', capo: 1, tempo: 102,
      feel: 'Bright, driving, ukulele-ish',
      strum: 'Down, down-up, up-down-up. Keep it light.',
      note: 'Capo 1, Am-F-C shapes. Three chords for the verse; the chorus adds a G.',
      sections: [
        { name: 'Verse', bars: ['Am', 'G', 'C', 'C'] },
        { name: 'Chorus', bars: ['Am', 'G', 'C', 'C', 'Am', 'G', 'C', 'C'] },
        { name: 'Bridge', bars: ['F', 'F', 'Am', 'G', 'F', 'F', 'Am', 'G'] }
      ] }),

    C({ title: 'Let Her Go', artist: 'Passenger', key: 'G', capo: 7, tempo: 75,
      feel: 'Fingerpicked folk-pop',
      strum: 'Fingerpick: thumb on the bass, fingers on 3-2-1.',
      note: 'Capo 7 sounds like the record. Capo 2 if you want it lower to sing.',
      sections: [
        { name: 'Verse', bars: ['C', 'C', 'G', 'G', 'Am', 'Am', 'F', 'F'] },
        { name: 'Chorus', bars: ['C', 'G', 'Am', 'F', 'C', 'G', 'Am', 'F'] }
      ] }),

    C({ title: 'Ho Hey', artist: 'The Lumineers', key: 'C', capo: 0, tempo: 80,
      feel: 'Stomp-and-clap folk',
      strum: 'Down on every beat, hard, and shout "ho" and "hey" in the gaps.',
      note: 'Three chords and no subtlety required. Perfect group song.',
      sections: [
        { name: 'Verse', bars: ['C', 'C', 'F', 'C'] },
        { name: 'Chorus', bars: ['Am', 'G', 'C', 'F', 'Am', 'G', 'C', 'C'] }
      ] }),

    C({ title: 'Stay With Me', artist: 'Sam Smith', key: 'C', capo: 0, tempo: 84,
      feel: 'Gospel-tinged soul ballad',
      strum: 'Slow, full strums, one or two a bar.',
      note: 'Three chords. Am - F - C, round and round.',
      sections: [
        { name: 'Whole song', bars: ['Am', 'F', 'C', 'C'] }
      ] }),

    C({ title: 'The Night We Met', artist: 'Lord Huron', key: 'C', capo: 0, tempo: 88, timeSig: [3, 4],
      feel: 'Slow waltz, dreamlike',
      strum: 'Three beats to the bar. Bass, strum, strum.',
      note: 'In three, which is most of why it feels the way it does.',
      sections: [
        { name: 'Whole song', bars: ['C', 'Am', 'F', 'G'] }
      ] }),

    C({ title: 'Sweater Weather', artist: 'The Neighbourhood', key: 'Eb', capo: 1, tempo: 124,
      feel: 'Indie pop, steady eighths',
      strum: 'Even down-up eighths, palm muted in the verse.',
      note: 'Capo 1, Am shapes. The riff is just the chord shapes picked out.',
      sections: [
        { name: 'Verse', bars: ['Am', 'Am', 'F', 'F', 'C', 'C', 'G', 'G'] },
        { name: 'Chorus', bars: ['F', 'G', 'Am', 'Am', 'F', 'G', 'C', 'C'] }
      ] }),

    C({ title: 'Take Me to Church', artist: 'Hozier', key: 'Em', capo: 0, tempo: 128,
      feel: 'Slow-burning soul, builds hard',
      strum: 'Sparse in the verse, full and heavy in the chorus.',
      note: 'The verse loop is Em - Am - Em - Am with a B7 pushing into the chorus.',
      sections: [
        { name: 'Verse', bars: ['Em', 'Am', 'Em', 'Am'] },
        { name: 'Pre-chorus', bars: ['Em', 'Am', 'Em', 'B7'] },
        { name: 'Chorus', bars: ['Am', 'Em', 'Am', 'Em', 'Am', 'Em', 'B7', 'B7'] }
      ] }),

    C({ title: 'Stick Season', artist: 'Noah Kahan', key: 'D', capo: 0, tempo: 130,
      feel: 'Driving folk, relentless strum',
      strum: 'Constant eighths, hard and even. It does not let up.',
      note: 'The energy is entirely in the right hand. Do not stop strumming.',
      sections: [
        { name: 'Verse', bars: ['Bm', 'G', 'D', 'A'] },
        { name: 'Chorus', bars: ['Bm', 'G', 'D', 'A', 'Bm', 'G', 'D', 'A'] }
      ] }),

    /* ---------------------------------------------------- big pop hits */

    C({ title: 'Shallow', artist: 'Lady Gaga and Bradley Cooper', key: 'G', capo: 0, tempo: 96,
      feel: 'Builds from picked verse to full chorus',
      strum: 'Pick the verse. Strum the chorus with everything you have.',
      note: 'Em - D - G in the verse; the chorus lifts to a big Am - C - G.',
      sections: [
        { name: 'Verse', bars: ['Em', 'D', 'G', 'G'] },
        { name: 'Pre-chorus', bars: ['Em', 'D', 'G', 'G', 'Em', 'D', 'G', 'G'] },
        { name: 'Chorus', bars: ['Am', 'C', 'G', 'G', 'Am', 'C', 'G', 'G'] }
      ] }),

    C({ title: 'Counting Stars', artist: 'OneRepublic', key: 'C#m', capo: 4, tempo: 122,
      feel: 'Stomping four-on-the-floor pop',
      strum: 'Percussive. Mute hard on 2 and 4.',
      note: 'Capo 4, Am shapes. Same four chords for almost the entire song.',
      sections: [
        { name: 'Verse', bars: ['Am', 'C', 'G', 'F'] },
        { name: 'Chorus', bars: ['Am', 'C', 'G', 'F', 'Am', 'C', 'G', 'F'] }
      ] }),

    C({ title: 'Believer', artist: 'Imagine Dragons', key: 'Bm', capo: 0, tempo: 125,
      feel: 'Heavy, percussive, stop-start',
      strum: 'Short, hard, muted. Space between hits matters more than the hits.',
      note: 'Two chords for most of it. The drama is all rhythm and dynamics.',
      sections: [
        { name: 'Verse', bars: ['Bm', 'Bm', 'G', 'G'] },
        { name: 'Chorus', bars: ['Bm', 'G', 'D', 'A', 'Bm', 'G', 'D', 'A'] }
      ] }),

    C({ title: 'Radioactive', artist: 'Imagine Dragons', key: 'Bm', capo: 2, tempo: 68,
      feel: 'Slow, heavy, half-time',
      strum: 'Slow and huge. One or two strums a bar.',
      note: 'Capo 2, Am shapes. Four chords, very slow, very loud.',
      sections: [
        { name: 'Whole song', bars: ['Am', 'C', 'G', 'D'] }
      ] }),

    C({ title: 'Dance Monkey', artist: 'Tones and I', key: 'F#m', capo: 2, tempo: 98,
      feel: 'Bouncy, staccato',
      strum: 'Short and clipped, never let a chord ring.',
      note: 'Capo 2, Em shapes. The four-chord minor loop that runs half of modern pop.',
      sections: [
        { name: 'Whole song', bars: ['Em', 'C', 'G', 'D'] }
      ] }),

    C({ title: 'Heat Waves', artist: 'Glass Animals', key: 'B', capo: 4, tempo: 81,
      feel: 'Hazy, laid back',
      strum: 'Loose and behind the beat. Do not rush it.',
      note: 'Capo 4, G shapes. Four chords, and the whole feel is in playing them late.',
      sections: [
        { name: 'Whole song', bars: ['G', 'D', 'Em', 'C'] }
      ] }),

    C({ title: 'Watermelon Sugar', artist: 'Harry Styles', key: 'C', capo: 0, tempo: 95,
      feel: 'Loose, funky, summery',
      strum: 'Light and syncopated, with muted scratches between chords.',
      note: 'The chorus drops to a simple C - Am - F. The verse hangs on Dm7.',
      sections: [
        { name: 'Verse', bars: ['Dm7', 'Dm7', 'Am', 'Am'] },
        { name: 'Chorus', bars: ['C', 'C', 'Am', 'Am', 'F', 'F', 'F', 'F'] }
      ] }),

    C({ title: 'As It Was', artist: 'Harry Styles', key: 'A', capo: 2, tempo: 174,
      feel: 'Fast eighths, but it feels light',
      strum: 'Even eighths, very light. Almost brushed.',
      note: 'Capo 2, G shapes. Fast on paper, gentle in the hand.',
      sections: [
        { name: 'Whole song', bars: ['G', 'D', 'Em', 'C'] }
      ] }),

    C({ title: 'Sunflower', artist: 'Post Malone and Swae Lee', key: 'D', capo: 0, tempo: 90,
      feel: 'Relaxed, swung sixteenths',
      strum: 'Loose and swung. Let it breathe.',
      note: 'Four chords, and the D-Bm-G-A loop never changes.',
      sections: [
        { name: 'Whole song', bars: ['D', 'Bm', 'G', 'A'] }
      ] }),

    C({ title: 'Blinding Lights', artist: 'The Weeknd', key: 'Fm', capo: 1, tempo: 171,
      feel: 'Driving synth-pop, relentless',
      strum: 'Constant eighths, muted and even.',
      note: 'Capo 1, Em shapes. Written for synths, but the chord loop works on guitar.',
      sections: [
        { name: 'Whole song', bars: ['Em', 'C', 'G', 'D'] }
      ] }),

    C({ title: 'drivers license', artist: 'Olivia Rodrigo', key: 'B', capo: 4, tempo: 72,
      feel: 'Slow ballad, builds',
      strum: 'Arpeggiate the verse, strum the chorus.',
      note: 'Capo 4, G shapes.',
      sections: [
        { name: 'Verse', bars: ['G', 'D', 'Em', 'C'] },
        { name: 'Chorus', bars: ['G', 'D', 'Em', 'C', 'G', 'D', 'Em', 'C'] }
      ] }),

    C({ title: 'good 4 u', artist: 'Olivia Rodrigo', key: 'Ab', capo: 1, tempo: 166,
      feel: 'Pop-punk, fast and angry',
      strum: 'Down-strokes, hard, palm muted in the verse.',
      note: 'Capo 1, G shapes. Play the verse muted so the chorus has somewhere to go.',
      sections: [
        { name: 'Verse', bars: ['G', 'G', 'Em', 'Em'] },
        { name: 'Chorus', bars: ['C', 'D', 'G', 'Em', 'C', 'D', 'G', 'G'] }
      ] }),

    C({ title: 'Flowers', artist: 'Miley Cyrus', key: 'Am', capo: 0, tempo: 118,
      feel: 'Disco-tinged pop',
      strum: 'Sixteenth-note funk. Mostly muted, chords only on the accents.',
      note: 'Am - Dm - Em, with a lift to F in the chorus.',
      sections: [
        { name: 'Verse', bars: ['Am', 'Dm', 'Em', 'Em'] },
        { name: 'Chorus', bars: ['Am', 'Dm', 'Em', 'Em', 'Am', 'Dm', 'F', 'Em'] }
      ] }),

    C({ title: 'Beautiful Things', artist: 'Benson Boone', key: 'Bb', capo: 3, tempo: 72,
      feel: 'Quiet verse, enormous chorus',
      strum: 'Fingerpick the verse. The chorus is full down-strums.',
      note: 'Capo 3, G shapes. The dynamic jump is the song — play the verse genuinely quietly.',
      sections: [
        { name: 'Verse', bars: ['G', 'Em', 'C', 'G'] },
        { name: 'Chorus', bars: ['Em', 'C', 'G', 'D', 'Em', 'C', 'G', 'D'] }
      ] }),

    C({ title: 'Cruel Summer', artist: 'Taylor Swift', key: 'A', capo: 2, tempo: 170,
      feel: 'Fast, bright synth-pop',
      strum: 'Even eighths, light.',
      note: 'Capo 2, G shapes.',
      sections: [
        { name: 'Verse', bars: ['G', 'D', 'Em', 'C'] },
        { name: 'Chorus', bars: ['G', 'D', 'Em', 'C', 'G', 'D', 'Em', 'C'] }
      ] }),

    C({ title: 'Anti-Hero', artist: 'Taylor Swift', key: 'G', capo: 0, tempo: 97,
      feel: 'Mid-tempo pop, steady',
      strum: 'Down, down-up, up-down-up.',
      note: 'Four chords in G. The verse and chorus use the same loop.',
      sections: [
        { name: 'Whole song', bars: ['G', 'D', 'Em', 'C'] }
      ] }),

    C({ title: 'Love Story', artist: 'Taylor Swift', key: 'D', capo: 2, tempo: 119,
      feel: 'Country-pop, driving',
      strum: 'Down, down-up, up-down-up. Steady and bright.',
      note: 'Capo 2, C shapes. The key change near the end is the whole point — go up a tone.',
      sections: [
        { name: 'Verse', bars: ['C', 'C', 'G', 'G', 'Am', 'Am', 'F', 'F'] },
        { name: 'Chorus', bars: ['F', 'G', 'C', 'Am', 'F', 'G', 'C', 'C'] }
      ] }),

    C({ title: 'All of Me', artist: 'John Legend', key: 'Ab', capo: 1, tempo: 63,
      feel: 'Slow piano ballad',
      strum: 'Arpeggiate throughout. It is a piano part.',
      note: 'Capo 1, G shapes. Em - C - G - D is the entire song.',
      sections: [
        { name: 'Verse', bars: ['Em', 'C', 'G', 'D'] },
        { name: 'Chorus', bars: ['C', 'G', 'D', 'Em', 'C', 'G', 'D', 'D'] }
      ] }),

    C({ title: 'A Thousand Years', artist: 'Christina Perri', key: 'Bb', capo: 3, tempo: 139, timeSig: [3, 4],
      feel: 'Waltz-time ballad',
      strum: 'Fingerpick in three. Bass, then two rolls.',
      note: 'Capo 3, G shapes, and it is in 3/4 — count one-two-three throughout.',
      sections: [
        { name: 'Verse', bars: ['G', 'D', 'Em', 'C'] },
        { name: 'Chorus', bars: ['G', 'D', 'Em', 'C', 'G', 'D', 'C', 'C'] }
      ] }),

    C({ title: 'Can\'t Help Falling in Love', artist: 'Elvis Presley', key: 'C', capo: 0, tempo: 66, timeSig: [3, 4],
      feel: 'Slow waltz',
      strum: 'Bass, strum, strum. Very simple.',
      note: 'In three. The descending line in the middle section is the memorable bit.',
      sections: [
        { name: 'Verse', bars: ['C', 'Em', 'Am', 'F', 'C', 'G', 'G', 'G'] },
        { name: 'Middle', bars: ['Em', 'B7', 'Em', 'B7', 'Em', 'G', 'Am', 'F', 'C', 'G', 'C', 'C'] }
      ] }),

    C({ title: 'Wonderwall', artist: 'Oasis', key: 'F#m', capo: 2, tempo: 87,
      feel: 'Driving acoustic strum',
      strum: 'Down, down-up, down-up. Never stop moving the hand.',
      note: 'Capo 2. Keep the top two strings fretted at the 3rd fret throughout — that is the ringing sound.',
      sections: [
        { name: 'Verse', bars: ['Em7', 'G', 'Dsus4', 'A7sus4'] },
        { name: 'Pre-chorus', bars: ['Cadd9', 'Dsus4', 'A7sus4', 'A7sus4'] },
        { name: 'Chorus', bars: ['Cadd9', 'Em7', 'G', 'Em7', 'Cadd9', 'Em7', 'G', 'G'] }
      ] }),

    C({ title: 'Viva la Vida', artist: 'Coldplay', key: 'Ab', capo: 1, tempo: 138,
      feel: 'Marching, orchestral',
      strum: 'Even, insistent eighths.',
      note: 'Capo 1, C shapes. Starts on the IV chord, which is why it sounds like it is already in motion.',
      sections: [
        { name: 'Whole song', bars: ['C', 'D', 'G', 'Em'] }
      ] }),

    C({ title: 'Chasing Cars', artist: 'Snow Patrol', key: 'A', capo: 0, tempo: 104,
      feel: 'Slow build, huge chorus',
      strum: 'Let chords ring. Two strums a bar in the verse.',
      note: 'Three chords. The whole song is a slow crescendo.',
      sections: [
        { name: 'Whole song', bars: ['A', 'E', 'D', 'D'] }
      ] }),

    C({ title: 'Zombie', artist: 'The Cranberries', key: 'Em', capo: 0, tempo: 84,
      feel: 'Slow, heavy, deliberate',
      strum: 'Down-strums, let each ring. The chorus is much harder than the verse.',
      note: 'Four chords, no changes, all song. Em - C - G - D.',
      sections: [
        { name: 'Whole song', bars: ['Em', 'C', 'G', 'D'] }
      ] }),

    C({ title: 'Mr. Brightside', artist: 'The Killers', key: 'Db', capo: 1, tempo: 148,
      feel: 'Relentless eighths',
      strum: 'Constant down-up eighths. It does not stop.',
      note: 'Capo 1, C shapes. The riff is just the chord shapes picked one string at a time.',
      sections: [
        { name: 'Verse', bars: ['C', 'C', 'C', 'C'] },
        { name: 'Chorus', bars: ['C', 'F', 'Am', 'G', 'C', 'F', 'Am', 'G'] }
      ] }),

    C({ title: 'Hey There Delilah', artist: 'Plain White T\'s', key: 'D', capo: 0, tempo: 104,
      feel: 'Fingerpicked, gentle',
      strum: 'Fingerpick: thumb alternating, fingers on the top strings.',
      note: 'The D and F#m shapes with an open high E ringing through is the whole sound.',
      sections: [
        { name: 'Verse', bars: ['D', 'F#m', 'D', 'F#m'] },
        { name: 'Chorus', bars: ['Bm', 'G', 'D', 'A', 'Bm', 'G', 'A', 'A'] }
      ] }),

    C({ title: 'I\'m Yours', artist: 'Jason Mraz', key: 'B', capo: 4, tempo: 76,
      feel: 'Loose reggae-pop shuffle',
      strum: 'Off-beat reggae chops. Accent the "and" of every beat.',
      note: 'Capo 4, G shapes. I-V-vi-IV, and the feel is everything.',
      sections: [
        { name: 'Whole song', bars: ['G', 'D', 'Em', 'C'] }
      ] }),

    C({ title: 'Skinny Love', artist: 'Bon Iver', key: 'Am', capo: 0, tempo: 76,
      feel: 'Sparse, raw, open tuning on the record',
      strum: 'Fingerpick, or brush lightly. Leave a lot of space.',
      note: 'The record is in an open tuning. This is the standard-tuning version and it works.',
      sections: [
        { name: 'Verse', bars: ['Am', 'Am', 'C', 'C'] },
        { name: 'Chorus', bars: ['Am', 'C', 'F', 'G', 'Am', 'C', 'F', 'G'] }
      ] }),

    C({ title: 'Little Talks', artist: 'Of Monsters and Men', key: 'Am', capo: 0, tempo: 141,
      feel: 'Fast, stomping indie folk',
      strum: 'Hard down-strums on every beat. It is a marching song.',
      note: 'Four chords, fast, and everyone shouts the "hey!"',
      sections: [
        { name: 'Verse', bars: ['Am', 'F', 'C', 'G'] },
        { name: 'Chorus', bars: ['Am', 'F', 'C', 'G', 'Am', 'F', 'C', 'G'] }
      ] }),

    C({ title: 'Valerie', artist: 'Amy Winehouse', key: 'Eb', capo: 3, tempo: 106,
      feel: 'Northern soul groove',
      strum: 'Sixteenth-note soul strum, mostly muted, chords on the accents.',
      note: 'Capo 3, C shapes. The groove is the song — practise the right hand alone first.',
      sections: [
        { name: 'Verse', bars: ['C', 'Dm', 'C', 'Dm'] },
        { name: 'Chorus', bars: ['F', 'G', 'C', 'Am', 'F', 'G', 'C', 'C'] }
      ] }),

    C({ title: 'Hallelujah', artist: 'Jeff Buckley', key: 'C', capo: 5, tempo: 60, timeSig: [6, 4],
      feel: '6/8, slow and rolling',
      strum: 'Arpeggiate in six. Thumb, then roll up.',
      note: 'Capo 5, C shapes. In 6/8 — count one-two-three-four-five-six with weight on 1 and 4.',
      sections: [
        { name: 'Verse', bars: ['C', 'Am', 'C', 'Am', 'F', 'G', 'C', 'C'] },
        { name: 'Chorus', bars: ['F', 'Am', 'F', 'C', 'G', 'C', 'C', 'C'] }
      ] }),

    C({ title: 'Creep', artist: 'Radiohead', key: 'G', capo: 0, tempo: 92,
      feel: 'Slow, heavy on the chorus',
      strum: 'Clean and quiet in the verse. Big and dirty in the chorus.',
      note: 'Four chords, and the B major going to C is what makes it sound wrong in the right way.',
      sections: [
        { name: 'Whole song', bars: ['G', 'B', 'C', 'Cm'] }
      ] }),

    C({ title: 'Somebody That I Used to Know', artist: 'Gotye', key: 'Dm', capo: 2, tempo: 129,
      feel: 'Sparse, percussive',
      strum: 'Very light, mostly muted. The gaps carry it.',
      note: 'Capo 2, Cm shapes — or play it in Dm with no capo using Dm, C, Bb, F.',
      sections: [
        { name: 'Verse', bars: ['Dm', 'C', 'Bb', 'F'] },
        { name: 'Chorus', bars: ['Dm', 'C', 'Bb', 'F', 'Dm', 'C', 'Bb', 'F'] }
      ] }),

    C({ title: 'Budapest', artist: 'George Ezra', key: 'F', capo: 3, tempo: 128,
      feel: 'Rolling, folky, cheerful',
      strum: 'Down, down-up, up-down-up. Bright and even.',
      note: 'Capo 3, D shapes. Three chords, and it barely stops for breath.',
      sections: [
        { name: 'Whole song', bars: ['D', 'D', 'G', 'A'] }
      ] })
  ];

  /* Look a chart up from an index entry. Titles in the index sometimes carry a
     "(singalong)" or "(acoustic)" suffix, so the match ignores anything in
     brackets and is case-insensitive. */
  function normalise(t) {
    return String(t || '').toLowerCase().replace(/\s*\([^)]*\)\s*/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim();
  }

  GL.findChart = function (entry) {
    if (!entry) return null;
    var t = normalise(entry.title);
    var a = normalise(entry.artist);
    return GL.songCharts.filter(function (c) {
      return normalise(c.title) === t && normalise(c.artist) === a;
    })[0] || GL.songCharts.filter(function (c) {
      return normalise(c.title) === t;
    })[0] || null;
  };
}(window.GL = window.GL || {}));
