// Physics object (projectile, block, spring, etc.)
export interface PhysicsObject {
    id: string;
    type: 'point_mass' | 'rigid_body' | 'block' | 'pendulum' | 'charged_particle';
    mass: number;
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    acceleration: { x: number; y: number };
    color: string;
    label: string;
    metadata?: Record<string, unknown>; // For domain-specific data
}

export interface PhysicsProblem {
    id?: string;
    problemText: string;
    domain: string[];
    objects: PhysicsObject[];
    environment: {
        gravity: number
        airResistance: boolean
        inclineAngle?: number
        springConstant?: number
        pendulumLength?: number
        electricField?: number
        magneticField?: number
        [key: string]: any // Allow additional domain-specific properties
    }
    timeRange: [number, number | 'auto'];
}

export interface SimulationState {
    isPlaying: boolean;
    currentTime: number;
    timeStep: number;
    playbackSpeed: number;
    problem: PhysicsProblem | null;
}

export interface GraphDataPoint {
    time: number;
    positionX: number;
    positionY: number;
    velocityX: number;
    velocityY: number;
    accelerationX: number;
    accelerationY: number;
    kineticEnergy: number;
    potentialEnergy: number;
    totalEnergy: number;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

export interface SimulationParameters {
    initialVelocity: number;
    angle: number;
    gravity: number;
    mass: number;
    [key: string]: number;
}

export interface ParsedProblemResponse {
    problem: PhysicsProblem;
    confidence: number;
    needsClarification: boolean;
    clarificationQuestions?: string[];
}

export interface SavedSimulation {
    id: string;
    userId: string;
    problemText: string;
    parameters: SimulationParameters;
    createdAt: string;
    thumbnail?: string;
}

// Static simulation template from library
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
    matchReason?: string
}
