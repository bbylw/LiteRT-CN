import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  pulsePhase: number;
}

export const ParticleMesh: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Generate Neural Nodes
    const nodeCount = Math.min(Math.floor((width * height) / 18000), 85);
    const nodes: Node[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const r = Math.random() * 2 + 1.5;
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: r,
        baseRadius: r,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      const isDark = theme === 'dark';
      const nodeColor = isDark ? 'rgba(96, 165, 250, ' : 'rgba(37, 99, 235, ';
      const lineColor = isDark ? 'rgba(59, 130, 246, ' : 'rgba(37, 99, 235, ';
      const accentColor = isDark ? 'rgba(168, 85, 247, ' : 'rgba(124, 58, 237, ';

      // Update & Draw Nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Move
        node.x += node.vx;
        node.y += node.vy;

        // Bounce
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Mouse interaction
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - node.x;
          const dy = mouseRef.current.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const force = (180 - dist) / 180;
            node.x += (dx / dist) * force * 1.2;
            node.y += (dy / dist) * force * 1.2;
            node.radius = node.baseRadius + force * 2.5;
          } else {
            node.radius = node.baseRadius;
          }
        }

        // Draw node
        const pulse = Math.sin(time + node.pulsePhase) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * pulse, 0, Math.PI * 2);
        ctx.fillStyle = i % 4 === 0 ? `${accentColor}0.85)` : `${nodeColor}0.85)`;
        ctx.fill();

        // Connect nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          const dx = node.x - nodeB.x;
          const dy = node.y - nodeB.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const alpha = (1 - dist / 150) * (isDark ? 0.22 : 0.14);
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.strokeStyle = `${lineColor}${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Synapse energy pulse traveling along wire
            if ((i + j) % 7 === 0) {
              const progress = (time * 0.8 + i) % 1;
              const px = node.x + (nodeB.x - node.x) * progress;
              const py = node.y + (nodeB.y - node.y) * progress;
              ctx.beginPath();
              ctx.arc(px, py, 1.8, 0, Math.PI * 2);
              ctx.fillStyle = isDark ? '#93c5fd' : '#2563eb';
              ctx.fill();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="particle-mesh-canvas"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: theme === 'dark' ? 0.75 : 0.45
      }}
    />
  );
};
