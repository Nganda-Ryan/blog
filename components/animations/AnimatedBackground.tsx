"use client"

import React, { useEffect, useRef } from 'react'
import { useTheme } from "next-themes";

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    let animationFrameId: number
    let mouseX = 0
    let mouseY = 0
    const particles: Particle[] = []
    const particleCount = 50
    
    // Conserver les connexions originales
    const connections: [number, number][] = []
    
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      originalX: number
      originalY: number
      
      constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.size = Math.random() * 2 + 1
        this.speedX = 0
        this.speedY = 0
        this.originalX = x
        this.originalY = y
      }
      
      update(mouseX: number, mouseY: number) {
        // Calculate distance from mouse
        const dx = mouseX - this.x
        const dy = mouseY - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        // Mouse repulsion effect - inchangé
        if (distance < 100) {
          const force = (100 - distance) / 100
          this.speedX -= (dx / distance) * force * 0.5
          this.speedY -= (dy / distance) * force * 0.5
        }
        
        // Return to original position - inchangé
        const homeX = this.originalX - this.x
        const homeY = this.originalY - this.y
        this.speedX += homeX * 0.05
        this.speedY += homeY * 0.05
        
        // Apply friction - inchangé
        this.speedX *= 0.9
        this.speedY *= 0.9
        
        // Update position
        this.x += this.speedX
        this.y += this.speedY
      }
      
      draw(ctx: CanvasRenderingContext2D) {
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size,
        )
        const color = theme === 'dark' ? '147, 197, 253' : '37, 99, 235'
        gradient.addColorStop(0, `rgba(${color}, 0.3)`)
        gradient.addColorStop(1, `rgba(${color}, 0)`)
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    
    const init = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      
      // Create particles in a grid pattern
      const gridSize = Math.sqrt(particleCount)
      const spacing = Math.min(canvas.width, canvas.height) / gridSize
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const x = spacing * i + (canvas.width - spacing * gridSize) / 2
          const y = spacing * j + (canvas.height - spacing * gridSize) / 2
          particles.push(new Particle(x, y))
        }
      }
      
      // Déterminer les connexions initiales
      connections.length = 0
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].originalX - particles[j].originalX
          const dy = particles[i].originalY - particles[j].originalY
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 150) {
            connections.push([i, j])
          }
        }
      }
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach((particle) => {
        particle.update(mouseX, mouseY)
        particle.draw(ctx)
      })
      
      // Dessiner les connexions originales au lieu de recalculer les distances
      ctx.strokeStyle =
        theme === 'dark' ? 'rgba(147, 197, 253, 0.1)' : 'rgba(37, 99, 235, 0.1)'
      ctx.lineWidth = 1
      
      connections.forEach(([i, j]) => {
        ctx.beginPath()
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.stroke()
      })
      
      animationFrameId = requestAnimationFrame(animate)
    }
    
    const handleResize = () => {
      particles.length = 0
      init()
    }
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
    }
    
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    
    init()
    animate()
    
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [theme])
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{
        opacity: 0.6,
      }}
    />
  )
}