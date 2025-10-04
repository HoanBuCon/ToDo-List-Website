(() => {
  const canvas = document.getElementById('nn-background');
  const ctx = canvas.getContext('2d');

  let width, height;
  const BASE_WIDTH = 1920;
  const BASE_HEIGHT = 1080;
  const BASE_AREA = BASE_WIDTH * BASE_HEIGHT;

  const BASE_POINT_COUNT = 100;     // điểm chuẩn cho 1920x1080
  const BASE_MAX_DISTANCE = 180;    // max khoảng cách chuẩn

  let POINT_COUNT = BASE_POINT_COUNT;
  let MAX_DISTANCE = BASE_MAX_DISTANCE;

  const glowUpdateInterval = 3; // cập nhật glow mỗi 3 frame
  let frameCount = 0;
  let points = [];

  function resize() {
    // Check if canvas should cover full viewport or just container
    const shouldCoverFullViewport = canvas.dataset.fullViewport === 'true';
    
    if (shouldCoverFullViewport) {
      width = window.innerWidth;
      height = window.innerHeight;
      
      // Position canvas to cover full viewport
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.zIndex = '-1';
      canvas.style.pointerEvents = 'none';
    } else {
      // Use container dimensions (original behavior)
      const container = canvas.parentElement;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      
      // Reset to original positioning
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.zIndex = '1';
      canvas.style.pointerEvents = 'none';
    }

    const areaRatio = (width * height) / BASE_AREA;

    // POINT_COUNT tăng theo căn bậc hai diện tích, max 150 điểm, min 30 điểm
    POINT_COUNT = Math.min(
      150,
      Math.max(30, Math.round(BASE_POINT_COUNT * Math.sqrt(areaRatio)))
    );

    // MAX_DISTANCE tăng tuyến tính theo căn bậc hai diện tích, max 250, min 100
    MAX_DISTANCE = Math.min(
      250,
      Math.max(100, BASE_MAX_DISTANCE * Math.sqrt(areaRatio))
    );

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * DPR;
    canvas.height = height * DPR;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(DPR, DPR);

    initPoints();
  }

  function initPoints() {
    points = [];
    for (let i = 0; i < POINT_COUNT; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        glow: Math.random() * 10 + 5,
        glowDirection: Math.random() < 0.5 ? 1 : -1,
      });
    }
  }

  function distanceSquared(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx * dx + dy * dy;
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    frameCount++;

    for (const p of points) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      if (frameCount % glowUpdateInterval === 0) {
        p.glow += p.glowDirection * (Math.random() * 0.2);
        if (p.glow > 15) {
          p.glow = 15;
          p.glowDirection = -1;
        } else if (p.glow < 5) {
          p.glow = 5;
          p.glowDirection = 1;
        }
      }
    }

    const maxDistSquared = MAX_DISTANCE * MAX_DISTANCE;
    for (let i = 0; i < points.length; i++) {
      const a = points[i];
      for (let j = i + 1; j < points.length; j++) {
        const b = points[j];
        const distSq = distanceSquared(a, b);
        if (distSq < maxDistSquared) {
          const alpha = 1 - distSq / maxDistSquared;
          ctx.strokeStyle = `rgba(0, 255, 255, ${alpha * 0.3})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (const p of points) {
      ctx.save();
      ctx.shadowColor = 'rgba(0, 255, 255, 0.8)';
      ctx.shadowBlur = p.glow;
      ctx.fillStyle = 'rgba(0, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function animate() {
    draw();
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);

  resize();
  animate();
})();
