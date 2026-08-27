/* pitch.js -- hearing what the guitar is actually playing.

   Plain autocorrelation is easy to write and octave-error prone: a plucked low
   E has so much energy in its second harmonic that the strongest correlation
   peak is often at half the true period, and the tuner reads E3 instead of E2.

   This uses the normalised square difference function (McLeod's method), which
   divides the correlation by the energy in the window and then takes the FIRST
   peak that is nearly as tall as the tallest, rather than the tallest outright.
   That one rule is what stops the needle jumping an octave when you dig in.
*/
(function (GL) {
  'use strict';

  var MIN_HZ = 58;     /* below drop-C, so every tuning we ship is covered */
  var MAX_HZ = 1650;   /* headroom over the 24th fret of the high E (1318Hz) */

  function create(opts) {
    opts = opts || {};
    var onPitch = opts.onPitch || function () {};
    var onError = opts.onError || function () {};
    var fftSize = opts.fftSize || 4096;
    var gate = opts.rmsGate === undefined ? 0.006 : opts.rmsGate;

    var stream = null;
    var source = null;
    var analyser = null;
    var buf = null;
    var raf = null;
    var running = false;
    var history = [];
    var lastEmit = 0;

    function start() {
      if (running) return Promise.resolve();
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        var why = window.isSecureContext === false
          ? 'The microphone needs a secure page. Run serve.py and open http://localhost:8627 instead of the file directly.'
          : 'This browser will not give the page a microphone.';
        onError(why);
        return Promise.reject(new Error(why));
      }

      /* Every one of these processors exists to make speech sound better and
         a guitar sound wrong. Ask for the raw signal. */
      return navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          channelCount: 1
        }
      }).then(function (s) {
        var ctx = GL.audio.context();
        return ctx.resume().then(function () { return s; });
      }).then(function (s) {
        stream = s;
        var ctx = GL.audio.context();
        source = ctx.createMediaStreamSource(stream);
        analyser = ctx.createAnalyser();
        analyser.fftSize = fftSize;
        analyser.smoothingTimeConstant = 0;
        source.connect(analyser);
        /* Deliberately NOT connected to the destination -- that is a feedback
           loop with a live microphone. */
        buf = new Float32Array(analyser.fftSize);
        running = true;
        history = [];
        loop();
      }).catch(function (err) {
        var msg = (err && err.name === 'NotAllowedError')
          ? 'Microphone permission was declined. Allow it in the browser address bar and try again.'
          : (err && err.name === 'NotFoundError')
            ? 'No microphone was found on this machine.'
            : 'Could not open the microphone: ' + (err && err.message ? err.message : err);
        onError(msg);
        throw err;
      });
    }

    function loop() {
      if (!running) return;
      raf = requestAnimationFrame(loop);

      var now = performance.now();
      /* 25Hz is faster than anyone can turn a machine head, and leaves the
         main thread alone the rest of the time. */
      if (now - lastEmit < 40) return;
      lastEmit = now;

      analyser.getFloatTimeDomainData(buf);
      var res = detect(buf, GL.audio.context().sampleRate);

      if (!res) {
        history.length = 0;
        onPitch(null);
        return;
      }

      history.push(res.freq);
      if (history.length > 6) history.shift();

      /* Median, not mean: one bad frame should not move the needle. */
      var sorted = history.slice().sort(function (a, b) { return a - b; });
      var median = sorted[Math.floor(sorted.length / 2)];

      onPitch({
        freq: median,
        raw: res.freq,
        clarity: res.clarity,
        rms: res.rms,
        midi: GL.notes.freqToMidi(median),
        cents: GL.notes.centsOff(median),
        settled: history.length >= 4
      });
    }

    function detect(x, sampleRate) {
      var W = x.length;

      var rms = 0;
      for (var i = 0; i < W; i++) rms += x[i] * x[i];
      rms = Math.sqrt(rms / W);
      if (rms < gate) return null;

      var minTau = Math.max(2, Math.floor(sampleRate / MAX_HZ));
      var maxTau = Math.min(W - 2, Math.floor(sampleRate / MIN_HZ));

      /* The NSDF is computed from lag zero, not from minTau, because the peak
         search below has to start on the initial descent. Starting it at minTau
         put a high note's first correlation peak BEHIND the starting point, and
         the search walked straight past it to the peak at twice the period --
         every note above about 1200Hz read an octave flat. */
      var nsdf = new Float32Array(maxTau + 2);
      for (var tau = 0; tau <= maxTau + 1; tau++) {
        var acf = 0, energy = 0;
        var n = W - tau;
        for (var j = 0; j < n; j++) {
          var a = x[j], b = x[j + tau];
          acf += a * b;
          energy += a * a + b * b;
        }
        nsdf[tau] = energy > 0 ? (2 * acf) / energy : 0;
      }

      /* nsdf[0] is always 1. Walk off that initial hump first -- otherwise it
         is itself the tallest "peak" and every note reads as a period of zero. */
      var t = 0;
      while (t < maxTau && nsdf[t] > 0) t++;

      /* Then collect local maxima above zero. Peaks below minTau are skipped
         rather than stopping the scan: they are harmonics, not the note. */
      var peaks = [];
      for (; t < maxTau; t++) {
        if (nsdf[t] > 0 && nsdf[t] >= nsdf[t - 1] && nsdf[t] >= nsdf[t + 1]) {
          if (t >= minTau) peaks.push(t);
          /* Move past this peak's downslope so its shoulder is not counted. */
          while (t < maxTau && nsdf[t + 1] <= nsdf[t]) t++;
        }
      }
      if (!peaks.length) return null;

      var best = 0;
      peaks.forEach(function (p) { if (nsdf[p] > best) best = nsdf[p]; });
      if (best < 0.6) return null;   /* nothing periodic enough to be a note */

      /* The first peak within 90% of the tallest. This is the octave fix. */
      var chosen = peaks[0];
      for (var k = 0; k < peaks.length; k++) {
        if (nsdf[peaks[k]] >= best * 0.9) { chosen = peaks[k]; break; }
      }

      /* Parabolic interpolation for sub-sample resolution -- without it the
         reading quantises to a few cents at the top of the neck. */
      var y0 = nsdf[chosen - 1], y1 = nsdf[chosen], y2 = nsdf[chosen + 1];
      var denom = 2 * (2 * y1 - y0 - y2);
      var shift = denom !== 0 ? (y2 - y0) / denom : 0;
      var period = chosen + shift;

      var freq = sampleRate / period;
      if (freq < MIN_HZ || freq > MAX_HZ) return null;

      return { freq: freq, clarity: y1, rms: rms };
    }

    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = null;
      if (source) { try { source.disconnect(); } catch (e) { /* already gone */ } }
      if (stream) stream.getTracks().forEach(function (t) { t.stop(); });
      stream = null;
      source = null;
      analyser = null;
      history = [];
    }

    return {
      start: start,
      stop: stop,
      isRunning: function () { return running; },
      /* Exposed so the audio sanity checks can feed it a synthesised tone. */
      _detect: detect
    };
  }

  GL.pitch = { create: create, MIN_HZ: MIN_HZ, MAX_HZ: MAX_HZ };
}(window.GL = window.GL || {}));
