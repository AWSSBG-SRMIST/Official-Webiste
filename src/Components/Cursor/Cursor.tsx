'use client'

import { useEffect, useRef } from 'react'
import './Cursor.css'

export default function Cursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: -200, y: -200 })
  const lag = useRef({ x: -200, y: -200 })
  const velocity = useRef({ x: 0, y: 0 })
  const prevMouse = useRef({ x: -200, y: -200 })
  const rafRef = useRef<number>(0)
  const scanY = useRef(0)

  useEffect(() => {
    document.body.style.cursor = 'none'

    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e: MouseEvent) => {
      velocity.current.x = e.clientX - prevMouse.current.x
      velocity.current.y = e.clientY - prevMouse.current.y
      prevMouse.current = { x: e.clientX, y: e.clientY }
      mouse.current = { x: e.clientX, y: e.clientY }
    }
    document.addEventListener('mousemove', onMove)

    const draw = () => {
      // Lag factor — brackets trail behind
      lag.current.x += (mouse.current.x - lag.current.x) * 0.09
      lag.current.y += (mouse.current.y - lag.current.y) * 0.09

      // Velocity magnitude for stretch effect
      const speed = Math.sqrt(velocity.current.x ** 2 + velocity.current.y ** 2)
      const stretch = Math.min(speed * 0.4, 10)
      velocity.current.x *= 0.8
      velocity.current.y *= 0.8

      // Scan line oscillation
      scanY.current += 0.04
      const scanOffset = Math.sin(scanY.current) * 10

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const mx = mouse.current.x
      const my = mouse.current.y
      const lx = lag.current.x
      const ly = lag.current.y
      const size = 16 + stretch
      const arm = 7  // length of each bracket arm

      // --- Spotlight glow ---
      const glow = ctx.createRadialGradient(mx, my, 0, mx, my, 180)
      glow.addColorStop(0, 'rgba(184, 54, 254, 0.08)')
      glow.addColorStop(1, 'transparent')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // --- Bracket corners (lagged, purple) ---
      ctx.save()
      ctx.strokeStyle = 'rgba(184, 54, 254, 0.9)'
      ctx.lineWidth = 1.5
      ctx.lineCap = 'square'
      ctx.shadowColor = '#B836FE'
      ctx.shadowBlur = 6
      ctx.beginPath()
      // top-left
      ctx.moveTo(lx - size, ly - size + arm)
      ctx.lineTo(lx - size, ly - size)
      ctx.lineTo(lx - size + arm, ly - size)
      // top-right
      ctx.moveTo(lx + size - arm, ly - size)
      ctx.lineTo(lx + size, ly - size)
      ctx.lineTo(lx + size, ly - size + arm)
      // bottom-right
      ctx.moveTo(lx + size, ly + size - arm)
      ctx.lineTo(lx + size, ly + size)
      ctx.lineTo(lx + size - arm, ly + size)
      // bottom-left
      ctx.moveTo(lx - size + arm, ly + size)
      ctx.lineTo(lx - size, ly + size)
      ctx.lineTo(lx - size, ly + size - arm)
      ctx.stroke()
      ctx.restore()

      // --- Scan line inside brackets (oscillates up/down) ---
      ctx.save()
      ctx.strokeStyle = 'rgba(184, 54, 254, 0.25)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(lx - size + 2, ly + scanOffset)
      ctx.lineTo(lx + size - 2, ly + scanOffset)
      ctx.stroke()
      ctx.restore()

      // --- Center dot (direct, no lag — AWS orange) ---
      ctx.save()
      ctx.fillStyle = '#FF9900'
      ctx.shadowColor = '#FF9900'
      ctx.shadowBlur = 8
      ctx.beginPath()
      ctx.arc(mx, my, 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      document.body.style.cursor = ''
      document.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return <canvas ref={canvasRef} className="cursor-canvas" />
}
