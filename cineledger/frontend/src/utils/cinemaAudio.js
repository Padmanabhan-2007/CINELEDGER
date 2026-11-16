// Pure Web Audio API Cinema Sound Synthesizer
// 100% offline, 0 external assets, 0 latency, high fidelity acoustics

class CinemaAudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  isMuted() {
    return this.muted;
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  setMuted(muted) {
    this.muted = muted;
  }

  // Deep Theatrical Sub-Bass Impact (THX / IMAX style swell)
  playCinematicBoom() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      // Sub-bass sine oscillator
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, t);
      osc.frequency.exponentialRampToValueAtTime(32, t + 1.2);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.45, t + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 1.7);

      // Warm acoustic harmonics layer
      const harm = this.ctx.createOscillator();
      const harmGain = this.ctx.createGain();
      harm.type = 'triangle';
      harm.frequency.setValueAtTime(220, t);
      harm.frequency.exponentialRampToValueAtTime(55, t + 0.9);

      harmGain.gain.setValueAtTime(0.001, t);
      harmGain.gain.linearRampToValueAtTime(0.18, t + 0.06);
      harmGain.gain.exponentialRampToValueAtTime(0.001, t + 1.1);

      harm.connect(harmGain);
      harmGain.connect(this.ctx.destination);

      harm.start(t);
      harm.stop(t + 1.2);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Sparkling Golden Celebration Chime (Crystal Harmonic Arpeggio)
  playCelebrationChime() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Gold Major Chord)
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + idx * 0.09;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.12, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 1.5);
      });
    } catch {}
  }

  // Realistic 3D Card Flip Whoosh
  playCardFlipWhoosh() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      // Filtered noise burst simulating paper / card swoosh
      const bufferSize = this.ctx.sampleRate * 0.25;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, t);
      filter.frequency.exponentialRampToValueAtTime(2200, t + 0.1);
      filter.frequency.exponentialRampToValueAtTime(400, t + 0.25);
      filter.Q.value = 3.0;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.2, t + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(t);
      noise.stop(t + 0.26);
    } catch {}
  }

  // High-Tech Gate Laser Scan Confirmation Beep
  playLaserScanBeep() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, t);
      osc.frequency.exponentialRampToValueAtTime(1800, t + 0.08);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.14, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.19);
    } catch {}
  }

  // Luxury Electric Recliner Motor Sound (PVR Gold Class Recline)
  playReclinerMotor() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      // Deep motorized hum
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(84, t);
      osc.frequency.linearRampToValueAtTime(96, t + 0.15);
      osc.frequency.linearRampToValueAtTime(80, t + 0.45);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.08, t + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.48);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.5);

      // Subtle mechanical relay click at the start
      const click = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      click.type = 'sine';
      click.frequency.setValueAtTime(1200, t);
      click.frequency.exponentialRampToValueAtTime(400, t + 0.03);

      clickGain.gain.setValueAtTime(0.001, t);
      clickGain.gain.linearRampToValueAtTime(0.09, t + 0.005);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);

      click.connect(clickGain);
      clickGain.connect(this.ctx.destination);

      click.start(t);
      click.stop(t + 0.04);
    } catch {}
  }

  // Tactile Soft Mechanical Haptic Click
  playSeatSelectHaptic() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.exponentialRampToValueAtTime(440, t + 0.04);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.07);
    } catch {}
  }

  // Dolby Atmos Deep Subwoofer Room Resonance
  playAtmosSpatialRumble() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      const sub = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      sub.type = 'sine';
      sub.frequency.setValueAtTime(42, t);
      sub.frequency.exponentialRampToValueAtTime(28, t + 1.8);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.35, t + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);

      sub.connect(gain);
      gain.connect(this.ctx.destination);

      sub.start(t);
      sub.stop(t + 2.3);
    } catch {}
  }
}

export const cinemaAudio = new CinemaAudioEngine();

