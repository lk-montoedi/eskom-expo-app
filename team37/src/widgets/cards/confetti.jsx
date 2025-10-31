import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

// Science-themed confetti component
function ScienceConfetti({ isActive, onComplete }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const confettiItemsRef = useRef([]);

  const frameRate = 30;
  const dt = 1.0 / frameRate;
  const DEG_TO_RAD = Math.PI / 180;

  // Science-themed colors and shapes
  const scienceColors = [
    ["#00ff41", "#00cc33"], // DNA Green
    ["#ff6b35", "#cc5429"], // Chemical Orange
    ["#4ecdc4", "#3ca39c"], // Lab Blue
    ["#ffe66d", "#ccb857"], // Atomic Yellow
    ["#a8e6cf", "#86b8a5"], // Mint Lab
    ["#ff8b94", "#cc6f76"], // Pink Lab
    ["#b4a7d6", "#9186ab"], // Purple Science
    ["#ffd93d", "#ccae31"]  // Electric Yellow
  ];

  const scienceShapes = ['⚛️', '🧬', '🔬', '⚗️', '🧪', '🔭', '🌡️', '⚡', '💊', '🦠'];

  class Vector2 {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }

    add(vec) {
      this.x += vec.x;
      this.y += vec.y;
    }

    multiply(factor) {
      this.x *= factor;
      this.y *= factor;
    }

    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
      const len = this.length();
      if (len > 0) {
        this.x /= len;
        this.y /= len;
      }
    }
  }

  class ScienceParticle {
    constructor(x, y, canvas) {
      this.pos = new Vector2(x, y);
      this.velocity = new Vector2(
        (Math.random() - 0.5) * 200,
        Math.random() * -300 - 100
      );
      this.gravity = new Vector2(0, 400);
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 600 - 300;
      this.size = Math.random() * 15 + 10;
      this.life = 1.0;
      this.decay = Math.random() * 0.02 + 0.01;
      
      // Science theming
      const colorIndex = Math.floor(Math.random() * scienceColors.length);
      this.frontColor = scienceColors[colorIndex][0];
      this.backColor = scienceColors[colorIndex][1];
      this.shape = scienceShapes[Math.floor(Math.random() * scienceShapes.length)];
      this.isEmoji = Math.random() < 0.3; // 30% chance for emoji
      
      this.canvas = canvas;
    }

    update(deltaTime) {
      // Physics
      this.velocity.add({
        x: this.gravity.x * deltaTime,
        y: this.gravity.y * deltaTime
      });
      
      this.pos.add({
        x: this.velocity.x * deltaTime,
        y: this.velocity.y * deltaTime
      });
      
      this.rotation += this.rotationSpeed * deltaTime;
      this.life -= this.decay;
      
      // Bounce off sides
      if (this.pos.x < 0 || this.pos.x > this.canvas.width) {
        this.velocity.x *= -0.8;
        this.pos.x = Math.max(0, Math.min(this.canvas.width, this.pos.x));
      }
      
      return this.life > 0 && this.pos.y < this.canvas.height + 100;
    }

    draw(context) {
      context.save();
      context.globalAlpha = Math.max(0, this.life);
      context.translate(this.pos.x, this.pos.y);
      context.rotate(this.rotation * DEG_TO_RAD);
      
      if (this.isEmoji) {
        // Draw emoji
        context.font = `${this.size}px Arial`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(this.shape, 0, 0);
      } else {
        // Draw geometric shape
        const halfSize = this.size / 2;
        const gradient = context.createRadialGradient(0, 0, 0, 0, 0, halfSize);
        gradient.addColorStop(0, this.frontColor);
        gradient.addColorStop(1, this.backColor);
        
        context.fillStyle = gradient;
        context.strokeStyle = this.frontColor;
        context.lineWidth = 2;
        
        // Draw different shapes based on science theme
        if (Math.cos(this.rotation * DEG_TO_RAD) > 0) {
          // Hexagon (like benzene ring)
          context.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const x = Math.cos(angle) * halfSize;
            const y = Math.sin(angle) * halfSize;
            if (i === 0) context.moveTo(x, y);
            else context.lineTo(x, y);
          }
          context.closePath();
        } else {
          // Diamond (like crystal structure)
          context.beginPath();
          context.moveTo(0, -halfSize);
          context.lineTo(halfSize, 0);
          context.lineTo(0, halfSize);
          context.lineTo(-halfSize, 0);
          context.closePath();
        }
        
        context.fill();
        context.stroke();
      }
      
      context.restore();
    }
  }

  class ScienceRibbon {
    constructor(x, y, canvas) {
      this.particles = [];
      const particleCount = 15;
      this.canvas = canvas;
      
      // Create ribbon particles
      for (let i = 0; i < particleCount; i++) {
        const particle = {
          pos: new Vector2(x, y - i * 10),
          velocity: new Vector2(0, 0),
          originalX: x,
          time: Math.random() * Math.PI * 2,
          oscillationSpeed: Math.random() * 3 + 2,
          oscillationDistance: Math.random() * 30 + 20
        };
        this.particles.push(particle);
      }
      
      const colorIndex = Math.floor(Math.random() * scienceColors.length);
      this.color = scienceColors[colorIndex][0];
      this.thickness = Math.random() * 8 + 4;
      this.ySpeed = Math.random() * 50 + 30;
    }

    update(deltaTime) {
      // Update lead particle
      this.particles[0].pos.y += this.ySpeed * deltaTime;
      this.particles[0].time += deltaTime * this.particles[0].oscillationSpeed;
      this.particles[0].pos.x = this.particles[0].originalX + 
        Math.sin(this.particles[0].time) * this.particles[0].oscillationDistance;
      
      // Follow the leader
      for (let i = 1; i < this.particles.length; i++) {
        const leader = this.particles[i - 1];
        const follower = this.particles[i];
        
        const dx = leader.pos.x - follower.pos.x;
        const dy = leader.pos.y - follower.pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
          const targetDistance = 10;
          const force = (distance - targetDistance) * 0.5;
          
          follower.velocity.x += (dx / distance) * force * deltaTime * 60;
          follower.velocity.y += (dy / distance) * force * deltaTime * 60;
        }
        
        follower.velocity.multiply(0.95); // Damping
        follower.pos.add({
          x: follower.velocity.x * deltaTime,
          y: follower.velocity.y * deltaTime
        });
      }
      
      return this.particles[0].pos.y < this.canvas.height + 100;
    }

    draw(context) {
      context.strokeStyle = this.color;
      context.lineWidth = this.thickness;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      
      context.beginPath();
      context.moveTo(this.particles[0].pos.x, this.particles[0].pos.y);
      
      for (let i = 1; i < this.particles.length; i++) {
        context.lineTo(this.particles[i].pos.x, this.particles[i].pos.y);
      }
      
      context.stroke();
    }
  }

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create science confetti
    const particles = [];
    const ribbons = [];

    // Add particles
    for (let i = 0; i < 40; i++) {
      particles.push(new ScienceParticle(
        Math.random() * canvas.width,
        -Math.random() * 200,
        canvas
      ));
    }

    // Add ribbons
    for (let i = 0; i < 8; i++) {
      ribbons.push(new ScienceRibbon(
        Math.random() * canvas.width,
        -Math.random() * 100,
        canvas
      ));
    }

    confettiItemsRef.current = [...particles, ...ribbons];

    let lastTime = 0;
    const animate = (currentTime) => {
      const deltaTime = Math.min((currentTime - lastTime) / 1000, 1/30);
      lastTime = currentTime;

      context.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw all items
      confettiItemsRef.current = confettiItemsRef.current.filter(item => {
        const alive = item.update(deltaTime);
        if (alive) item.draw(context);
        return alive;
      });

      if (confettiItemsRef.current.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        onComplete && onComplete();
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    // Auto-complete after 4 seconds
    const timeout = setTimeout(() => {
      onComplete && onComplete();
    }, 4000);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      clearTimeout(timeout);
    };
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 9999,
      background: 'rgba(0, 0, 0, 0.1)'
    }}>
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
}

export default ScienceConfetti;