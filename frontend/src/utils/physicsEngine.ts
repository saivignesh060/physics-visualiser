// Multi-domain physics engine
import { GraphDataPoint, SimulationParameters, PhysicsProblem } from '../types/types'

export function generateSimulationData(
    problem: PhysicsProblem,
    params: SimulationParameters
): GraphDataPoint[] {
    const domain = problem.domain[0]
    const objectType = problem.objects[0]?.type

    // Check if it's a pendulum simulation
    if (objectType === 'pendulum') {
        return generatePendulumData(problem, params)
    }

    switch (domain) {
        case 'dynamics':
            return generateDynamicsData(problem, params)
        case 'energy':
            return generateEnergyData(problem, params)
        case 'waves':
            return generateWavesData(problem, params)
        default:
            return generateKinematicsData(problem, params)
    }
}

function generateKinematicsData(
    problem: PhysicsProblem,
    params: SimulationParameters
): GraphDataPoint[] {
    const data: GraphDataPoint[] = []
    const g = params.gravity
    const dt = 0.02

    const vx = params.initialVelocity * Math.cos((params.angle * Math.PI) / 180)
    const vy = params.initialVelocity * Math.sin((params.angle * Math.PI) / 180)

    const timeOfFlight = (2 * vy) / g
    const steps = Math.ceil(timeOfFlight / dt)

    for (let i = 0; i <= steps; i++) {
        const t = i * dt
        const x = vx * t
        const y = vy * t - 0.5 * g * t * t

        if (y < 0 && i > 0) break

        const velocityXCurrent = vx
        const velocityYCurrent = vy - g * t
        const speed = Math.sqrt(velocityXCurrent ** 2 + velocityYCurrent ** 2)

        const ke = 0.5 * params.mass * speed ** 2
        const pe = params.mass * g * y

        data.push({
            time: t,
            positionX: x,
            positionY: y,
            velocityX: velocityXCurrent,
            velocityY: velocityYCurrent,
            accelerationX: 0,
            accelerationY: -g,
            kineticEnergy: ke,
            potentialEnergy: pe,
            totalEnergy: ke + pe,
        })
    }

    return data
}

function generateDynamicsData(
    problem: PhysicsProblem,
    params: SimulationParameters
): GraphDataPoint[] {
    const data: GraphDataPoint[] = []

    // Check if it's a friction horizontal simulation (has tension parameter)
    if (params.tension !== undefined) {
        return generateFrictionHorizontalData(problem, params)
    }

    // Otherwise, it's an inclined plane simulation
    const inclineAngle = params.inclineAngle || 30
    const angleRad = (inclineAngle * Math.PI) / 180
    const mu = params.frictionCoefficient || 0.3
    const g = params.gravity || 9.8
    const mass = params.mass || 1

    const normalForce = mass * g * Math.cos(angleRad)
    const frictionForce = mu * normalForce
    const gravityComponent = mass * g * Math.sin(angleRad)
    const netForce = gravityComponent - frictionForce
    const acceleration = netForce / mass

    const dt = 0.02
    const maxTime = 5
    const steps = Math.ceil(maxTime / dt)

    for (let i = 0; i <= steps; i++) {
        const t = i * dt
        const distance = 0.5 * acceleration * t * t
        const velocity = acceleration * t

        const x = distance * Math.cos(angleRad)
        const y = distance * Math.sin(angleRad)
        const vx = velocity * Math.cos(angleRad)
        const vy = velocity * Math.sin(angleRad)

        const speed = Math.abs(velocity)
        const ke = 0.5 * mass * speed ** 2
        const pe = mass * g * y

        data.push({
            time: t,
            positionX: x,
            positionY: y,
            velocityX: vx,
            velocityY: vy,
            accelerationX: acceleration * Math.cos(angleRad),
            accelerationY: acceleration * Math.sin(angleRad),
            kineticEnergy: ke,
            potentialEnergy: pe,
            totalEnergy: ke + pe,
        })

        if (acceleration <= 0 && i > 0) break
    }

    return data
}

function generateFrictionHorizontalData(
    problem: PhysicsProblem,
    params: SimulationParameters
): GraphDataPoint[] {
    const data: GraphDataPoint[] = []

    const mass = params.mass || 2.5
    const tension = params.tension || 35
    const theta = ((params.theta || 30) * Math.PI) / 180
    const muStatic = params.staticFriction || 0.5
    const muKinetic = params.kineticFriction || 0.4
    const g = params.gravity || 9.8

    // Force components
    const tensionX = tension * Math.cos(theta)
    const tensionY = tension * Math.sin(theta)

    // Normal force (reduced by vertical component of tension)
    const normalForce = mass * g - tensionY

    // Static friction threshold
    const maxStaticFriction = muStatic * normalForce

    // Check if object moves
    const isMoving = tensionX > maxStaticFriction

    let acceleration = 0
    if (isMoving) {
        const kineticFriction = muKinetic * normalForce
        const netForce = tensionX - kineticFriction
        acceleration = netForce / mass
    }

    const dt = 0.02
    const maxTime = 5
    const steps = Math.ceil(maxTime / dt)

    for (let i = 0; i <= steps; i++) {
        const t = i * dt

        let x, vx
        if (isMoving) {
            x = 0.5 * acceleration * t * t
            vx = acceleration * t
        } else {
            x = 0
            vx = 0
        }

        const speed = Math.abs(vx)
        const ke = 0.5 * mass * speed ** 2

        data.push({
            time: t,
            positionX: x,
            positionY: 0,
            velocityX: vx,
            velocityY: 0,
            accelerationX: acceleration,
            accelerationY: 0,
            kineticEnergy: ke,
            potentialEnergy: 0,
            totalEnergy: ke,
        })
    }

    return data
}

function generateEnergyData(
    problem: PhysicsProblem,
    params: SimulationParameters
): GraphDataPoint[] {
    const data: GraphDataPoint[] = []
    const obj = problem.objects[0]
    const metadata = obj.metadata || {}

    const k = (metadata.springConstant as number) || 100
    const x0 = (metadata.initialCompression as number) || 0.2
    const mass = params.mass

    const omega = Math.sqrt(k / mass)
    const amplitude = x0

    const dt = 0.02
    const period = (2 * Math.PI) / omega
    const maxTime = period * 2
    const steps = Math.ceil(maxTime / dt)

    for (let i = 0; i <= steps; i++) {
        const t = i * dt

        const x = amplitude * Math.cos(omega * t)
        const vx = -amplitude * omega * Math.sin(omega * t)
        const ax = -amplitude * omega * omega * Math.cos(omega * t)

        const ke = 0.5 * mass * vx ** 2
        const springPE = 0.5 * k * x ** 2

        data.push({
            time: t,
            positionX: x,
            positionY: 0,
            velocityX: vx,
            velocityY: 0,
            accelerationX: ax,
            accelerationY: 0,
            kineticEnergy: ke,
            potentialEnergy: springPE,
            totalEnergy: ke + springPE,
        })
    }

    return data
}


function generatePendulumData(
    problem: PhysicsProblem,
    params: SimulationParameters
): GraphDataPoint[] {
    const data: GraphDataPoint[] = []

    const length = params.length || 1
    const theta0 = ((params.initialAngle || 30) * Math.PI) / 180
    const g = params.gravity || 9.8
    const mass = params.mass || 1

    // For small angles, use simple harmonic motion approximation
    // For larger angles, use numerical integration
    const omega = Math.sqrt(g / length)
    const period = 2 * Math.PI / omega

    const dt = 0.02
    const maxTime = period * 3 // Show 3 complete periods
    const steps = Math.ceil(maxTime / dt)

    for (let i = 0; i <= steps; i++) {
        const t = i * dt

        // Simple harmonic motion approximation (works well for small angles)
        const theta = theta0 * Math.cos(omega * t)
        const thetaDot = -theta0 * omega * Math.sin(omega * t)

        // Convert to Cartesian coordinates
        // Pendulum pivot is at (0, 0), bob hangs down
        const x = length * Math.sin(theta)
        const y = -length * Math.cos(theta)

        // Velocity in Cartesian coordinates
        const vx = length * Math.cos(theta) * thetaDot
        const vy = length * Math.sin(theta) * thetaDot

        const speed = Math.sqrt(vx ** 2 + vy ** 2)
        const ke = 0.5 * mass * speed ** 2

        // Potential energy relative to lowest point
        const pe = mass * g * (y + length)

        data.push({
            time: t,
            positionX: x,
            positionY: y,
            velocityX: vx,
            velocityY: vy,
            accelerationX: 0,
            accelerationY: 0,
            kineticEnergy: ke,
            potentialEnergy: pe,
            totalEnergy: ke + pe,
        })
    }

    return data
}

function generateWavesData(
    problem: PhysicsProblem,
    params: SimulationParameters
): GraphDataPoint[] {
    // This is kept for backward compatibility but not used in current simulations
    return generatePendulumData(problem, params)
}

// Keep backward compatibility
export function generateProjectileData(v0: number, angle: number, g: number, mass: number): GraphDataPoint[] {
    return generateKinematicsData(
        { domain: ['kinematics'], objects: [], environment: { gravity: g, airResistance: false }, timeRange: [0, 'auto'], problemText: '' },
        { initialVelocity: v0, angle, gravity: g, mass }
    )
}

export function calculateMaxHeight(v0: number, angle: number, g: number): number {
    const vy = v0 * Math.sin((angle * Math.PI) / 180)
    return (vy * vy) / (2 * g)
}

export function calculateRange(v0: number, angle: number, g: number): number {
    const angleRad = (angle * Math.PI) / 180
    return (v0 * v0 * Math.sin(2 * angleRad)) / g
}

export function calculateTimeOfFlight(v0: number, angle: number, g: number): number {
    const vy = v0 * Math.sin((angle * Math.PI) / 180)
    return (2 * vy) / g
}

export function formatNumber(value: number): string {
    return value.toFixed(2)
}
