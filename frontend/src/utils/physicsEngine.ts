// Multi-domain physics engine with Semi-Implicit Euler Integration
import { GraphDataPoint, SimulationParameters, PhysicsProblem } from '../types/types'

// Utility function for formatting numbers
export function formatNumber(value: number): string {
    return value.toFixed(2)
}

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
    | 'block-on-block'

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

    if (params.mass2 !== undefined && params.appliedForce !== undefined) {
        return 'block-on-block'
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
        case 'block-on-block':
            return generateBlockOnBlockData(params)
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
    let y = params.initialHeight || 0
    let t = 0

    const mass = params.mass || 1
    const maxTime = 10

    const isUniformAccel = params.angle === 0 || params.angle === 180

    // Semi-Implicit Euler Integration
    while (t < maxTime && y >= -100) { // Allow dropping below 0 for free fall visual
        // Calculate forces and acceleration
        let ax = 0
        let ay = -g

        if (isUniformAccel) {
            // Gravity slider acts as acceleration magnitude
            ax = g * Math.cos(angleRad)
            ay = g * Math.sin(angleRad)
        }

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


        const vx = -radius * omega * Math.sin(phi)
        const vy = 0


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
// ==================== INCLINED PLANE WITH FRICTION ====================
function generateInclineFrictionData(params: SimulationParameters): GraphDataPoint[] {
    const data: GraphDataPoint[] = []
    const g = params.gravity || 9.8
    const mass = params.mass || 1
    const angleRad = ((params.inclineAngle || 30) * Math.PI) / 180
    const muK = params.frictionCoefficient || 0.3
    const muS = muK * 1.2

    // Direction: 1 = Sliding Down (starts at top), -1 = Sliding Up (starts at bottom)
    const direction = params.direction || 1
    const inclineLength = 7.5 // Matches 300px visual length at 40px/m scale
    const dt = 0.02

    // Coordinate System: s = distance from BOTTOM of incline (0 to inclineLength)
    // Positive s = UP the incline
    // Negative s = Below ground (stop)

    // Initial conditions
    let s = direction === 1 ? inclineLength : 0
    let v = direction === 1 ? 0 : 8 // If sliding up, give initial velocity
    let t = 0
    const maxTime = 10

    // Force Components (Fixed coordinates)
    // Gravity acts DOWN the slope (negative s direction)
    const gravityForce = -mass * g * Math.sin(angleRad)
    const normalForce = mass * g * Math.cos(angleRad)

    while (t < maxTime && s >= 0 && s <= inclineLength + 0.5) {
        let a = 0
        const isMoving = Math.abs(v) > 0.001

        if (!isMoving) {
            // Static friction check
            const maxStaticFriction = muS * normalForce

            // Gravity pulls DOWN (-). We check if gravity overcomes static friction.
            // Force trying to move block is Gravity.
            if (Math.abs(gravityForce) <= maxStaticFriction) {
                // Stays still
                a = 0
                v = 0
            } else {
                // Starts moving (Gravity pulls down, so v becomes negative)
                // Kinetic friction opposes motion (opposes gravity)
                // Friction acts UP (+)
                const kineticFriction = muK * normalForce
                // Net = Gravity (-) + Friction (+)
                const netForce = gravityForce + kineticFriction
                a = netForce / mass
            }
        } else {
            // Kinetic friction opposes velocity
            const kineticFriction = muK * normalForce
            const frictionDirection = -Math.sign(v) // If v > 0 (up), f < 0 (down). If v < 0 (down), f > 0 (up).

            const netForce = gravityForce + frictionDirection * kineticFriction
            a = netForce / mass
        }

        // Euler Integration
        v += a * dt
        s += v * dt

        // Convert to Cartesian (Origin at Bottom-Left of incline)
        // x = s * cos(theta)
        // y = s * sin(theta)
        const x = s * Math.cos(angleRad)
        const y = s * Math.sin(angleRad)

        const vx = v * Math.cos(angleRad)
        const vy = v * Math.sin(angleRad)

        const speed = Math.abs(v)
        const ke = 0.5 * mass * speed * speed
        const pe = mass * g * y // height is y

        data.push({
            time: t,
            positionX: x,
            positionY: y,
            velocityX: vx,
            velocityY: vy,
            accelerationX: a * Math.cos(angleRad),
            accelerationY: a * Math.sin(angleRad),
            kineticEnergy: ke,
            potentialEnergy: pe,
            totalEnergy: ke + pe,
        })

        t += dt
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
        const y1 = s * Math.sin(angleRad)

        // Position of m2 (hanging) - for future 3D visualization

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

// ==================== BLOCK ON BLOCK FRICTION ====================
function generateBlockOnBlockData(params: SimulationParameters): GraphDataPoint[] {
    const data: GraphDataPoint[] = []
    const g = params.gravity || 9.8
    const m1 = params.mass || 2 // Top block
    const m2 = params.mass2 || 4 // Bottom block
    const F = params.appliedForce || 20
    const mu1 = params.frictionCoefficient || 0.3 // Between blocks
    const mu2 = params.frictionCoefficient2 || 0.1 // Ground
    const dt = 0.02

    let x2 = 0 // Bottom block
    let v2 = 0
    let x1 = 0 // Top block (relative to m2? No, use absolute for simplicity, or relative for rendering)
    // Using absolute positions for calculation, but renderer might expect relative
    let v1 = 0

    // We will track absolute positions
    let t = 0
    const maxTime = 10

    // Max static friction between blocks
    const f1_max = mu1 * m1 * g
    // Kinetic friction between blocks
    const f1_k = mu1 * m1 * g // Simplified model often uses same coef or slight diff

    // Friction with ground (on m2)
    // Normal force on ground = (m1 + m2)g
    const f2_k = mu2 * (m1 + m2) * g

    while (t < maxTime) {
        // 1. Analyze motion of Bottom Block (m2) assuming they move together first
        // F is applied to m2? Description says "pulled by a force". Assuming on m2.

        // Ground friction opposes motion of m2
        // Ground friction opposes motion of m2
        // const groundFriction = v2 > 0 ? -f2_k : (v2 < 0 ? f2_k : 0) 

        // Static check implicit in netForce calculation below for now

        // Assume slipping for general dynamics simulation
        // Equation of motion for m2: F - f_ground - f_top_on_bottom = m2 * a2
        // Equation of motion for m1: f_bottom_on_top = m1 * a1

        // Check if blocks move together:
        // Common acceleration a_common
        // Net force on system = F - f_ground
        const netForceSystem = F - f2_k // Assuming velocity > 0 or F > friction
        let a2 = 0
        let a1 = 0

        if (netForceSystem > 0) {
            const a_common = netForceSystem / (m1 + m2)

            // Force required to accelerate m1 at a_common is m1 * a_common
            const f_needed = m1 * a_common

            if (f_needed <= f1_max) {
                // They move together
                a1 = a_common
                a2 = a_common
            } else {
                // They slip. 
                // Friction on m1 is f1_k (forward)
                a1 = f1_k / m1
                // Friction on m2 is F - f2_k - f1_k (backwards from top block)
                a2 = (F - f2_k - f1_k) / m2
            }
        } else {
            // Not enough force to move system or slowing down
            a1 = 0
            a2 = 0
        }

        v1 += a1 * dt
        v2 += a2 * dt

        x1 += v1 * dt
        x2 += v2 * dt

        const ke = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2

        data.push({
            time: t,
            positionX: x2, // Bottom block absolute
            positionY: x1 - x2, // Top block RELATIVE to bottom block (for visualization convenience)
            velocityX: v1,
            velocityY: v2,
            accelerationX: a1,
            accelerationY: a2,
            kineticEnergy: ke,
            potentialEnergy: 0,
            totalEnergy: ke,
        })

        t += dt
    }

    return data
}
