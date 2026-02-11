import { Router } from 'express'
import { getAllSimulations, getSimulationById, getSimulationsByDomain } from '../data/simulationLibrary.js'
import { matchSimulation, getTopMatches } from '../utils/matcher.js'

const router = Router()

// Match simulation from query text
router.post('/match-simulation', async (req, res) => {
    try {
        const { query } = req.body

        if (!query) {
            return res.status(400).json({ error: 'Query text is required' })
        }

        const simulations = getAllSimulations()

        // Use Gemini to match
        const { findBestSimulationMatch } = await import('../services/geminiService.js')
        const matchResult = await findBestSimulationMatch(query, simulations)

        const simulation = simulations.find(s => s.id === matchResult.simulationId) || simulations[0]

        // Attach AI reason
        const responseSimulation = {
            ...simulation,
            matchReason: matchResult.reason
        }

        res.json({ simulation: responseSimulation })
    } catch (error: any) {
        console.error('Match simulation error:', error)
        // Fallback to static matching if AI fails completely (though service handles errors)
        const { matchSimulation } = await import('../utils/matcher.js')
        const simulation = matchSimulation(query)
        res.json({ simulation })
    }
})

// Get all simulations
router.get('/simulations', async (req, res) => {
    try {
        const simulations = getAllSimulations()
        res.json({ simulations })
    } catch (error: any) {
        console.error('Get simulations error:', error)
        res.status(500).json({ error: 'Failed to get simulations', message: error.message })
    }
})

// Get simulation by ID
router.get('/simulations/:id', async (req, res) => {
    try {
        const { id } = req.params
        const simulation = getSimulationById(id)

        if (!simulation) {
            return res.status(404).json({ error: 'Simulation not found' })
        }

        res.json({ simulation })
    } catch (error: any) {
        console.error('Get simulation error:', error)
        res.status(500).json({ error: 'Failed to get simulation', message: error.message })
    }
})

// Get simulations by domain
router.get('/simulations/domain/:domain', async (req, res) => {
    try {
        const { domain } = req.params

        if (domain !== 'kinematics' && domain !== 'dynamics') {
            return res.status(400).json({ error: 'Invalid domain. Must be kinematics or dynamics' })
        }

        const simulations = getSimulationsByDomain(domain as 'kinematics' | 'dynamics')
        res.json({ simulations })
    } catch (error: any) {
        console.error('Get simulations by domain error:', error)
        res.status(500).json({ error: 'Failed to get simulations', message: error.message })
    }
})

// Save simulation
router.post('/simulations', async (req, res) => {
    try {
        const { userId, problemText, parameters } = req.body

        // For MVP, just return success - full database implementation can be added later
        const simulation = {
            id: Date.now().toString(),
            userId,
            problemText,
            parameters,
            createdAt: new Date().toISOString(),
        }

        res.json(simulation)
    } catch (error: any) {
        console.error('Save simulation error:', error)
        res.status(500).json({ error: 'Failed to save simulation', message: error.message })
    }
})

// Get user simulations
router.get('/simulations/:userId', async (req, res) => {
    try {
        const { userId } = req.params

        // For MVP, return empty array - full database implementation can be added later
        res.json([])
    } catch (error: any) {
        console.error('Get simulations error:', error)
        res.status(500).json({ error: 'Failed to get simulations', message: error.message })
    }
})

export default router
