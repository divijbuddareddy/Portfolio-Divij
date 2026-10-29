/**
 * Interactive Neural Synapse Background Canvas
 * Simulates an interconnected neural network that reacts to user mouse movement & clicks
 */

(function () {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 180, isDown: false };
  let animationFrameId;
  let isVisible = true;

  // Particle configuration
  const config = {
    particleCount: window.innerWidth < 768 ? 45 : 95,
    maxDistance: window.innerWidth < 768 ? 110 : 160,
    baseSpeed: 0.65,
    nodeMinRadius: 1.2,
    nodeMaxRadius: 2.8,
  };

  // Get active color from CSS variable
  function getAccentColor() {
    const style = getComputedStyle(document.documentElement);
    const rgb = style.getPropertyValue('--primary-accent-rgb').trim() || '0, 240, 255';
    return rgb;
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  }

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * config.baseSpeed;
      this.vy = (Math.random() - 0.5) * config.baseSpeed;
      this.radius = Math.random() * (config.nodeMaxRadius - config.nodeMinRadius) + config.nodeMinRadius;
      this.baseAlpha = Math.random() * 0.5 + 0.3;
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
      this.pulseVal = Math.random() * Math.PI;
    }

    update() {
      // Periodic gentle pulse
      this.pulseVal += this.pulseSpeed;
      const currentRadius = this.radius + Math.sin(this.pulseVal) * 0.6;

      // Mouse interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          const push = force * (mouse.isDown ? -8 : -1.8);
          this.x += Math.cos(angle) * push;
          this.y += Math.sin(angle) * push;
        }
      }

      this.x += this.vx;
      this.y += this.vy;

      // Wall bounce
      if (this.x < 0) { this.x = 0; this.vx *= -1; }
      else if (this.x > width) { this.x = width; this.vx *= -1; }

      if (this.y < 0) { this.y = 0; this.vy *= -1; }
      else if (this.y > height) { this.y = height; this.vy *= -1; }

      return currentRadius;
    }

    draw(currentRadius, rgb) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0.5, currentRadius), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb}, ${this.baseAlpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(${rgb}, 0.6)`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function initParticles() {
    particles = [];
    const count = window.innerWidth < 768 ? 45 : 95;
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles(rgb) {
    const maxDist = config.maxDistance;
    const count = particles.length;

    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.22;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${rgb}, ${alpha})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }

      // Connect to mouse pointer
      if (mouse.x !== null && mouse.y !== null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const alpha = (1 - dist / mouse.radius) * 0.45;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${rgb}, ${alpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    if (!isVisible) return;

    ctx.clearRect(0, 0, width, height);
    const rgb = getAccentColor();

    for (let i = 0; i < particles.length; i++) {
      const curRadius = particles[i].update();
      particles[i].draw(curRadius, rgb);
    }

    connectParticles(rgb);
    animationFrameId = requestAnimationFrame(animate);
  }

  // Event Listeners
  window.addEventListener('resize', () => {
    resize();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('mousedown', () => {
    mouse.isDown = true;
  });

  window.addEventListener('mouseup', () => {
    mouse.isDown = false;
  });

  // Touch support for mobile devices
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Visibility optimization
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isVisible = false;
      cancelAnimationFrame(animationFrameId);
    } else {
      isVisible = true;
      animate();
    }
  });

  // Initialize
  resize();
  animate();
})();

