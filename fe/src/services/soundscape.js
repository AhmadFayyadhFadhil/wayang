/**
 * Web Audio API Soundscape & SFX Engine
 * Menghasilkan instrumen suara gamelan, dodogan dalang, kepyak, dan gong secara realtime
 * Menjamin 100% bebas crash/error audio jaringan (NFR-11 & T-11)
 */

class SoundscapeEngine {
  constructor() {
    this.audioCtx = null;
    this.bgmInterval = null;
    this.isPlayingBgm = false;
    this.currentTrackTitle = '';
    this.volume = 0.7;
    this.onStateChange = null;
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  /**
   * SFX: Dodogan Kotak Kayu Dalang
   * Bunyi benturan kayu jati cempala ke kotak wayang yang beresonansi
   */
  playDodogan() {
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // Pitch drop cepat untuk pukulan kayu
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.12);

      gain.gain.setValueAtTime(0.9 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch (e) {
      console.warn('SFX Dodogan fallback:', e);
    }
  }

  /**
   * SFX: Kepyak Pelat Logam
   * Bunyi gemerincing lempeng kuningan/besi pedalangan
   */
  playKepyak() {
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      // Gunakan buffer white noise untuk mensimulasikan getaran pelat logam
      const bufferSize = this.audioCtx.sampleRate * 0.08;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass filter frekuensi tinggi (khas pelat tipis)
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200, now);
      filter.Q.setValueAtTime(4, now);

      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(0.7 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      noise.start(now);
    } catch (e) {
      console.warn('SFX Kepyak fallback:', e);
    }
  }

  /**
   * SFX: Gong Ageng Pamungkas
   * Resonansi bass dalam khas gong perunggu besar
   */
  playGong() {
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;

      // Nada dasar gong (~65Hz) + overtone (harmonics)
      const freqs = [65.4, 130.8, 196.0];
      freqs.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const initialGain = (0.7 / (idx + 1)) * this.volume;
        gain.gain.setValueAtTime(initialGain, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 3.6);
      });
    } catch (e) {
      console.warn('SFX Gong fallback:', e);
    }
  }

  /**
   * Soundscape Melodi Gamelan Slendro & Pelog
   * Memainkan pola aransemen gamelan dinamis yang terus berulang secara atmosferik
   */
  startBgm(synthType = 'srepeg', title = 'Gamelan Srepeg Mataram') {
    this.stopBgm();
    this.initContext();
    if (!this.audioCtx) return;

    this.isPlayingBgm = true;
    this.currentTrackTitle = title;
    if (this.onStateChange) this.onStateChange({ isPlaying: true, title });

    // Frekuensi tangga nada Slendro & Pelog (Hz)
    // Nem (270), Barang (308), Gulu (355), Dhadha (396), Lima (460)
    const slendroNotes = [270, 308, 355, 396, 460, 540];
    const pelogNotes = [260, 285, 320, 390, 430, 520];

    const notes = synthType === 'srepeg' ? slendroNotes : pelogNotes;
    const intervalMs = synthType === 'srepeg' ? 420 : synthType === 'sampak' ? 280 : 750;

    let step = 0;
    this.bgmInterval = setInterval(() => {
      if (!this.isPlayingBgm || !this.audioCtx) return;

      try {
        const now = this.audioCtx.currentTime;
        const noteIndex = (step * 3 + (step % 2)) % notes.length;
        const freq = notes[noteIndex];

        // Saron / Gender chime
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const noteGain = 0.18 * this.volume;
        gain.gain.setValueAtTime(noteGain, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + (intervalMs / 1000) * 1.5);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + (intervalMs / 1000) * 1.6);

        // Setiap 8 ketukan, bunyikan gong mini
        if (step % 8 === 0) {
          const gongOsc = this.audioCtx.createOscillator();
          const gongGain = this.audioCtx.createGain();
          gongOsc.type = 'triangle';
          gongOsc.frequency.setValueAtTime(95, now);
          gongGain.gain.setValueAtTime(0.25 * this.volume, now);
          gongGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
          gongOsc.connect(gongGain);
          gongGain.connect(this.audioCtx.destination);
          gongOsc.start(now);
          gongOsc.stop(now + 1.9);
        }

        step++;
      } catch (_err) {
        // Safe fail
      }
    }, intervalMs);
  }

  stopBgm() {
    this.isPlayingBgm = false;
    this.currentTrackTitle = '';
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    if (this.onStateChange) {
      this.onStateChange({ isPlaying: false, title: '' });
    }
  }

  toggleBgm(synthType = 'srepeg', title = 'Gamelan Srepeg Mataram') {
    if (this.isPlayingBgm) {
      this.stopBgm();
    } else {
      this.startBgm(synthType, title);
    }
  }
}

export const soundEngine = new SoundscapeEngine();
export default soundEngine;
