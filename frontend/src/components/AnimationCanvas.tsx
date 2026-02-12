import { useEffect, useRef } from 'react'
import { GraphDataPoint, SimulationParameters } from '../types/types'
import { SimulationType } from '../utils/physicsEngine'

interface AnimationCanvasProps {
    graphData: GraphDataPoint[]
    isPlaying: boolean
    onPlayPauseToggle: () => void
    currentTime: number
    onTimeUpdate: (time: number) => void
    parameters: SimulationParameters
    simulationType: SimulationType
}

export default function AnimationCanvas({
    graphData,
    isPlaying,
    onPlayPauseToggle,
    currentTime,
    onTimeUpdate,
    parameters,
    simulationType,
}: AnimationCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number>()

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

        // Find current data point
        const currentData = graphData.find(d => d.time >= currentTime) || graphData[0]

        // Draw based on explicit simulation type
        switch (simulationType) {
            case 'pendulum':
                drawPendulumScene(ctx, width, height, graphData, currentData, parameters)
                break
            case 'incline-friction':
                drawInclineScene(ctx, width, height, graphData, currentData, parameters)
                break
            case 'friction-horizontal':
                drawFrictionHorizontalScene(ctx, width, height, graphData, currentData, parameters)
                break
            case 'incline-pulley':
                drawPulleyScene(ctx, width, height, graphData, currentData, parameters)
                break
            case 'block-on-block':
                drawBlockOnBlockScene(ctx, width, height, graphData, currentData, parameters)
                break
            case 'conical-pendulum':
                drawConicalPendulumScene(ctx, width, height, graphData, currentData, parameters)
                break
            default:
                // Projectile, free fall, vertical projectile, uniform acceleration
                drawProjectileScene(ctx, width, height, graphData, currentData, parameters)
                break
        }

        // Time display
        ctx.fillStyle = '#1e293b'
        ctx.font = 'bold 16px monospace'
        ctx.fillText(`Time: ${currentData.time.toFixed(2)}s`, 10, 25)

    }, [graphData, currentTime, simulationType, parameters])

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

// ==================== SCENE RENDERERS ====================

function drawProjectileScene(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    graphData: GraphDataPoint[],
    currentData: GraphDataPoint,
    _parameters: SimulationParameters
) {
    const originX = 100
    const originY = height - 50

    // Dynamic scaling for Free Fall / High Projectiles
    const maxY = Math.max(...graphData.map(d => d.positionY), 10)
    const availableHeight = height - 100
    const scale = Math.min(20, availableHeight / (maxY * 1.1))

    // Draw ground
    ctx.strokeStyle = '#64748b'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, originY)
    ctx.lineTo(width, originY)
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

    // Draw projectile
    const x = originX + currentData.positionX * scale
    const y = originY - currentData.positionY * scale

    ctx.fillStyle = '#f59e0b'
    ctx.beginPath()
    ctx.arc(x, y, 12, 0, 2 * Math.PI)
    ctx.fill()
    ctx.strokeStyle = '#d97706'
    ctx.lineWidth = 2
    ctx.stroke()

    // Velocity vector
    const vScale = 5
    ctx.strokeStyle = '#10b981'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + currentData.velocityX * vScale, y - currentData.velocityY * vScale)
    ctx.stroke()

    // Arrowhead
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

function drawInclineScene(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    graphData: GraphDataPoint[],
    currentData: GraphDataPoint,
    parameters: SimulationParameters
) {
    const originX = 100
    const originY = height - 100
    const scale = 40

    const angleRad = ((parameters.inclineAngle || 30) * Math.PI) / 180
    const inclineLength = 300

    // Draw ground
    ctx.fillStyle = '#cbd5e1'
    ctx.fillRect(0, originY, width, height - originY)

    // Draw incline (ramp)
    ctx.fillStyle = '#94a3b8'
    ctx.beginPath()
    ctx.moveTo(originX, originY)
    ctx.lineTo(originX + inclineLength * Math.cos(angleRad), originY - inclineLength * Math.sin(angleRad))
    ctx.lineTo(originX + inclineLength * Math.cos(angleRad), originY)
    ctx.closePath()
    ctx.fill()

    // Incline outline
    ctx.strokeStyle = '#64748b'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(originX, originY)
    ctx.lineTo(originX + inclineLength * Math.cos(angleRad), originY - inclineLength * Math.sin(angleRad))
    ctx.stroke()

    // Draw trajectory on incline
    ctx.strokeStyle = '#60a5fa'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    graphData.forEach((point, i) => {
        const x = originX + point.positionX * scale
        const y = originY - point.positionY * scale
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
    })
    ctx.stroke()
    ctx.setLineDash([])

    // Draw block
    const x = originX + currentData.positionX * scale
    const y = originY - currentData.positionY * scale

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(-angleRad) // Rotate block to match incline

    ctx.fillStyle = '#3b82f6'
    ctx.fillRect(-20, -20, 40, 40)
    ctx.strokeStyle = '#1d4ed8'
    ctx.lineWidth = 3
    ctx.strokeRect(-20, -20, 40, 40)

    // Label
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 14px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('m', 0, 5)

    ctx.restore()
}

function drawFrictionHorizontalScene(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    graphData: GraphDataPoint[],
    currentData: GraphDataPoint,
    parameters: SimulationParameters
) {
    const originX = 100
    const originY = height / 2
    const scale = 50

    // Draw ground
    ctx.fillStyle = '#cbd5e1'
    ctx.fillRect(0, originY + 20, width, height - originY - 20)

    // Draw surface line
    ctx.strokeStyle = '#64748b'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(0, originY + 20)
    ctx.lineTo(width, originY + 20)
    ctx.stroke()

    // Draw trajectory line
    ctx.strokeStyle = '#60a5fa'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(originX, originY)
    ctx.lineTo(originX + graphData[graphData.length - 1].positionX * scale, originY)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw box
    const x = originX + currentData.positionX * scale
    const y = originY

    ctx.fillStyle = '#10b981'
    ctx.fillRect(x - 25, y - 25, 50, 50)
    ctx.strokeStyle = '#059669'
    ctx.lineWidth = 3
    ctx.strokeRect(x - 25, y - 25, 50, 50)

    // Label
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 16px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('m', x, y + 5)

    // Applied force arrow
    const appliedForce = parameters.appliedForce ?? 15
    if (Math.abs(appliedForce) > 0) {
        const direction = Math.sign(appliedForce)
        const arrowLength = 40
        const startX = x + (direction * 25) // Start from edge of box
        const endX = startX + (direction * arrowLength)

        ctx.strokeStyle = '#ef4444'
        ctx.fillStyle = '#ef4444'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(startX, y)
        ctx.lineTo(endX, y)
        ctx.stroke()

        // Arrowhead
        ctx.beginPath()
        ctx.moveTo(endX, y)
        ctx.lineTo(endX - (direction * 10), y - 6)
        ctx.lineTo(endX - (direction * 10), y + 6)
        ctx.closePath()
        ctx.fill()

        // Label
        ctx.fillStyle = '#1e293b'
        ctx.font = '12px sans-serif'
        ctx.fillText('F', endX + (direction * 10), y - 10)
    }
}

function drawPendulumScene(
    ctx: CanvasRenderingContext2D,
    width: number,
    _height: number,
    graphData: GraphDataPoint[],
    currentData: GraphDataPoint,
    _parameters: SimulationParameters
) {
    const originX = width / 2
    const originY = 80
    const scale = 150

    // Draw ceiling
    ctx.fillStyle = '#64748b'
    ctx.fillRect(0, 0, width, 20)

    // Draw ceiling attachment
    ctx.fillStyle = '#475569'
    ctx.fillRect(originX - 10, 20, 20, 60)

    // Draw trajectory arc
    ctx.strokeStyle = '#60a5fa'
    ctx.lineWidth = 2
    ctx.setLineDash([3, 3])
    ctx.beginPath()
    graphData.forEach((point, i) => {
        const x = originX + point.positionX * scale
        const y = originY - point.positionY * scale
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
    })
    ctx.stroke()
    ctx.setLineDash([])

    // Current position
    const x = originX + currentData.positionX * scale
    const y = originY - currentData.positionY * scale

    // Draw string
    ctx.strokeStyle = '#475569'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(originX, originY)
    ctx.lineTo(x, y)
    ctx.stroke()

    // Draw pivot point
    ctx.fillStyle = '#64748b'
    ctx.beginPath()
    ctx.arc(originX, originY, 6, 0, 2 * Math.PI)
    ctx.fill()

    // Draw bob
    ctx.fillStyle = '#8b5cf6'
    ctx.beginPath()
    ctx.arc(x, y, 16, 0, 2 * Math.PI)
    ctx.fill()
    ctx.strokeStyle = '#6d28d9'
    ctx.lineWidth = 3
    ctx.stroke()

    // Label
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 14px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('m', x, y + 5)
}

function drawPulleyScene(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    _graphData: GraphDataPoint[],
    currentData: GraphDataPoint,
    parameters: SimulationParameters
) {
    const originX = 100
    const originY = height - 100
    const scale = 40

    const angleRad = ((parameters.inclineAngle || 30) * Math.PI) / 180
    const inclineLength = 300

    // 1. Draw Ground & Incline
    ctx.fillStyle = '#cbd5e1'
    ctx.fillRect(0, originY, width, height - originY)

    ctx.fillStyle = '#94a3b8'
    ctx.beginPath()
    ctx.moveTo(originX, originY)
    ctx.lineTo(originX + inclineLength * Math.cos(angleRad), originY - inclineLength * Math.sin(angleRad))
    ctx.lineTo(originX + inclineLength * Math.cos(angleRad), originY)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = '#64748b'
    ctx.lineWidth = 3
    ctx.stroke()

    // 2. Calculate Positions
    const rampTipX = originX + inclineLength * Math.cos(angleRad)
    const rampTipY = originY - inclineLength * Math.sin(angleRad)

    const pulleyExtension = 40
    const pulleyX = originX + (inclineLength + pulleyExtension) * Math.cos(angleRad)
    const pulleyY = originY - (inclineLength + pulleyExtension) * Math.sin(angleRad)

    const x1 = originX + currentData.positionX * scale
    const y1 = originY - currentData.positionY * scale

    const m2Y = pulleyY + (currentData.positionX * scale)

    // 3. Draw Bracket (Structural Support) - Back Layer
    ctx.strokeStyle = '#475569'
    ctx.lineWidth = 14
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(rampTipX, rampTipY)
    ctx.lineTo(pulleyX, pulleyY)
    ctx.stroke()
    ctx.lineCap = 'butt' // Reset

    // 4. Draw Strings (Middle Layer)
    ctx.strokeStyle = '#334155'
    ctx.lineWidth = 2
    ctx.beginPath()
    // String 1: Block to Pulley
    ctx.moveTo(x1, y1)
    ctx.lineTo(pulleyX, pulleyY)
    // String 2: Pulley to Hanging Mass
    ctx.moveTo(pulleyX, pulleyY)
    ctx.lineTo(pulleyX, m2Y)
    ctx.stroke()

    // 5. Draw Block m1 (Corrected Offset)
    ctx.save()
    ctx.translate(x1, y1)
    ctx.rotate(-angleRad)
    // Draw "sitting on" the line (shift Y by -height)
    ctx.fillStyle = '#3b82f6'
    ctx.fillRect(-20, -40, 40, 40)
    ctx.strokeStyle = '#1d4ed8'
    ctx.lineWidth = 3
    ctx.strokeRect(-20, -40, 40, 40)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 12px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('m₁', 0, -15)
    ctx.restore()

    // 6. Draw Pulley Wheel (Front Layer)
    ctx.fillStyle = '#fbbf24'
    ctx.beginPath()
    ctx.arc(pulleyX, pulleyY, 15, 0, 2 * Math.PI)
    ctx.fill()
    ctx.strokeStyle = '#d97706'
    ctx.lineWidth = 2
    ctx.stroke()

    // 7. Draw Axle
    ctx.fillStyle = '#713f12'
    ctx.beginPath()
    ctx.arc(pulleyX, pulleyY, 4, 0, 2 * Math.PI)
    ctx.fill()

    // 8. Draw Hanging Mass m2
    ctx.fillStyle = '#ef4444'
    ctx.fillRect(pulleyX - 20, m2Y - 20, 40, 40)
    ctx.strokeStyle = '#dc2626'
    ctx.lineWidth = 3
    ctx.strokeRect(pulleyX - 20, m2Y - 20, 40, 40)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 12px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('m₂', pulleyX, m2Y + 5)
}

function drawConicalPendulumScene(
    ctx: CanvasRenderingContext2D,
    width: number,
    _height: number,
    _graphData: GraphDataPoint[],
    currentData: GraphDataPoint,
    _parameters: SimulationParameters
) {
    const originX = width / 2
    const originY = 80
    const scale = 150

    // Draw ceiling
    ctx.fillStyle = '#64748b'
    ctx.fillRect(0, 0, width, 20)

    // Draw ceiling attachment
    ctx.fillStyle = '#475569'
    ctx.fillRect(originX - 10, 20, 20, 60)

    // Draw circular path
    const radius = Math.sqrt(currentData.positionX ** 2 + (currentData.positionY - originY / scale) ** 2) * scale
    ctx.strokeStyle = '#60a5fa'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.arc(originX, originY - currentData.positionY * scale, radius, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.setLineDash([])

    // Current position
    const x = originX + currentData.positionX * scale
    const y = originY - currentData.positionY * scale

    // Draw string
    ctx.strokeStyle = '#475569'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(originX, originY)
    ctx.lineTo(x, y)
    ctx.stroke()

    // Draw pivot
    ctx.fillStyle = '#64748b'
    ctx.beginPath()
    ctx.arc(originX, originY, 6, 0, 2 * Math.PI)
    ctx.fill()

    // Draw bob
    ctx.fillStyle = '#8b5cf6'
    ctx.beginPath()
    ctx.arc(x, y, 16, 0, 2 * Math.PI)
    ctx.fill()
    ctx.strokeStyle = '#6d28d9'
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.stroke()
}

function drawBlockOnBlockScene(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    _graphData: GraphDataPoint[],
    currentData: GraphDataPoint,
    parameters: SimulationParameters
) {
    const originX = width / 2 - 200
    const originY = height - 100
    const scale = 50

    // Ground
    ctx.fillStyle = '#cbd5e1'
    ctx.fillRect(0, originY, width, height - originY)

    ctx.strokeStyle = '#64748b'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, originY)
    ctx.lineTo(width, originY)
    ctx.stroke()

    // Bottom Block (m2)
    const x2 = originX + currentData.positionX * scale
    const m2Width = 120
    const m2Height = 60

    ctx.fillStyle = '#10b981'
    ctx.fillRect(x2 - m2Width / 2, originY - m2Height, m2Width, m2Height)
    ctx.strokeStyle = '#059669'
    ctx.lineWidth = 3
    ctx.strokeRect(x2 - m2Width / 2, originY - m2Height, m2Width, m2Height)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 16px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('m₂', x2, originY - m2Height / 2 + 5)

    // Top Block (m1)
    // In physics engine, positionY stores (x1 - x2) = relative position
    const relX = currentData.positionY
    const x1 = x2 + relX * scale
    const m1Width = 70
    const m1Height = 40
    const y1 = originY - m2Height // Sitting on m2

    ctx.fillStyle = '#3b82f6'
    ctx.fillRect(x1 - m1Width / 2, y1 - m1Height, m1Width, m1Height)
    ctx.strokeStyle = '#1d4ed8'
    ctx.lineWidth = 3
    ctx.strokeRect(x1 - m1Width / 2, y1 - m1Height, m1Width, m1Height)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 14px sans-serif'
    ctx.fillText('m₁', x1, y1 - m1Height / 2 + 5)

    // Applied Force Arrow (on m2)
    const force = parameters.appliedForce || 0
    if (Math.abs(force) > 0) {
        const arrowY = originY - m2Height / 2
        const direction = Math.sign(force)
        const startX = x2 + (direction * (m2Width / 2))
        const endX = startX + (direction * 50)

        ctx.strokeStyle = '#ef4444'
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.moveTo(startX, arrowY)
        ctx.lineTo(endX, arrowY)
        ctx.stroke()

        // Arrowhead
        ctx.fillStyle = '#ef4444'
        ctx.beginPath()
        ctx.moveTo(endX, arrowY)
        ctx.lineTo(endX - direction * 10, arrowY - 6)
        ctx.lineTo(endX - direction * 10, arrowY + 6)
        ctx.fill()

        ctx.fillStyle = '#be123c'
        ctx.fillText('F', endX + direction * 15, arrowY + 5)
    }
}
