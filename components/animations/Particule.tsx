"use client"
import React, { useEffect, useRef } from 'react'

const Particule = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    // Set canvas dimensions to match container
    const resizeCanvas = () => {
        const container = canvas.parentElement
        if (container) {
        canvas.width = container.clientWidth
        canvas.height = container.clientHeight
        }
    }
    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()
    // Particle animation
    const particles: Particle[] = []
    const particleCount = 50
    class Particle {
        x: number
        y: number
        size: number
        speedX: number
        speedY: number
        color: string
        opacity: number
        constructor() {
        this.x = canvas ? Math.random() * canvas.width : 0
        this.y = canvas ? Math.random() * canvas.height : 0
        this.size = Math.random() * 3 + 1
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.color = '#6366f1' // Indigo color
        this.opacity = Math.random() * 0.6 + 0.1
        }
        update() {
        this.x += this.speedX
        this.y += this.speedY
        // Bounce off edges
        if (canvas && (this.x > canvas.width || this.x < 0)) {
            this.speedX = -this.speedX
        }
        if (canvas && (this.y > canvas.height || this.y < 0)) {
            this.speedY = -this.speedY
        }
        }
        draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.globalAlpha = this.opacity
        ctx.fill()
        ctx.globalAlpha = 1
        }
    }
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
    }
    // Connect particles with lines
    function connect() {
        for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x
            const dy = particles[i].y - particles[j].y
            const distance = Math.sqrt(dx * dx + dy * dy)
            if (distance < 150) {
            if (!ctx) return
            ctx.beginPath()
            ctx.strokeStyle = '#6366f1'
            ctx.globalAlpha = 0.1 * (1 - distance / 150)
            ctx.lineWidth = 1
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
            ctx.globalAlpha = 1
            }
        }
        }
    }
    // Animation loop
    function animate() {
        if (!ctx || !canvas) return
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        particles.forEach((particle) => {
        particle.update()
        particle.draw()
        })
        connect()
        requestAnimationFrame(animate)
    }
    animate()
    return () => {
        window.removeEventListener('resize', resizeCanvas)
    }
    }, [])
    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
        />
    )
}

export default Particule