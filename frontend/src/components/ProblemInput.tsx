import { useState } from 'react'
import { SimulationTemplate } from '../types/types'
import VoiceInput from './VoiceInput'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface ProblemInputProps {
    onSimulationSelected: (simulation: SimulationTemplate) => void
    onBrowseClick: () => void
}

export default function ProblemInput({ onSimulationSelected, onBrowseClick }: ProblemInputProps) {
    const [query, setQuery] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [matchedSimulation, setMatchedSimulation] = useState<SimulationTemplate | null>(null)

    const exampleQueries = [
        "A ball is thrown at 20 m/s at 45° angle",
        "A ball is thrown straight up with a speed of 10 m/s",
        "A block slides down a 30° incline with friction",
        "A box is pulled across a horizontal surface",
        "A pendulum swings from 30° angle",
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return

        setIsLoading(true)
        setError(null)
        setMatchedSimulation(null)

        try {
            const response = await fetch(`${API_BASE_URL}/api/match-simulation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            })

            if (!response.ok) {
                throw new Error('Failed to match simulation')
            }

            const data = await response.json()
            setMatchedSimulation(data.simulation)
        } catch (err) {
            console.error('Match error:', err)
            setError(err instanceof Error ? err.message : 'Failed to find matching simulation')
        } finally {
            setIsLoading(false)
        }
    }

    const handleLoadSimulation = () => {
        if (matchedSimulation) {
            onSimulationSelected(matchedSimulation)
        }
    }

    const handleExampleClick = (example: string) => {
        setQuery(example)
        setMatchedSimulation(null)
    }

    const handleVoiceTranscript = (text: string) => {
        setQuery(text)
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    ⚛️ Physics Motion Simulator
                </h2>
                <p className="text-gray-600">
                    Describe a physics motion problem and we'll find the best simulation for you
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Example: A ball is thrown straight up with a speed of 10 m/s"
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    />
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {matchedSimulation && (
                    <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <h3 className="font-semibold text-green-900 text-lg">
                                    ✓ Matched: {matchedSimulation.name}
                                </h3>
                                <p className="text-sm text-green-700 mt-1">
                                    {matchedSimulation.matchReason || matchedSimulation.description}
                                </p>
                            </div>
                            <span className={`text-xs px-3 py-1 rounded-full ${matchedSimulation.domain === 'kinematics'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-green-100 text-green-700'
                                }`}>
                                {matchedSimulation.domain}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={handleLoadSimulation}
                            className="mt-3 w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                        >
                            Load Simulation →
                        </button>
                    </div>
                )}

                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={isLoading || !query.trim()}
                        className="flex-1 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Finding Simulation...
                            </span>
                        ) : (
                            '🔍 Find Simulation'
                        )}
                    </button>

                    <VoiceInput onTranscript={handleVoiceTranscript} />
                </div>

                <button
                    type="button"
                    onClick={onBrowseClick}
                    className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold border-2 border-gray-300"
                >
                    📚 Browse All Simulations
                </button>
            </form>

            <div className="mt-8">
                <p className="text-sm font-medium text-gray-700 mb-3">✨ Try these examples:</p>
                <div className="space-y-2">
                    {exampleQueries.map((example, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleExampleClick(example)}
                            className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-primary-50 hover:border-primary-300 border border-gray-200 rounded-lg text-sm text-gray-700 transition-all"
                        >
                            {example}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">📊 Available Simulations</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>Kinematics</strong>: Projectile motion, vertical throw, free fall, uniform acceleration</li>
                    <li>• <strong>Dynamics</strong>: Inclined planes, friction, pulleys, pendulums</li>
                    <li>• <strong>Interactive</strong>: Adjust parameters in real-time and see instant changes</li>
                    <li>• <strong>Visual</strong>: Graphs for position, velocity, acceleration, and energy</li>
                </ul>
            </div>
        </div>
    )
}
