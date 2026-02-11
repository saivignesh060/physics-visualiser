import express from 'express'
import { generateSimulation } from '../services/geminiService.js'

const router = express.Router()

// Generate simulation using Gemini API
router.post('/generate', async (req, res) => {
    try {
        const { problemText } = req.body

        if (!problemText || typeof problemText !== 'string') {
            return res.status(400).json({ error: 'Problem text is required' })
        }

        console.log('Generating simulation for:', problemText.substring(0, 100) + '...')

        const simulation = await generateSimulation(problemText)

        console.log(`Generated ${simulation.simulationData.length} data points for domain: ${simulation.domain}`)

        res.json(simulation)
    } catch (error) {
        console.error('Simulation generation error:', error)
        res.status(500).json({
            error: 'Failed to generate simulation',
            message: error instanceof Error ? error.message : 'Unknown error',
        })
    }
})

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'simulation' })
})

export default router
