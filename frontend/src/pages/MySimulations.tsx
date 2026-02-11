import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface SavedSimulation {
    id: string
    problemText: string
    domain: string[]
    createdAt: string
    thumbnail?: string
}

export default function MySimulations() {
    const { user } = useAuth()

    // Mock data - will be replaced with actual database queries
    const [simulations] = useState<SavedSimulation[]>([
        {
            id: '1',
            problemText: 'A ball is thrown at 15 m/s at a 30° angle',
            domain: ['kinematics'],
            createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
            id: '2',
            problemText: 'A projectile is launched at 20 m/s at 45°',
            domain: ['kinematics'],
            createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
        {
            id: '3',
            problemText: 'A 5kg block slides down a 30° incline with friction coefficient 0.3',
            domain: ['dynamics'],
            createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
    ])

    const [searchQuery, setSearchQuery] = useState('')
    const [filterDomain, setFilterDomain] = useState<string>('all')

    const filteredSimulations = simulations.filter(sim => {
        const matchesSearch = sim.problemText.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesDomain = filterDomain === 'all' || sim.domain.includes(filterDomain)
        return matchesSearch && matchesDomain
    })

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 60) return `${diffMins} minutes ago`
        if (diffHours < 24) return `${diffHours} hours ago`
        if (diffDays < 7) return `${diffDays} days ago`
        return date.toLocaleDateString()
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Simulations</h1>
                    <p className="text-gray-600 mt-1">
                        {user ? `Welcome back, ${user.name}! Here are your saved physics visualizations` : 'Your saved physics visualizations'}
                    </p>
                </div>
                <Link
                    to="/workspace"
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                    + New Simulation
                </Link>
            </div>

            {/* Search & Filters */}
            <div className="physics-card">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search simulations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <div>
                        <select
                            value={filterDomain}
                            onChange={(e) => setFilterDomain(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="all">All Domains</option>
                            <option value="kinematics">Kinematics</option>
                            <option value="dynamics">Dynamics</option>
                            <option value="energy">Energy</option>
                            <option value="waves">Waves</option>
                            <option value="electromagnetism">Electromagnetism</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Simulations Grid */}
            {filteredSimulations.length === 0 ? (
                <div className="physics-card text-center py-12">
                    <div className="text-6xl mb-4">📊</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Simulations Found</h3>
                    <p className="text-gray-600 mb-6">
                        {searchQuery || filterDomain !== 'all'
                            ? 'Try adjusting your search or filters'
                            : 'Create your first simulation to get started!'}
                    </p>
                    <Link
                        to="/workspace"
                        className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                    >
                        Create Simulation
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSimulations.map((simulation) => (
                        <div
                            key={simulation.id}
                            className="physics-card hover:shadow-xl transition-shadow cursor-pointer group"
                        >
                            {/* Thumbnail */}
                            <div className="aspect-video bg-gradient-to-br from-primary-100 to-blue-100 rounded-lg mb-3 flex items-center justify-center">
                                <span className="text-4xl">⚛️</span>
                            </div>

                            {/* Content */}
                            <div className="space-y-2">
                                <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                                    {simulation.problemText}
                                </h3>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                                        {simulation.domain[0]}
                                    </span>
                                    <span className="text-gray-500">
                                        {formatDate(simulation.createdAt)}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 mt-4">
                                <Link
                                    to="/workspace"
                                    className="flex-1 px-3 py-1.5 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors text-sm font-medium text-center"
                                >
                                    Load
                                </Link>
                                <button
                                    onClick={() => alert('Delete functionality coming soon!')}
                                    className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="physics-card text-center">
                    <div className="text-3xl font-bold text-primary-600">{simulations.length}</div>
                    <div className="text-sm text-gray-600">Total Simulations</div>
                </div>
                <div className="physics-card text-center">
                    <div className="text-3xl font-bold text-green-600">
                        {new Set(simulations.flatMap(s => s.domain)).size}
                    </div>
                    <div className="text-sm text-gray-600">Physics Domains Explored</div>
                </div>
                <div className="physics-card text-center">
                    <div className="text-3xl font-bold text-purple-600">
                        {simulations.filter(s => {
                            const date = new Date(s.createdAt)
                            const today = new Date()
                            return date.toDateString() === today.toDateString()
                        }).length}
                    </div>
                    <div className="text-sm text-gray-600">Created Today</div>
                </div>
            </div>
        </div>
    )
}
