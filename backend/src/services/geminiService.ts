// Simple Gemini API integration using fetch (no SDK needed)
export interface SimulationResponse {
    domain: string
    parameters: Record<string, number>
    simulationData: Array<{
        time: number
        positionX: number
        positionY: number
        velocityX: number
        velocityY: number
        accelerationX: number
        accelerationY: number
        kineticEnergy: number
        potentialEnergy: number
        totalEnergy: number
    }>
    renderingConfig: {
        type: 'projectile' | 'pendulum' | 'spring' | 'incline' | 'block'
        origin: 'bottom-left' | 'top-center' | 'center'
        scale: number
        timeRange: number
    }
}

const SYSTEM_PROMPT = `You are a physics simulation engine that converts natural language physics problems into structured simulation data.

Your task:
1. Parse the physics problem
2. Identify the domain (kinematics, dynamics, energy, waves, electromagnetism, fluids)
3. Extract all relevant parameters with units
4. Generate complete simulation data points (position, velocity, acceleration, energy)
5. Provide rendering configuration

CRITICAL RULES:
- Return ONLY valid JSON, no markdown, no explanations
- Generate at least 100 data points for smooth animation
- Use SI units (meters, seconds, kg)
- Calculate energy at each time step
- Ensure physics accuracy (conservation laws)

Response format:
{
  "domain": "kinematics|dynamics|energy|waves|electromagnetism|fluids",
  "parameters": {
    "initialVelocity": number,
    "angle": number,
    "gravity": 9.8,
    "mass": number
  },
  "simulationData": [
    {
      "time": number,
      "positionX": number,
      "positionY": number,
      "velocityX": number,
      "velocityY": number,
      "accelerationX": number,
      "accelerationY": number,
      "kineticEnergy": number,
      "potentialEnergy": number,
      "totalEnergy": number
    }
  ],
  "renderingConfig": {
    "type": "projectile|pendulum|spring|incline|block",
    "origin": "bottom-left|top-center|center",
    "scale": number,
    "timeRange": number
  }
}

Examples:

Problem: "A ball is thrown at 20 m/s at 45°"
Domain: kinematics
Calculate: projectile motion trajectory
Data points: ~100-150 points from t=0 to landing`

export async function generateSimulation(problemText: string): Promise<SimulationResponse> {
    try {
        const apiKey = process.env.GEMINI_API_KEY
        const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

        if (!apiKey) {
            throw new Error('GEMINI_API_KEY not configured')
        }

        const prompt = `${SYSTEM_PROMPT}

Problem: "${problemText}"

Generate the complete simulation JSON:`

        // Call Gemini API using fetch
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        })

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        const text = data.candidates[0].content.parts[0].text

        // Extract JSON from response (in case Gemini adds markdown)
        let jsonText = text.trim()
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/```json\n?/, '').replace(/\n?```$/, '')
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/```\n?/, '').replace(/\n?```$/, '')
        }

        const simulation = JSON.parse(jsonText)

        // Validate response structure
        if (!simulation.domain || !simulation.parameters || !simulation.simulationData) {
            throw new Error('Invalid simulation response structure')
        }

        if (!Array.isArray(simulation.simulationData) || simulation.simulationData.length < 10) {
            throw new Error('Insufficient simulation data points')
        }

        return simulation
    } catch (error) {
        console.error('Gemini API Error:', error)
        throw new Error(`Failed to generate simulation: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}
