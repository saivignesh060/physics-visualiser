import { useEffect, useRef, useState } from 'react'
import { GraphDataPoint, SimulationParameters } from '../types/types'

interface AnimationCanvasProps {
    graphData: GraphDataPoint[]
    isPlaying: boolean
    onPlayPauseToggle: () => void
    currentTime: number
    onTimeUpdate: (time: number) => void
    parameters: SimulationParameters
}

export default function AnimationCanvas({
    graphData,
    isPlaying,
    onPlayPauseToggle,
    currentTime,
    onTimeUpdate,
    parameters,
}: AnimationCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number>()
    const [scale, setScale] = useState(20)

    // Auto-play on data load
    useEffect(() => {
        if (graphData.length > 0 && currentTime === 0) {
            onPlayPauseToggle()
        }
    }, [graphData])

    // Animation loop
    useEffect(() => {
        if (!isPlaying || graphData.length === 0) return

        const animate = () => {
            const newTime = currentTime + 0.02
            if (newTime >= graphData[graphData.length - 1]?.time || 0) {
                onTimeUpdate(0)
            } else {
                onTimeUpdate(newTime)
            }
            animationRef.current = requestAnimationFrame(animate)
        }

        animationRef.current = requestAnimationFrame(animate)
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current)
        }
    }, [isPlaying, currentTime, graphData, onTimeUpdate])

    // Draw canvas
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas || graphData.length === 0) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const width = canvas.width
        const height = canvas.height

        // Clear canvas
        ctx.clearRect(0, 0, width, height)
        ctx.fillStyle = '#e0f2fe'
        ctx.fillRect(0, 0, width, height)

        // Determine what to draw based on data pattern
        const isDynamics = graphData.every(d => d.positionY >= 0 && d.accelerationY < 0 && Math.abs(d.accelerationY) < 5)
        const isSpring = graphData.every(d => d.positionY === 0 && Math.abs(d.positionX) < 1)
        const isPendulum = graphData.some(d => d.positionY < 0)

        // Find current data point
        const currentData = graphData.find(d => d.time >= currentTime) || graphData[0]

        // Set origin and scale
        let originX = width / 2
        let originY = height - 50

        if (isPendulum) {
            // Pendulum: origin at top center
            originX = width / 2
            originY = 100
            setScale(150) // Larger scale for pendulum
        } else if (isSpring) {
            // Spring: origin at center
            originX = width / 2
            originY = height / 2
            setScale(200) // Large scale for spring oscillation
        } else if (isDynamics) {
            // Incline: origin at bottom left
            originX = 100
            originY = height - 100
            setScale(30)
        } else {
            // Kinematics: origin at bottom left
            originX = 100
            originY = height - 50
            setScale(20)
        }

        // Draw axes
        ctx.strokeStyle = '#94a3b8'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(0, originY)
        ctx.lineTo(width, originY)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(originX, 0)
        ctx.lineTo(originX, height)
        ctx.stroke()

        // Draw trajectory
        ctx.strokeStyle = '#60a5fa'
        ctx.lineWidth = 2
        ctx.beginPath()
        graphData.forEach((point, i) => {
            const x = originX + point.positionX * scale
            const y = originY - point.positionY * scale
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
        })
        ctx.stroke()

        // Draw object based on type
        const x = originX + currentData.positionX * scale
        const y = originY - currentData.positionY * scale

        if (isPendulum) {
            // Draw pendulum
            const pivotX = originX
            const pivotY = originY

            // Pivot point
            ctx.fillStyle = '#64748b'
            ctx.beginPath()
            ctx.arc(pivotX, pivotY, 5, 0, 2 * Math.PI)
            ctx.fill()

            // String
            ctx.strokeStyle = '#475569'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(pivotX, pivotY)
            ctx.lineTo(x, y)
            ctx.stroke()

            // Bob
            ctx.fillStyle = '#8b5cf6'
            ctx.beginPath()
            ctx.arc(x, y, 12, 0, 2 * Math.PI)
            ctx.fill()
            ctx.strokeStyle = '#6d28d9'
            ctx.lineWidth = 2
            ctx.stroke()
        } else if (isSpring) {
            // Draw spring
            const springY = originY
            const springLeft = originX - 100
            const massX = x

            // Fixed wall
            ctx.strokeStyle = '#64748b'
            ctx.lineWidth = 3
            ctx.beginPath()
            ctx.moveTo(springLeft - 10, springY - 30)
            ctx.lineTo(springLeft - 10, springY + 30)
            ctx.stroke()

            // Spring coils
            ctx.strokeStyle = '#10b981'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(springLeft, springY)
            const coils = 10
            const springWidth = massX - springLeft - 20
            for (let i = 0; i <= coils; i++) {
                const coilX = springLeft + (springWidth / coils) * i
                const coilY = springY + (i % 2 === 0 ? -10 : 10)
                ctx.lineTo(coilX, coilY)
            }
            ctx.lineTo(massX - 20, springY)
            ctx.stroke()

            // Mass block
            ctx.fillStyle = '#10b981'
            ctx.fillRect(massX - 20, springY - 15, 40, 30)
            ctx.strokeStyle = '#059669'
            ctx.lineWidth = 2
            ctx.strokeRect(massX - 20, springY - 15, 40, 30)
        } else if (isDynamics) {
            // Draw incline
            const angle = (parameters.angle || 30) * Math.PI / 180
            const inclineLength = 300

            ctx.strokeStyle = '#94a3b8'
            ctx.lineWidth = 3
            ctx.beginPath()
            ctx.moveTo(originX, originY)
            ctx.lineTo(originX + inclineLength * Math.cos(angle), originY - inclineLength * Math.sin(angle))
            ctx.stroke()

            // Block on incline
            ctx.fillStyle = '#3b82f6'
            ctx.fillRect(x - 15, y - 15, 30, 30)
            ctx.strokeStyle = '#1d4ed8'
            ctx.lineWidth = 2
            ctx.strokeRect(x - 15, y - 15, 30, 30)
        } else {
            // Projectile kinematics
            ctx.fillStyle = '#f59e0b'
            ctx.beginPath()
            ctx.arc(x, y, 10, 0, 2 * Math.PI)
            ctx.fill()

            // Velocity vector
            const vScale = 5
            ctx.strokeStyle = '#10b981'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.lineTo(x + currentData.velocityX * vScale, y - currentData.velocityY * vScale)
            ctx.stroke()

            // Draw arrowhead
            const vx = currentData.velocityX * vScale
            const vy = -currentData.velocityY * vScale
            const angle = Math.atan2(vy, vx)
            ctx.beginPath()
            ctx.moveTo(x + vx, y + vy)
            ctx.lineTo(x + vx - 10 * Math.cos(angle - Math.PI / 6), y + vy - 10 * Math.sin(angle - Math.PI / 6))
            ctx.moveTo(x + vx, y + vy)
            ctx.lineTo(x + vx - 10 * Math.cos(angle + Math.PI / 6), y + vy - 10 * Math.sin(angle + Math.PI / 6))
            ctx.stroke()
        }

        // Time display
        ctx.fillStyle = '#1e293b'
        ctx.font = '14px monospace'
        ctx.fillText(`Time: ${currentData.time.toFixed(2)}s`, 10, 20)

    }, [graphData, currentTime, scale, parameters])

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Animation</h3>
                <button
                    onClick={onPlayPauseToggle}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                    {isPlaying ? '⏸ Pause' : '▶ Play'}
                </button>
            </div>
            <canvas
                ref={canvasRef}
                width={800}
                height={400}
                className="w-full border-2 border-gray-300 rounded-lg bg-sky-50"
            />
        </div>
    )
}
