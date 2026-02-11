import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY || '',
})

const MODEL = 'claude-sonnet-4-20250514'

/**
 * Parse physics problem using Claude API
 */
export async function parseProblem(problemText: string) {
    try {
        const prompt = `You are a physics problem parser. Extract the following information from the physics problem and return it as JSON:

Problem: "${problemText}"

Extract:
- domain: array of physics domains (e.g., ["kinematics", "dynamics"])
- objects: array of objects with:
  - id, type, mass, initial position {x, y}, initial velocity {x, y}, acceleration {x, y}
- environment: { gravity (m/s²), airResistance (boolean) }
- timeRange: [start, end or "auto"]

If values are not explicitly stated, use reasonable defaults:
- gravity = 9.8 m/s²
- mass = 1 kg
- position at origin (0, 0)

Return ONLY valid JSON, no markdown or explanation.`

        const message = await client.messages.create({
            model: MODEL,
            max_tokens: 1024,
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        })

        const content = message.content[0]
        if (content.type !== 'text') {
            throw new Error('Unexpected response type from Claude')
        }

        // Parse the JSON from Claude's response
        const jsonMatch = content.text.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
            throw new Error('No JSON found in Claude response')
        }

        const parsed = JSON.parse(jsonMatch[0])

        return {
            problem: {
                id: Date.now().toString(),
                problemText,
                ...parsed,
            },
            confidence: 0.9,
            needsClarification: false,
        }
    } catch (error: any) {
        console.error('Claude API error:', error)

        // Fallback to simple parsing if Claude fails
        return fallbackParser(problemText)
    }
}

/**
 * Fallback parser when Claude API is unavailable
 */
function fallbackParser(text: string) {
    const velocityMatch = text.match(/(\d+(?:\.\d+)?)\s*m\/s/)
    const angleMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:°|degrees?|deg)/)

    const velocity = velocityMatch ? parseFloat(velocityMatch[1]) : 10
    const angleDeg = angleMatch ? parseFloat(angleMatch[1]) : 45

    const angleRad = (angleDeg * Math.PI) / 180
    const vx = velocity * Math.cos(angleRad)
    const vy = velocity * Math.sin(angleRad)

    return {
        problem: {
            id: Date.now().toString(),
            problemText: text,
            domain: ['kinematics'],
            objects: [
                {
                    id: 'ball_1',
                    type: 'point_mass',
                    mass: 1,
                    position: { x: 0, y: 0 },
                    velocity: { x: vx, y: vy },
                    acceleration: { x: 0, y: -9.8 },
                },
            ],
            environment: {
                gravity: 9.8,
                airResistance: false,
            },
            timeRange: [0, 'auto'],
        },
        confidence: 0.7,
        needsClarification: false,
    }
}

/**
 * Chat with AI assistant
 */
export async function chatWithAI(userMessage: string, context?: any) {
    try {
        const systemPrompt = `You are a helpful physics tutor assistant for a physics visualization platform. 

Current simulation context:
${context ? JSON.stringify(context, null, 2) : 'No simulation loaded'}

Your role is to:
- Explain physics concepts clearly and intuitively
- Help students understand how parameters affect motion
- Provide hints without giving direct answers
- Encourage exploration and experimentation
- Reference the visual simulation when explaining

Keep responses concise (2-3 paragraphs max) and friendly.`

        const message = await client.messages.create({
            model: MODEL,
            max_tokens: 500,
            system: systemPrompt,
            messages: [
                {
                    role: 'user',
                    content: userMessage,
                },
            ],
        })

        const content = message.content[0]
        if (content.type !== 'text') {
            throw new Error('Unexpected response type from Claude')
        }

        return content.text
    } catch (error: any) {
        console.error('Claude chat error:', error)

        // Fallback response
        return "I'm here to help you understand physics! Try asking about gravity, velocity, energy, or what happens when you change different parameters in the simulation."
    }
}
