import { useState, useEffect } from 'react'
import { SimulationTemplate } from '../types/types'

interface SimulationBrowserProps {
    onSelectSimulation: (simulation: SimulationTemplate) => void
}

export default function SimulationBrowser({ onSelectSimulation }: SimulationBrowserProps) {
    const [simulations, setSimulations] = useState<SimulationTemplate[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'kinematics' | 'dynamics'>('all')

    useEffect(() => {
        fetchSimulations()
    }, [])

    const fetchSimulations = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/simulations')
            const data = await response.json()
            setSimulations(data.simulations)
        } catch (error) {
            console.error('Failed to fetch simulations:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredSimulations = simulations.filter(sim =>
        filter === 'all' || sim.domain === filter
    )

    const kinematicsCount = simulations.filter(s => s.domain === 'kinematics').length
    const dynamicsCount = simulations.filter(s => s.domain === 'dynamics').length

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">Loading simulations...</div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Browse Simulations</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        All ({simulations.length})
                    </button>
                    <button
                        onClick={() => setFilter('kinematics')}
                        className={`px-4 py-2 rounded-lg transition-colors ${filter === 'kinematics'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Kinematics ({kinematicsCount})
                    </button>
                    <button
                        onClick={() => setFilter('dynamics')}
                        className={`px-4 py-2 rounded-lg transition-colors ${filter === 'dynamics'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Dynamics ({dynamicsCount})
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSimulations.map(simulation => (
                    <div
                        key={simulation.id}
                        onClick={() => onSelectSimulation(simulation)}
                        className="physics-card cursor-pointer hover:shadow-lg transition-shadow group"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">
                                {simulation.name}
                            </h3>
                            <span
                                className={`text-xs px-2 py-1 rounded-full ${simulation.domain === 'kinematics'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-green-100 text-green-700'
                                    }`}
                            >
                                {simulation.domain}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{simulation.description}</p>
                        <div className="flex flex-wrap gap-1">
                            {simulation.keywords.slice(0, 3).map(keyword => (
                                <span
                                    key={keyword}
                                    className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                                >
                                    {keyword}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {filteredSimulations.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No simulations found for this filter.
                </div>
            )}
        </div>
    )
}
