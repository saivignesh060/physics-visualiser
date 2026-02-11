export default function Help() {
    const faqs = [
        {
            question: 'How do I create a simulation?',
            answer: 'Go to the Workspace, enter a physics problem in natural language (e.g., "A ball is thrown at 15 m/s at 30°"), and click "Generate Simulation". The AI will parse your problem and create an interactive visualization.'
        },
        {
            question: 'What physics domains are supported?',
            answer: 'Currently supports: Kinematics (projectile motion, free fall), Dynamics (forces, friction, inclines), Energy (springs, collisions), Waves (pendulum, SHM), and Electromagnetism (fields, charged particles).'
        },
        {
            question: 'How do I adjust parameters?',
            answer: 'Once a simulation is generated, use the sliders in the Control Panel on the left to adjust velocity, angle, gravity, mass, and other parameters. The animation and graphs update instantly!'
        },
        {
            question: 'What are the vector overlays?',
            answer: 'Toggle "Show Vectors" to see velocity (green) and acceleration (red) vectors on the animation. These help visualize how forces affect motion over time.'
        },
        {
            question: 'Can I voice a question or upload an image of a question?',
            answer: 'Yes! Click the microphone icon for voice input (Web Speech API) or the image upload button to extract text from textbook screenshots using OCR.'
        },
        {
            question: 'How does the AI chatbot work?',
            answer: 'Click "Ask AI Assistant" to get context-aware explanations about your simulation. Ask about physics concepts, what happens when you change parameters, or why certain behaviors occur.'
        }
    ]

    const tutorials = [
        {
            title: 'Getting Started',
            steps: [
                'Navigate to the Workspace page',
                'Enter a physics problem or select an example',
                'Click "Generate Simulation" and wait ~1 second',
                'Watch the animation play automatically',
                'Explore graphs showing position, velocity, acceleration, and energy'
            ]
        },
        {
            title: 'Parameter Exploration',
            steps: [
                'After simulation loads, locate the Control Panel (left sidebar)',
                'Adjust sliders for velocity, angle, gravity, or mass',
                'Observe instant changes in animation and graphs',
                'Note the calculated values (max height, range, time of  flight)',
                'Click "Reset" to return to original parameters'
            ]
        },
        {
            title: 'Using AI Assistance',
            steps: [
                'Click the "Ask AI Assistant" button (bottom-right)',
                'Type a question about the physics or simulation',
                'Receive context-aware explanations from Claude AI',
                'Ask follow-up questions for deeper understanding',
                'Close the chatbot by clicking the X'
            ]
        }
    ]

    const tips = [
        '💡 Include numerical values and units in your problems for best results',
        '⚡ Try changing one parameter at a time to see its isolated effect',
        '📊 Watch the energy graph to verify conservation of energy',
        '🎯 For projectile motion, notice that 45° gives maximum range',
        '🔄 Use the reset button to compare original vs. modified simulations',
        '🤖 Ask the AI chatbot "What if...?" questions to explore scenarios'
    ]

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Help & Documentation</h1>
                <p className="text-lg text-gray-600">Everything you need to know about Physics Visualizer</p>
            </div>

            {/* Quick Start */}
            <div className="physics-card bg-gradient-to-r from-primary-50 to-blue-50">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Start Guide</h2>
                <ol className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                        <span className="font-bold text-primary-600 mr-3">1.</span>
                        <span>Enter a physics problem (e.g., "A ball is thrown at 20 m/s at 45°")</span>
                    </li>
                    <li className="flex items-start">
                        <span className="font-bold text-primary-600 mr-3">2.</span>
                        <span>Watch the AI generate an interactive simulation with animation and graphs</span>
                    </li>
                    <li className="flex items-start">
                        <span className="font-bold text-primary-600 mr-3">3.</span>
                        <span>Adjust parameters with sliders and see instant visual changes</span>
                    </li>
                    <li className="flex items-start">
                        <span className="font-bold text-primary-600 mr-3">4.</span>
                        <span>Ask the AI chatbot questions to deepen your understanding</span>
                    </li>
                </ol>
            </div>

            {/* Tutorials */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Tutorials</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {tutorials.map((tutorial, idx) => (
                        <div key={idx} className="physics-card">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">{tutorial.title}</h3>
                            <ol className="space-y-2 text-sm text-gray-600">
                                {tutorial.steps.map((step, stepIdx) => (
                                    <li key={stepIdx} className="flex items-start">
                                        <span className="text-primary-600 mr-2 font-medium">{stepIdx + 1}.</span>
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQs */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <details key={idx} className="physics-card cursor-pointer">
                            <summary className="font-semibold text-gray-900 cursor-pointer hover:text-primary-600 transition-colors">
                                {faq.question}
                            </summary>
                            <p className="mt-3 text-gray-600 pl-4 border-l-2 border-primary-200">
                                {faq.answer}
                            </p>
                        </details>
                    ))}
                </div>
            </div>

            {/* Tips */}
            <div className="physics-card bg-yellow-50 border-yellow-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">💡 Pro Tips</h2>
                <ul className="space-y-2">
                    {tips.map((tip, idx) => (
                        <li key={idx} className="text-gray-700">{tip}</li>
                    ))}
                </ul>
            </div>

            {/* Technology */}
            <div className="physics-card">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Technology Stack</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <div className="text-3xl mb-2">⚛️</div>
                        <div className="font-medium text-gray-900">React 18</div>
                        <div className="text-xs text-gray-500">UI Framework</div>
                    </div>
                    <div>
                        <div className="text-3xl mb-2">🤖</div>
                        <div className="font-medium text-gray-900">Claude AI</div>
                        <div className="text-xs text-gray-500">Problem Parsing</div>
                    </div>
                    <div>
                        <div className="text-3xl mb-2">📊</div>
                        <div className="font-medium text-gray-900">Recharts</div>
                        <div className="text-xs text-gray-500">Graphs</div>
                    </div>
                    <div>
                        <div className="text-3xl mb-2">🎨</div>
                        <div className="font-medium text-gray-900">Canvas API</div>
                        <div className="text-xs text-gray-500">Animation</div>
                    </div>
                </div>
            </div>

            {/* Contact */}
            <div className="text-center physics-card bg-gradient-to-r from-primary-600 to-primary-800 text-white">
                <h2 className="text-2xl font-bold mb-2">Still Need Help?</h2>
                <p className="mb-4 opacity-90">Contact support or visit our documentation</p>
                <button
                    onClick={() => alert('Support: For assistance, please email support@physicsvisualizer.com or visit our documentation.')}
                    className="px-6 py-2 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                    Contact Support
                </button>
            </div>
        </div>
    )
}
