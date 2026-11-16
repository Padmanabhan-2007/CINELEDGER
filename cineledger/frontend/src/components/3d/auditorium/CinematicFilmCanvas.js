// Optimized Theatrical Cinema Film Projection Engine
// Ultra-lightweight, 24FPS cinema frame rate, zero GPU pipeline stalls

export class CinematicFilmEngine {
  constructor(posterUrl, filmTitle = 'KALKI 2898 AD') {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 512;
    this.canvas.height = 256;
    this.ctx = this.canvas.getContext('2d', { alpha: false });
    this.posterUrl = posterUrl;
    this.filmTitle = filmTitle;
    this.posterImage = null;
    this.currentAverageColor = { r: 212, g: 175, b: 55, intensity: 1.0 };

    if (posterUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = posterUrl;
      img.onload = () => {
        this.posterImage = img;
      };
    }
  }

  update(elapsedTime) {
    const ctx = this.ctx;
    if (!ctx) return this.canvas;

    const w = this.canvas.width;
    const h = this.canvas.height;
    const t = elapsedTime;
    const cycle = t % 18;

    // Deep cinema black background
    ctx.fillStyle = '#060504';
    ctx.fillRect(0, 0, w, h);

    if (cycle < 3.5) {
      // -------------------------------------------------------------
      // PHASE 1: RETRO IMAX FILM LEADER COUNTDOWN
      // -------------------------------------------------------------
      const count = 3 - Math.floor(cycle);
      const subTime = cycle % 1;

      ctx.save();
      ctx.translate(w / 2, h / 2);

      // Rotating radar crosshair
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 80, 0, Math.PI * 2);
      ctx.arc(0, 0, 105, 0, Math.PI * 2);
      ctx.stroke();

      // Sweeping clock wiper
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 105, -Math.PI / 2, -Math.PI / 2 + subTime * Math.PI * 2);
      ctx.fillStyle = 'rgba(212, 175, 55, 0.3)';
      ctx.fill();

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(-115, 0);
      ctx.lineTo(115, 0);
      ctx.moveTo(0, -115);
      ctx.lineTo(0, 115);
      ctx.stroke();

      if (count > 0) {
        ctx.fillStyle = '#FFF8E7';
        ctx.font = 'bold 70px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(count.toString(), 0, 4);
      }
      ctx.restore();

      this.currentAverageColor = { r: 180, g: 140, b: 60, intensity: 0.9 };
    } else if (cycle < 11.0) {
      // -------------------------------------------------------------
      // PHASE 2: EPIC CINEMATIC MOVIE TRAILER PREMIERE
      // -------------------------------------------------------------
      const phaseT = cycle - 3.5;

      const grad = ctx.createRadialGradient(
        w / 2 + Math.sin(phaseT * 0.8) * 60,
        h / 2,
        20,
        w / 2,
        h / 2,
        w * 0.65
      );
      grad.addColorStop(0, '#FFE8A3');
      grad.addColorStop(0.3, '#D4AF37');
      grad.addColorStop(0.6, '#4E2416');
      grad.addColorStop(1, '#060403');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      if (this.posterImage) {
        ctx.save();
        const pw = 148;
        const ph = 196;
        ctx.globalAlpha = 0.94;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
        ctx.shadowBlur = 24;
        ctx.drawImage(this.posterImage, (w - pw) / 2, (h - ph) / 2, pw, ph);
        ctx.restore();
      }

      // Floating Cinematic Gold Embers
      ctx.save();
      for (let i = 0; i < 28; i++) {
        const seed = i * 137.5;
        const emberX = (Math.sin(seed + phaseT * 0.4) * 0.5 + 0.5) * w;
        const emberY = (Math.cos(seed * 0.8 + phaseT * 0.6) * 0.5 + 0.5) * h;
        const emberSize = 1.2 + Math.sin(seed + phaseT * 2.0) * 0.8;
        const emberAlpha = 0.3 + 0.5 * Math.sin(seed * 2.0 + phaseT * 3.0);
        ctx.fillStyle = `rgba(255, 220, 140, ${Math.max(0, emberAlpha)})`;
        ctx.beginPath();
        ctx.arc(emberX, emberY, Math.max(0.5, emberSize), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Anamorphic Cyan-Blue Cinema Lens Flare Streak
      const flareX = (phaseT * 110) % (w + 240) - 120;
      const flareGrad = ctx.createLinearGradient(flareX - 90, 0, flareX + 90, 0);
      flareGrad.addColorStop(0, 'rgba(0, 180, 255, 0)');
      flareGrad.addColorStop(0.35, 'rgba(0, 220, 255, 0.45)');
      flareGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)');
      flareGrad.addColorStop(0.65, 'rgba(255, 200, 100, 0.45)');
      flareGrad.addColorStop(1, 'rgba(255, 120, 0, 0)');
      ctx.fillStyle = flareGrad;
      ctx.fillRect(0, h * 0.48, w, 3.5);

      // Blockbuster Film Title Banner with Golden Drop Shadow
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 20px serif';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '2px';
      ctx.fillText(this.filmTitle.toUpperCase(), w / 2, h - 28);

      ctx.fillStyle = '#E5B982';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('★ A METEORIC 70MM IMAX 4K DUAL LASER EXPERIENCE ★', w / 2, h - 14);
      ctx.restore();

      this.currentAverageColor = { r: 240, g: 185, b: 100, intensity: 1.4 };
    } else {
      // -------------------------------------------------------------
      // PHASE 3: KINETIC ACTION & IMAX 3D FINALE
      // -------------------------------------------------------------
      const actionT = cycle - 11.0;
      const pulse = Math.sin(actionT * 8.0);

      const bgGrad = ctx.createLinearGradient(0, 0, w, h);
      if (pulse > 0) {
        bgGrad.addColorStop(0, '#1A0E08');
        bgGrad.addColorStop(0.5, '#7F2F11');
        bgGrad.addColorStop(1, '#1A0E08');
      } else {
        bgGrad.addColorStop(0, '#091522');
        bgGrad.addColorStop(0.5, '#1B4B6E');
        bgGrad.addColorStop(1, '#091522');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = '#FFF8E7';
      ctx.font = '900 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(actionT > 3.5 ? 'EXPERIENCE IT IN IMAX 3D' : 'NOW PLAYING WORLDWIDE', w / 2, h / 2);

      this.currentAverageColor = {
        r: pulse > 0 ? 255 : 80,
        g: pulse > 0 ? 140 : 160,
        b: pulse > 0 ? 60 : 255,
        intensity: 1.5,
      };
    }

    // 2.39:1 Letterbox Bars
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, 14);
    ctx.fillRect(0, h - 14, w, 14);

    return this.canvas;
  }
}
