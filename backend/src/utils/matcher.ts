// Simple keyword matching algorithm for simulation selection

import { SimulationTemplate, getAllSimulations } from '../data/simulationLibrary.js'

/**
 * Tokenizes input text into lowercase words
 */
function tokenize(text: string): string[] {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ') // Remove punctuation
        .split(/\s+/)
        .filter(word => word.length > 2) // Filter out very short words
}

/**
 * Calculates match score between query and simulation keywords
 */
function calculateMatchScore(queryTokens: string[], simulation: SimulationTemplate): number {
    let score = 0

    // Check each query token against simulation keywords
    for (const token of queryTokens) {
        for (const keyword of simulation.keywords) {
            if (keyword.includes(token) || token.includes(keyword)) {
                score += 1
            }
        }

        // Also check against simulation name and description
        if (simulation.name.toLowerCase().includes(token)) {
            score += 0.5
        }
        if (simulation.description.toLowerCase().includes(token)) {
            score += 0.3
        }
    }

    return score
}

/**
 * Finds the best matching simulation for a given query
 * Returns the simulation with highest match score, or default projectile motion
 */
export function matchSimulation(query: string): SimulationTemplate {
    const simulations = getAllSimulations()
    const queryTokens = tokenize(query)

    // If query is empty, return default projectile motion
    if (queryTokens.length === 0) {
        return simulations[0] // projectile-motion
    }

    // Calculate scores for all simulations
    const scoredSimulations = simulations.map(sim => ({
        simulation: sim,
        score: calculateMatchScore(queryTokens, sim)
    }))

    // Sort by score descending
    scoredSimulations.sort((a, b) => b.score - a.score)

    // Return best match, or default if no good match found
    const bestMatch = scoredSimulations[0]
    if (bestMatch.score > 0) {
        return bestMatch.simulation
    }

    // Default to projectile motion
    return simulations[0]
}

/**
 * Gets top N matching simulations for a query
 */
export function getTopMatches(query: string, limit: number = 3): SimulationTemplate[] {
    const simulations = getAllSimulations()
    const queryTokens = tokenize(query)

    const scoredSimulations = simulations.map(sim => ({
        simulation: sim,
        score: calculateMatchScore(queryTokens, sim)
    }))

    scoredSimulations.sort((a, b) => b.score - a.score)

    return scoredSimulations
        .filter(s => s.score > 0)
        .slice(0, limit)
        .map(s => s.simulation)
}
