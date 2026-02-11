// Enhanced problem parser with multi-domain support
import { PhysicsProblem } from '../types/types'

export function parsePhysicsProblem(text: string): PhysicsProblem {
    const domain = detectDomain(text.toLowerCase())

    switch (domain) {
        case 'waves':
            return parseWavesProblem(text)
        case 'energy':
            return parseEnergyProblem(text)
        case 'dynamics':
            return parseDynamicsProblem(text)
        default:
            return parseKinematicsProblem(text)
    }
}

function detectDomain(text: string): string {
    // Waves - most specific first
    if (text.match(/pendulum|oscillat|shm|simple harmonic|swing|bob/i)) {
        return 'waves'
    }

    // Energy
    if (text.match(/spring|elastic|compress|stretch|k\s*=|energy/i)) {
        return 'energy'
    }

    // Dynamics
    if (text.match(/friction|incline|slope|ramp|coefficient|block.*slide/i)) {
        return 'dynamics'
    }

    // Default: kinematics
    return 'kinematics'
}

function parseKinematicsProblem(text: string): PhysicsProblem {
    const velocityMatch = text.match(/(\d+(?:\.\d+)?)\s*m\/s/)
    const angleMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:°|degrees?|deg)/i)

    const velocity = velocityMatch ? parseFloat(velocityMatch[1]) : 15
    const angleDeg = angleMatch ? parseFloat(angleMatch[1]) : 45

    const angleRad = (angleDeg * Math.PI) / 180
    const vx = velocity * Math.cos(angleRad)
    const vy = velocity * Math.sin(angleRad)

    return {
        problemText: text,
        domain: ['kinematics'],
        objects: [{
            id: 'projectile',
            type: 'point_mass',
            mass: 1,
            position: { x: 0, y: 0 },
            velocity: { x: vx, y: vy },
            acceleration: { x: 0, y: -9.8 },
            color: '#f59e0b',
            label: 'Projectile',
        }],
        environment: {
            gravity: 9.8,
            airResistance: false,
        },
        timeRange: [0, 'auto'],
    }
}

function parseDynamicsProblem(text: string): PhysicsProblem {
    const massMatch = text.match(/(\d+(?:\.\d+)?)\s*kg/)
    const mass = massMatch ? parseFloat(massMatch[1]) : 5

    const angleMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:°|degrees?|deg)/i)
    const angleDeg = angleMatch ? parseFloat(angleMatch[1]) : 30
    const angleRad = (angleDeg * Math.PI) / 180

    const frictionMatch = text.match(/(?:friction|coefficient|μ|mu).*?(\d+\.?\d*)/i)
    const mu = frictionMatch ? parseFloat(frictionMatch[1]) : 0.3

    const g = 9.8
    const normalForce = mass * g * Math.cos(angleRad)
    const frictionForce = mu * normalForce
    const gravityComponent = mass * g * Math.sin(angleRad)
    const netForce = gravityComponent - frictionForce
    const acceleration = netForce / mass

    return {
        problemText: text,
        domain: ['dynamics'],
        objects: [{
            id: 'block',
            type: 'block',
            mass: mass,
            position: { x: 0, y: 0 },
            velocity: { x: 0, y: 0 },
            acceleration: { x: acceleration * Math.cos(angleRad), y: -acceleration * Math.sin(angleRad) },
            color: '#3b82f6',
            label: 'Block',
            metadata: {
                inclineAngle: angleDeg,
                frictionCoefficient: mu,
                normalForce,
                frictionForce,
                netForce,
            }
        }],
        environment: {
            gravity: g,
            airResistance: false,
            inclineAngle: angleDeg,
        },
        timeRange: [0, 5],
    }
}

function parseEnergyProblem(text: string): PhysicsProblem {
    const kMatch = text.match(/k\s*=?\s*(\d+(?:\.\d+)?)|spring.*?(\d+(?:\.\d+)?)\s*N/i)
    const k = kMatch ? parseFloat(kMatch[1] || kMatch[2]) : 100

    const distMatch = text.match(/(?:compress|stretch).*?(\d+(?:\.\d+)?)\s*(?:m|cm)/i)
    let x = distMatch ? parseFloat(distMatch[1]) : 0.2
    if (text.includes('cm')) x = x / 100

    const massMatch = text.match(/(\d+(?:\.\d+)?)\s*kg/)
    const mass = massMatch ? parseFloat(massMatch[1]) : 1

    const springPE = 0.5 * k * x * x
    const velocity = Math.sqrt(2 * springPE / mass)

    return {
        problemText: text,
        domain: ['energy'],
        objects: [{
            id: 'mass',
            type: 'point_mass',
            mass: mass,
            position: { x: -x, y: 0 },
            velocity: { x: velocity, y: 0 },
            acceleration: { x: 0, y: 0 },
            color: '#10b981',
            label: 'Mass',
            metadata: {
                springConstant: k,
                initialCompression: x,
                springEnergy: springPE,
            }
        }],
        environment: {
            gravity: 9.8,
            airResistance: false,
            springConstant: k,
        },
        timeRange: [0, 3],
    }
}

function parseWavesProblem(text: string): PhysicsProblem {
    const lengthMatch = text.match(/length.*?(\d+(?:\.\d+)?)\s*(?:m|cm)/i)
    let length = lengthMatch ? parseFloat(lengthMatch[1]) : 1
    if (text.toLowerCase().includes('cm')) length = length / 100

    const angleMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:°|degrees?|deg)/i)
    const angleDeg = angleMatch ? parseFloat(angleMatch[1]) : 30
    const angleRad = (angleDeg * Math.PI) / 180

    const g = 9.8
    const period = 2 * Math.PI * Math.sqrt(length / g)

    const x0 = length * Math.sin(angleRad)
    const y0 = -length * Math.cos(angleRad)

    return {
        problemText: text,
        domain: ['waves'],
        objects: [{
            id: 'pendulum',
            type: 'pendulum',
            mass: 1,
            position: { x: x0, y: y0 },
            velocity: { x: 0, y: 0 },
            acceleration: { x: 0, y: 0 },
            color: '#8b5cf6',
            label: 'Pendulum',
            metadata: {
                length,
                initialAngle: angleDeg,
                period,
            }
        }],
        environment: {
            gravity: g,
            airResistance: false,
            pendulumLength: length,
        },
        timeRange: [0, period * 2],
    }
}
