// Multi-domain physics engine with Semi-Implicit Euler Integration
import { GraphDataPoint, SimulationParameters, PhysicsProblem } from '../types/types'

export type SimulationType =
    | 'projectile'
    | 'incline-friction'
    | 'friction-horizontal'
    | 'incline-pulley'
    | 'pendulum'
    | 'conical-pendulum'
    | 'vertical-projectile'
    | 'free-fall'
    | 'uniform-acceleration'

export function getSimulationType(problem: PhysicsProblem, params: SimulationParameters): SimulationType {
    const objectType = problem.objects[0]?.type

    // Check for pendulum
    if (objectType === 'pendulum') {
        if (params.angle !== undefined && params.length !== undefined) {
            return 'conical-pendulum'
        }
        return 'pendulum'
    }

    // Check for dynamics simulations
    if (params.inclineAngle !== undefined) {
        if (params.mass2 !== undefined) {
            return 'incline-pulley'
        }
        return 'incline-friction'
    }

    if (params.appliedForce !== undefined) {
        return 'friction-horizontal'
    }

    // Kinematics simulations
    if (params.angle === 90) {
        return 'vertical-projectile'
    }

    if (params.angle === 270 && params.initialVelocity === 0) {
        return 'free-fall'
    }

    if (params.angle === 0 || params.angle === 180) {
        return 'uniform-acceleration'
    }

    return 'projectile'
}

export function generateSimulationData(
    problem: PhysicsProblem,
    params: SimulationParameters
): GraphDataPoint[] {
    const simulationType = getSimulationType(problem, params)

    switch (simulationType) {
        case 'pendulum':
            return generatePendulumData(params)
        case 'conical-pendulum':
            return generateConicalPendulumData(params)
        case 'incline-friction':
            return generateInclineFrictionData(params)
        case 'friction-horizontal':
            return generateFrictionHorizontalData(params)
        case 'incline-pulley':
            return generateInclinePulleyData(params)
        case 'projectile':
        case 'vertical-projectile':
        case 'free-fall':
        case 'uniform-acceleration':
            return generateKinematicsData(params)
        default:
            return generateKinematicsData(params)
    }
}

// ==================== KINEMATICS (Projectile Motion) ====================
function generateKinematicsData(params: SimulationParameters): GraphDataPoint[] {
    const data: GraphDataPoint[] = []
    const g = params.gravity || 9.8
    const dt = 0.02 // 20ms time step

    const angleRad = (params.angle * Math.PI) / 180
    let vx = params.initialVelocity * Math.cos(angleRad)
    let vy = params.initialVelocity * Math.sin(angleRad)
    let x = 0
    let y = 0
    let t = 0

    const mass = params.mass || 1
    const maxTime = 10

    // Semi-Implicit Euler Integration
    while (t < maxTime && y >= 0) {
        // Calculate forces and acceleration
        const ax = 0 // No horizontal acceleration
        const ay = -g // Gravity

        // Update velocity (using acceleration)
        vx += ax * dt
        vy += ay * dt

        // Update position (using NEW velocity - Semi-Implicit Euler)
        x += vx * dt
        y += vy * dt

        // Calculate energies
        const speed = Math.sqrt(vx * vx + vy * vy)
        const ke = 0.5 * mass * speed * speed
        const pe = mass * g * Math.max(0, y)

        data.push({
            time: t,
            positionX: x,
            positionY: y,
            velocityX: vx,
            velocityY: vy,
            accelerationX: ax,
            accelerationY: ay,
            kineticEnergy: ke,
            potentialEnergy: pe,
            totalEnergy: ke + pe,
        })

        t += dt

        // Stop if hit ground
        if (y < 0 && data.length > 1) break
    }

    return data
}

// ==================== PENDULUM (Numerical Integration) ====================
function generatePendulumData(params: SimulationParameters): GraphDataPoint[] {
    const data: GraphDataPoint[] = []
    const g = params.gravity || 9.8
    const length = params.length || 1
    const mass = params.mass || 1
    const dt = 0.02

    // Initial conditions
    const initialAngleRad = ((params.initialAngle || 30) * Math.PI) / 180
    let theta = initialAngleRad // Current angle from vertical
    let omega = 0 // Angular velocity
    let t = 0
    const maxTime = 10

    // Semi-Implicit Euler for Pendulum
    while (t < maxTime) {
        // Calculate angular acceleration: α = -(g/L) * sin(θ)
        const alpha = -(g / length) * Math.sin(theta)

        // Update angular velocity
        omega += alpha * dt

        // Update angle (using NEW omega)
        theta += omega * dt

        // Convert to Cartesian coordinates
        const x = length * Math.sin(theta)
        const y = -length * Math.cos(theta) // Negative because y-axis points down

        // Velocities
        const vx = length * omega * Math.cos(theta)
        const vy = length * omega * Math.sin(theta)

        // Energies
        const speed = Math.abs(length * omega)
        const ke = 0.5 * mass * speed * speed
        const pe = mass * g * (length - length * Math.cos(theta)) // Height above lowest point

        data.push({
            time: t,
            positionX: x,
            positionY: y,
            velocityX: vx,
            velocityY: vy,
            accelerationX: -length * alpha * Math.sin(theta),
            accelerationY: -length * alpha * Math.cos(theta),
            kineticEnergy: ke,
            potentialEnergy: pe,
            totalEnergy: ke + pe,
        })

        t += dt
    }

    return data
}

// ==================== CONICAL PENDULUM ====================
function generateConicalPendulumData(params: SimulationParameters): GraphDataPoint[] {
    const data: GraphDataPoint[] = []
    const g = params.gravity || 9.8
    const length = params.length || 1
    const mass = params.mass || 1
    const coneAngleRad = ((params.angle || 30) * Math.PI) / 180
    const dt = 0.02

    // Calculate radius and angular velocity for circular motion
    const radius = length * Math.sin(coneAngleRad)
    const height = length * Math.cos(coneAngleRad)
    const omega = Math.sqrt(g / (length * Math.cos(coneAngleRad)))

    let t = 0
    const maxTime = 10

    while (t < maxTime) {
        const phi = omega * t // Angle around the circle

        const x = radius * Math.cos(phi)
        const y = -height // Constant height
        const z = radius * Math.sin(phi)

        const vx = -radius * omega * Math.sin(phi)
        const vy = 0
        const vz = radius * omega * Math.cos(phi)

        const speed = radius * omega
        const ke = 0.5 * mass * speed * speed
        const pe = mass * g * (length - height)

        data.push({
            time: t,
            positionX: x,
            positionY: y,
            velocityX: vx,
            velocityY: vy,
            accelerationX: -radius * omega * omega * Math.cos(phi),
            accelerationY: 0,
            kineticEnergy: ke,
            potentialEnergy: pe,
            totalEnergy: ke + pe,
        })

        t += dt
    }

    return data
}

// ==================== INCLINED PLANE WITH FRICTION ====================
function generateInclineFrictionData(params: SimulationParameters): GraphDataPoint[] {
    const data: GraphDataPoint[] = []
    const g = params.gravity || 9.8
    const mass = params.mass || 1
    const angleRad = ((params.inclineAngle || 30) * Math.PI) / 180
    const muK = params.frictionCoefficient || 0.3
    const muS = muK * 1.2 // Static friction slightly higher
    const direction = params.direction || 1 // 1 = down, -1 = up
    const dt = 0.02

    // Initial conditions
    let s = 0 // Distance along incline
    let v = 0 // Velocity along incline
    let t = 0
    const maxTime = 10
    const inclineLength = 5

    // Forces
    const normalForce = mass * g * Math.cos(angleRad)
    const gravityParallel = mass * g * Math.sin(angleRad)

    // Semi-Implicit Euler
    while (t < maxTime && Math.abs(s) < inclineLength) {
        let a = 0

        // Check if moving or static
        if (Math.abs(v) < 0.001) {
            // Static friction case
            const maxStaticFriction = muS * normalForce

            if (Math.abs(gravityParallel) <= maxStaticFriction) {
                // Block sticks
                a = 0
                v = 0
            } else {
                // Overcome static friction, start moving
                const frictionForce = muK * normalForce
                const netForce = direction * gravityParallel - Math.sign(direction) * frictionForce
                a = netForce / mass
            }
        } else {
            // Kinetic friction opposes velocity
            const frictionForce = muK * normalForce
            const frictionDirection = -Math.sign(v)
            const netForce = direction * gravityParallel + frictionDirection * frictionForce
            a = netForce / mass
        }

        // Update velocity and position
        v += a * dt
        s += v * dt

        // Convert to Cartesian coordinates
        const x = s * Math.cos(angleRad)
        const y = direction > 0 ? -s * Math.sin(angleRad) : s * Math.sin(angleRad)

        const vx = v * Math.cos(angleRad)
        const vy = direction > 0 ? -v * Math.sin(angleRad) : v * Math.sin(angleRad)

        const speed = Math.abs(v)
        const ke = 0.5 * mass * speed * speed
        const pe = mass * g * Math.abs(y)

        data.push({
            time: t,
            positionX: x,
            positionY: y,
            velocityX: vx,
            velocityY: vy,
            accelerationX: a * Math.cos(angleRad),
            accelerationY: direction > 0 ? -a * Math.sin(angleRad) : a * Math.sin(angleRad),
            kineticEnergy: ke,
            potentialEnergy: pe,
            totalEnergy: ke + pe,
        })

        t += dt

        // Stop if velocity becomes zero and can't overcome static friction
        if (Math.abs(v) < 0.001 && Math.abs(gravityParallel) <= muS * normalForce) {
            break
        }
    }

    return data
}

// ==================== FRICTION ON HORIZONTAL SURFACE ====================
function generateFrictionHorizontalData(params: SimulationParameters): GraphDataPoint[] {
    const data: GraphDataPoint[] = []
    const g = params.gravity || 9.8
    const mass = params.mass || 2.5
    const appliedForce = params.appliedForce || 15
    const muS = params.staticFriction || 0.5
    const muK = params.kineticFriction || 0.4
    const dt = 0.02

    let x = 0
    let v = 0
    let t = 0
    const maxTime = 5

    const normalForce = mass * g
    const maxStaticFriction = muS * normalForce

    while (t < maxTime) {
        let a = 0

        if (Math.abs(v) < 0.001) {
            // Static friction
            if (appliedForce <= maxStaticFriction) {
                a = 0
                v = 0
            } else {
                const kineticFriction = muK * normalForce
                const netForce = appliedForce - kineticFriction
                a = netForce / mass
            }
        } else {
            // Kinetic friction opposes motion
            const kineticFriction = muK * normalForce
            const frictionDirection = -Math.sign(v)
            const netForce = appliedForce + frictionDirection * kineticFriction
            a = netForce / mass
        }

        v += a * dt
        x += v * dt

        const speed = Math.abs(v)
        const ke = 0.5 * mass * speed * speed

        data.push({
            time: t,
            positionX: x,
            positionY: 0,
            velocityX: v,
            velocityY: 0,
            accelerationX: a,
            accelerationY: 0,
            kineticEnergy: ke,
            potentialEnergy: 0,
            totalEnergy: ke,
        })

        t += dt
    }

    return data
}

// ==================== INCLINED PLANE WITH PULLEY (TWO MASSES) ====================
function generateInclinePulleyData(params: SimulationParameters): GraphDataPoint[] {
    const data: GraphDataPoint[] = []
    const g = params.gravity || 9.8
    const m1 = params.mass || 2 // Mass on incline
    const m2 = params.mass2 || 1.5 // Hanging mass
    const angleRad = ((params.inclineAngle || 30) * Math.PI) / 180
    const muK = params.frictionCoefficient || 0.2
    const muS = muK * 1.2
    const dt = 0.02

    let s = 0 // Distance (positive = m2 moving down)
    let v = 0 // Velocity
    let t = 0
    const maxTime = 10

    const normalForce = m1 * g * Math.cos(angleRad)
    const m1GravityParallel = m1 * g * Math.sin(angleRad)
    const m2GravityForce = m2 * g
    const systemMass = m1 + m2

    while (t < maxTime && s < 5) {
        let a = 0

        if (Math.abs(v) < 0.001) {
            // Static case
            const maxStaticFriction = muS * normalForce
            const drivingForce = m2GravityForce - m1GravityParallel

            if (Math.abs(drivingForce) <= maxStaticFriction) {
                a = 0
                v = 0
            } else {
                const kineticFriction = muK * normalForce
                const netForce = drivingForce - Math.sign(drivingForce) * kineticFriction
                a = netForce / systemMass
            }
        } else {
            // Moving case
            const kineticFriction = muK * normalForce
            const drivingForce = m2GravityForce - m1GravityParallel

            // Friction opposes motion
            const frictionDirection = -Math.sign(v)
            const netForce = drivingForce + frictionDirection * kineticFriction
            a = netForce / systemMass
        }

        v += a * dt
        s += v * dt

        // Position of m1 on incline
        const x1 = s * Math.cos(angleRad)
        const y1 = -s * Math.sin(angleRad)

        // Position of m2 (hanging)
        const x2 = x1 + 0.5 // Offset for visualization
        const y2 = y1 - s // Moves down as m1 moves up incline

        const speed = Math.abs(v)
        const ke = 0.5 * systemMass * speed * speed
        const pe1 = m1 * g * Math.abs(y1)
        const pe2 = m2 * g * Math.abs(y2)

        data.push({
            time: t,
            positionX: x1,
            positionY: y1,
            velocityX: v * Math.cos(angleRad),
            velocityY: -v * Math.sin(angleRad),
            accelerationX: a * Math.cos(angleRad),
            accelerationY: -a * Math.sin(angleRad),
            kineticEnergy: ke,
            potentialEnergy: pe1 + pe2,
            totalEnergy: ke + pe1 + pe2,
        })

        t += dt
    }

    return data
}
