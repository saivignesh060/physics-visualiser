const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const simulationApi = {
    async generateSimulation(problemText: string) {
        const response = await fetch(`${API_BASE_URL}/api/simulation/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ problemText }),
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message || 'Failed to generate simulation')
        }

        return response.json()
    },

    async checkHealth() {
        const response = await fetch(`${API_BASE_URL}/api/simulation/health`)
        return response.json()
    },
}
