import { Link } from 'react-router-dom'

export default function Home() {
    const features = [
        {
            icon: '🎯',
            title: 'AI-Powered',
            description: 'Enter physics problems in natural language and watch them transform into interactive simulations'
        },
        {
            icon: '📊',
            title: 'Real-Time Graphs',
            description: '4 synchronized graphs showing position, velocity, acceleration, and energy over time'
        },
        {
            icon: '🎛️',
            title: 'Interactive Controls',
            description: 'Adjust parameters with sliders and see instant visual feedback in the animation'
        },
        {
            icon: '🤖',
            title: 'AI Chatbot',
            description: 'Get explanations and guidance powered by Claude AI for deeper understanding'
        },
        {
            icon: '🎨',
            title: 'Vector Visualization',
            description: 'See velocity and acceleration vectors in real-time as the simulation plays'
        },
        {
            icon: '⚡',
            title: 'Multi-Domain Support',
            description: 'Covers kinematics, dynamics, energy, waves, and electromagnetism'
        }
    ]

    const examples = [
        {
            problem: 'Projectile Motion',
            description: '"A ball is thrown at 20 m/s at a 45° angle"',
            color: 'bg-blue-500'
        },
        {
            problem: 'Dynamics',
            description: '"A 5kg block slides down a 30° incline with friction"',
            color: 'bg-green-500'
        },
        {
            problem: 'Energy',
            description: '"A spring with k=100 N/m is compressed 0.2m"',
            color: 'bg-purple-500'
        },
        {
            problem: 'Waves',
            description: '"A pendulum of length 1m swings from 30° angle"',
            color: 'bg-orange-500'
        }
    ]

    return (
        <div className="space-y-16">
            {/* Hero Section */}
            <div className="text-center py-12 bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl">
                <h1 className="text-5xl font-bold text-gray-900 mb-4">
                    Transform Physics Problems into
                    <span className="text-primary-600"> Interactive Simulations</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                    An AI-powered educational platform that brings physics concepts to life through
                    real-time visualization, parameter manipulation, and intelligent guidance.
                </p>
                <div className="flex justify-center space-x-4">
                    <Link
                        to="/workspace"
                        className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-lg shadow-lg"
                    >
                        🚀 Start Visualizing
                    </Link>
                    <Link
                        to="/help"
                        className="px-8 py-3 bg-white text-primary-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg shadow-md border border-primary-200"
                    >
                        📚 Learn More
                    </Link>
                </div>
            </div>

            {/* Features Grid */}
            <div>
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                    Powerful Features for Learning Physics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, idx) => (
                        <div key={idx} className="physics-card hover:shadow-lg transition-shadow">
                            <div className="text-4xl mb-3">{feature.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Example Problems */}
            <div>
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                    Supported Physics Domains
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {examples.map((example, idx) => (
                        <div key={idx} className="physics-card hover:shadow-lg transition-shadow">
                            <div className={`w-12 h-12 rounded-lg ${example.color} flex items-center justify-center text-white text-2xl mb-3`}>
                                ⚛️
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{example.problem}</h3>
                            <p className="text-sm text-gray-600 italic">{example.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* How It Works */}
            <div className="bg-gray-50 rounded-2xl p-12">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                    How It Works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                            1
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Enter Problem</h3>
                        <p className="text-sm text-gray-600">Type, speak, or upload an image of your physics problem</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                            2
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">AI Parses</h3>
                        <p className="text-sm text-gray-600">Claude AI extracts parameters and generates simulation</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                            3
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Explore</h3>
                        <p className="text-sm text-gray-600">Watch animation, adjust parameters, view graphs</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                            4
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Learn</h3>
                        <p className="text-sm text-gray-600">Ask AI questions and deepen your understanding</p>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="text-center py-12 bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-2xl">
                <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
                <p className="text-lg mb-6 opacity-90">Join students worldwide in visualizing physics concepts</p>
                <Link
                    to="/workspace"
                    className="inline-block px-8 py-3 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg shadow-lg"
                >
                    Create Your First Simulation →
                </Link>
            </div>
        </div>
    )
}
