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

        const data: any = await response.json()
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

function getBestStaticMatchId(query: string, availableSimulations: any[]): string {
    const normalizedQuery = query.toLowerCase()
    const queryTokens = normalizedQuery
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(token => token.length > 2)

    if (availableSimulations.length === 0) {
        return 'projectile-motion'
    }

    let bestId = availableSimulations[0].id
    let bestScore = -1

    for (const simulation of availableSimulations) {
        let score = 0
        const name = String(simulation.name || '').toLowerCase()
        const description = String(simulation.description || '').toLowerCase()
        const keywords = Array.isArray(simulation.keywords)
            ? simulation.keywords.map((k: string) => k.toLowerCase())
            : []

        for (const token of queryTokens) {
            if (name.includes(token)) score += 2
            if (description.includes(token)) score += 1
            for (const keyword of keywords) {
                if (keyword.includes(token) || token.includes(keyword)) {
                    score += 2
                }
            }
        }

        if (score > bestScore) {
            bestScore = score
            bestId = simulation.id
        }
    }

    return bestId
}

/**
 * Find best matching simulation using Gemini
 */
export async function findBestSimulationMatch(
    query: string,
    availableSimulations: any[]
): Promise<{ simulationId: string; reason: string }> {
    try {
        const apiKey = process.env.GEMINI_API_KEY
        const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

        if (!apiKey) {
            console.warn('GEMINI_API_KEY not configured, falling back to static matching')
            return {
                simulationId: getBestStaticMatchId(query, availableSimulations),
                reason: 'Matched with local keyword fallback because Gemini is not configured.'
            }
        }

        const simList = availableSimulations.map(s => ({
            id: s.id,
            name: s.name,
            description: s.description,
            keywords: s.keywords
        }))

        const prompt = `You are a physics expert. Match this user query to the best available simulation.
        
User Query: "${query}"

Available Simulations:
${JSON.stringify(simList, null, 2)}

Task:
1. Analyze the physics concepts in the query (kinematics, dynamics, forces, etc.)
2. Select the MOST appropriate simulation ID from the list.
3. Explain WHY this simulation helps understand the problem (1 short sentence).

Return ONLY valid JSON:
{
  "simulationId": "string",
  "reason": "string"
}`

        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        })

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`)
        }

        const data: any = await response.json()
        const text = data.candidates[0].content.parts[0].text

        // clean json
        let jsonText = text.trim()
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/```json\n?/, '').replace(/\n?```$/, '')
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/```\n?/, '').replace(/\n?```$/, '')
        }

        const result = JSON.parse(jsonText)
        const isValidId = availableSimulations.some(s => s.id === result.simulationId)
        if (!isValidId) {
            return {
                simulationId: getBestStaticMatchId(query, availableSimulations),
                reason: 'AI returned an unknown simulation id, so local keyword matching was used.'
            }
        }

        return result
    } catch (error) {
        console.error('Gemini Match Error:', error)
        return {
            simulationId: getBestStaticMatchId(query, availableSimulations),
            reason: 'AI matching failed, so local keyword matching was used.'
        }
    }
}

function getChatFallback(userMessage: string, context?: any): string {
    const q = userMessage.toLowerCase()
    const qCompact = q.replace(/[^a-z]/g, '')
    const params = context?.parameters || {}
    const domain = Array.isArray(context?.domain) ? context.domain[0] : context?.domain

    if (
        q.includes('projectile') ||
        q.includes('trajectory') ||
        q.includes('parabola')
    ) {
        return 'Projectile motion is 2D motion under constant gravity: horizontal velocity stays constant while vertical velocity changes due to gravity, producing a curved trajectory.'
    }

    if (q.includes('velocity') || q.includes('speed')) {
        const v0 = params.initialVelocity ?? 0
        return `Initial velocity is ${Number(v0).toFixed(2)} m/s. Increase it to make motion faster and to increase displacement over the same time interval.`
    }

    if (
        q.includes('acceleration') ||
        q.includes('accelleration') ||
        qCompact.includes('acceleration') ||
        qCompact.includes('accelleration') ||
        q.includes('gravity')
    ) {
        const g = params.gravity ?? 9.8
        return `Acceleration is the rate of change of velocity with time. In this simulation, gravity/acceleration is ${Number(g).toFixed(2)} m/s^2, so velocity changes by about ${Number(g).toFixed(2)} m/s each second in that direction.`
    }

    if (q.includes('friction')) {
        const mu = params.frictionCoefficient ?? params.kineticFriction ?? params.staticFriction
        if (mu !== undefined) {
            return `Friction coefficient is ${Number(mu).toFixed(2)}. Increasing friction reduces acceleration and can stop motion when resistive force exceeds driving force.`
        }
        return 'Higher friction reduces net force and slows the system; lower friction lets it accelerate more.'
    }

    if (q.includes('pulley') || q.includes('incline')) {
        return 'For incline-pulley systems, motion direction depends on the force balance between the hanging mass weight and the incline-side gravity plus friction.'
    }

    if (q.includes('energy')) {
        return 'Watch the energy plot: kinetic and potential energy exchange during motion, while total energy should stay near constant in idealized cases.'
    }

    if (q.includes('force')) {
        return 'Use F = ma: net force sets acceleration. Increase driving force to speed motion up; increase opposing forces (like friction) to reduce acceleration or stop motion.'
    }

    return `You are exploring a ${domain || 'physics'} simulation. Ask about acceleration, force balance, energy, or how one slider affects the trajectory.`
}

/**
 * Chat with AI assistant using Gemini
 */
export async function chatWithGemini(userMessage: string, context?: any): Promise<string> {
    try {
        const apiKey = process.env.GEMINI_API_KEY
        const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

        if (!apiKey) {
            return getChatFallback(userMessage, context)
        }

        const systemPrompt = `You are a helpful physics tutor assistant for a physics visualization platform.

Current simulation context:
${context ? JSON.stringify(context, null, 2) : 'No simulation loaded'}

Guidelines:
- Explain concepts clearly and concisely.
- Reference the current simulation context when relevant.
- Keep responses practical and focused for students.
- Limit response length to 2-3 short paragraphs.
`

        const prompt = `${systemPrompt}\nUser question: "${userMessage}"`

        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.4,
                    maxOutputTokens: 500
                }
            })
        })

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`)
        }

        const data: any = await response.json()
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text

        if (!text || typeof text !== 'string') {
            throw new Error('Invalid Gemini chat response')
        }

        return text.trim()
    } catch (error) {
        console.error('Gemini Chat Error:', error)
        return getChatFallback(userMessage, context)
    }
}
