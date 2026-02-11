// Static library of pre-defined physics simulations
// Based on oPhysics.com reference for kinematics and dynamics

export interface SimulationTemplate {
    id: string
    name: string
    description: string
    domain: 'kinematics' | 'dynamics'
    keywords: string[]
    defaultParameters: {
        [key: string]: number
    }
    parameterDefinitions: {
        key: string
        label: string
        min: number
        max: number
        step: number
        unit: string
    }[]
    explanation: string
    objectType: 'point_mass' | 'block' | 'pendulum'
}

export const SIMULATION_LIBRARY: SimulationTemplate[] = [
    // ==================== KINEMATICS ====================
    {
        id: 'projectile-motion',
        name: 'Projectile Motion',
        description: 'A ball is thrown at an angle with initial velocity',
        domain: 'kinematics',
        keywords: ['projectile', 'ball', 'thrown', 'angle', 'trajectory', 'parabola', 'launch'],
        defaultParameters: {
            initialVelocity: 15,
            angle: 45,
            gravity: 9.8,
            mass: 1,
        },
        parameterDefinitions: [
            { key: 'initialVelocity', label: 'Initial Velocity', min: 1, max: 50, step: 0.5, unit: 'm/s' },
            { key: 'angle', label: 'Launch Angle', min: 0, max: 90, step: 1, unit: '°' },
            { key: 'gravity', label: 'Gravity', min: 1, max: 20, step: 0.1, unit: 'm/s²' },
            { key: 'mass', label: 'Mass', min: 0.1, max: 10, step: 0.1, unit: 'kg' },
        ],
        explanation: 'Projectile motion combines horizontal motion at constant velocity with vertical motion under constant acceleration due to gravity.',
        objectType: 'point_mass',
    },
    {
        id: 'vertical-projectile',
        name: 'Vertical Projectile Motion',
        description: 'A ball is thrown straight up with initial velocity',
        domain: 'kinematics',
        keywords: ['vertical', 'straight up', 'upward', 'thrown up', 'ball up'],
        defaultParameters: {
            initialVelocity: 10,
            angle: 90,
            gravity: 9.8,
            mass: 1,
        },
        parameterDefinitions: [
            { key: 'initialVelocity', label: 'Initial Velocity', min: 1, max: 30, step: 0.5, unit: 'm/s' },
            { key: 'gravity', label: 'Gravity', min: 1, max: 20, step: 0.1, unit: 'm/s²' },
            { key: 'mass', label: 'Mass', min: 0.1, max: 10, step: 0.1, unit: 'kg' },
        ],
        explanation: 'When thrown straight up, the ball decelerates at g until it reaches maximum height, then accelerates downward.',
        objectType: 'point_mass',
    },
    {
        id: 'free-fall',
        name: 'Free Fall',
        description: 'An object falls freely under gravity from rest',
        domain: 'kinematics',
        keywords: ['free fall', 'falling', 'drop', 'dropped', 'gravity fall'],
        defaultParameters: {
            initialVelocity: 0,
            angle: 270,
            gravity: 9.8,
            mass: 1,
        },
        parameterDefinitions: [
            { key: 'gravity', label: 'Gravity', min: 1, max: 20, step: 0.1, unit: 'm/s²' },
            { key: 'mass', label: 'Mass', min: 0.1, max: 10, step: 0.1, unit: 'kg' },
        ],
        explanation: 'In free fall, objects accelerate downward at g regardless of mass (neglecting air resistance).',
        objectType: 'point_mass',
    },
    {
        id: 'uniform-acceleration-1d',
        name: 'Uniform Acceleration in 1D',
        description: 'Object moving with constant acceleration in one dimension',
        domain: 'kinematics',
        keywords: ['uniform acceleration', 'constant acceleration', '1d motion', 'linear motion'],
        defaultParameters: {
            initialVelocity: 5,
            angle: 0,
            gravity: 2,
            mass: 1,
        },
        parameterDefinitions: [
            { key: 'initialVelocity', label: 'Initial Velocity', min: 0, max: 20, step: 0.5, unit: 'm/s' },
            { key: 'gravity', label: 'Acceleration', min: 0, max: 10, step: 0.1, unit: 'm/s²' },
            { key: 'mass', label: 'Mass', min: 0.1, max: 10, step: 0.1, unit: 'kg' },
        ],
        explanation: 'Uniform acceleration means velocity changes at a constant rate over time.',
        objectType: 'point_mass',
    },

    // ==================== DYNAMICS ====================
    {
        id: 'inclined-plane-friction',
        name: 'Inclined Plane with Friction',
        description: 'A block slides down an inclined plane with friction',
        domain: 'dynamics',
        keywords: ['incline', 'inclined plane', 'ramp', 'friction', 'slope', 'sliding'],
        defaultParameters: {
            mass: 2,
            inclineAngle: 30,
            frictionCoefficient: 0.3,
            gravity: 9.8,
        },
        parameterDefinitions: [
            { key: 'mass', label: 'Mass', min: 0.5, max: 10, step: 0.1, unit: 'kg' },
            { key: 'inclineAngle', label: 'Incline Angle', min: 0, max: 60, step: 1, unit: '°' },
            { key: 'frictionCoefficient', label: 'Friction Coefficient (μ)', min: 0, max: 1, step: 0.05, unit: '' },
            { key: 'gravity', label: 'Gravity', min: 1, max: 20, step: 0.1, unit: 'm/s²' },
        ],
        explanation: 'Net force = mg·sin(θ) - μ·mg·cos(θ). The block accelerates if gravity component exceeds friction.',
        objectType: 'block',
    },
    {
        id: 'friction-horizontal',
        name: 'Friction on Horizontal Surface',
        description: 'A box is pulled across a horizontal surface with friction',
        domain: 'dynamics',
        keywords: ['friction', 'horizontal', 'pulling', 'box', 'surface', 'drag'],
        defaultParameters: {
            mass: 2.5,
            tension: 35,
            theta: 30,
            staticFriction: 0.5,
            kineticFriction: 0.4,
            gravity: 9.8,
        },
        parameterDefinitions: [
            { key: 'tension', label: 'Tension (N)', min: 0, max: 100, step: 1, unit: 'N' },
            { key: 'mass', label: 'Mass', min: 0.5, max: 10, step: 0.1, unit: 'kg' },
            { key: 'theta', label: 'Angle (θ)', min: 0, max: 90, step: 1, unit: '°' },
            { key: 'staticFriction', label: 'Static Friction (μₛ)', min: 0, max: 1, step: 0.05, unit: '' },
            { key: 'kineticFriction', label: 'Kinetic Friction (μₖ)', min: 0, max: 1, step: 0.05, unit: '' },
        ],
        explanation: 'Applied force must overcome static friction to start motion, then kinetic friction opposes motion.',
        objectType: 'block',
    },
    {
        id: 'inclined-plane-pulley',
        name: 'Inclined Plane with Pulley (Two Masses)',
        description: 'Two masses connected by a rope over a pulley on an incline',
        domain: 'dynamics',
        keywords: ['pulley', 'two masses', 'incline pulley', 'rope', 'connected masses'],
        defaultParameters: {
            mass: 2,
            mass2: 1.5,
            inclineAngle: 30,
            frictionCoefficient: 0.2,
            gravity: 9.8,
        },
        parameterDefinitions: [
            { key: 'mass', label: 'Mass 1 (on incline)', min: 0.5, max: 10, step: 0.1, unit: 'kg' },
            { key: 'mass2', label: 'Mass 2 (hanging)', min: 0.5, max: 10, step: 0.1, unit: 'kg' },
            { key: 'inclineAngle', label: 'Incline Angle', min: 0, max: 60, step: 1, unit: '°' },
            { key: 'frictionCoefficient', label: 'Friction Coefficient (μ)', min: 0, max: 1, step: 0.05, unit: '' },
            { key: 'gravity', label: 'Gravity', min: 1, max: 20, step: 0.1, unit: 'm/s²' },
        ],
        explanation: 'The system accelerates based on the net force from both masses and friction on the incline.',
        objectType: 'block',
    },
    {
        id: 'simple-pendulum',
        name: 'Simple Pendulum',
        description: 'A mass swings back and forth on a string under gravity',
        domain: 'dynamics',
        keywords: ['pendulum', 'swing', 'oscillation', 'harmonic motion', 'bob'],
        defaultParameters: {
            length: 1,
            initialAngle: 30,
            mass: 1,
            gravity: 9.8,
        },
        parameterDefinitions: [
            { key: 'length', label: 'Length', min: 0.5, max: 3, step: 0.1, unit: 'm' },
            { key: 'initialAngle', label: 'Initial Angle', min: 5, max: 60, step: 1, unit: '°' },
            { key: 'mass', label: 'Mass', min: 0.1, max: 5, step: 0.1, unit: 'kg' },
            { key: 'gravity', label: 'Gravity', min: 1, max: 20, step: 0.1, unit: 'm/s²' },
        ],
        explanation: 'The pendulum exhibits simple harmonic motion for small angles. Period = 2π√(L/g).',
        objectType: 'pendulum',
    },
    {
        id: 'conical-pendulum',
        name: 'Conical Pendulum',
        description: 'A mass moves in a horizontal circle while suspended by a string',
        domain: 'dynamics',
        keywords: ['conical pendulum', 'circular motion', 'horizontal circle', 'centripetal'],
        defaultParameters: {
            length: 1,
            angle: 30,
            mass: 1,
            gravity: 9.8,
        },
        parameterDefinitions: [
            { key: 'length', label: 'String Length', min: 0.5, max: 3, step: 0.1, unit: 'm' },
            { key: 'angle', label: 'Cone Angle', min: 10, max: 70, step: 1, unit: '°' },
            { key: 'mass', label: 'Mass', min: 0.1, max: 5, step: 0.1, unit: 'kg' },
            { key: 'gravity', label: 'Gravity', min: 1, max: 20, step: 0.1, unit: 'm/s²' },
        ],
        explanation: 'Tension provides both the centripetal force for circular motion and balances the weight.',
        objectType: 'pendulum',
    },
]

export function getAllSimulations(): SimulationTemplate[] {
    return SIMULATION_LIBRARY
}

export function getSimulationById(id: string): SimulationTemplate | undefined {
    return SIMULATION_LIBRARY.find(sim => sim.id === id)
}

export function getSimulationsByDomain(domain: 'kinematics' | 'dynamics'): SimulationTemplate[] {
    return SIMULATION_LIBRARY.filter(sim => sim.domain === domain)
}
