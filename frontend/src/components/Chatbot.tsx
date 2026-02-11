import { useState } from 'react'
import { PhysicsProblem, SimulationParameters, ChatMessage } from '../types/types'

interface ChatbotProps {
    problem: PhysicsProblem
    parameters: SimulationParameters
}

export default function Chatbot({ problem: _problem, parameters }: ChatbotProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Hi! I'm here to help you understand this physics simulation. Ask me anything about the motion, equations, or what happens when you change parameters!",
            timestamp: Date.now(),
        },
    ])
    const [input, setInput] = useState('')
    const [isExpanded, setIsExpanded] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSend = async () => {
        if (!input.trim()) return

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: Date.now(),
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        // Simulate AI response (replace with actual Claude API call)
        setTimeout(() => {
            const response = generateResponse(input, parameters)
            const assistantMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response,
                timestamp: Date.now(),
            }
            setMessages(prev => [...prev, assistantMessage])
            setIsLoading(false)
        }, 1000)
    }

    const generateResponse = (question: string, params: SimulationParameters): string => {
        const q = question.toLowerCase()

        if (q.includes('gravity') || q.includes('fall') || q.includes('come back')) {
            return `Great question! Gravity is the force that pulls the projectile downward with acceleration ${params.gravity} m/s². Even though the ball initially moves upward, gravity constantly reduces the upward velocity until it reaches zero at the peak. Then gravity accelerates it back down. Watch the velocity vector (green arrow) - see how it shrinks to zero at the peak, then grows downward?`
        }

        if (q.includes('angle') || q.includes('45')) {
            return `The launch angle of ${params.angle.toFixed(1)}° determines how the initial velocity is split between horizontal and vertical components. A 45° angle gives maximum range, but try other angles! Steeper angles (60°-90°) go higher but shorter, while shallow angles (15°-30°) don't go as high but can still travel far.`
        }

        if (q.includes('energy')) {
            return `Energy is conserved throughout the motion! At launch, the projectile has only kinetic energy (${(0.5 * params.mass * params.initialVelocity ** 2).toFixed(2)} J). As it rises, KE converts to gravitational PE. At the peak, it has maximum PE and minimum KE. Coming down, PE converts back to KE. The total energy (red dashed line) stays constant!`
        }

        if (q.includes('velocity')) {
            return `The initial velocity is ${params.initialVelocity} m/s. The horizontal component (vx = ${(params.initialVelocity * Math.cos(params.angle * Math.PI / 180)).toFixed(2)} m/s) stays constant since there's no air resistance. The vertical component (vy) changes due to gravity: vy = ${(params.initialVelocity * Math.sin(params.angle * Math.PI / 180)).toFixed(2)} - ${params.gravity}×t`
        }

        if (q.includes('max') && (q.includes('height') || q.includes('high'))) {
            const maxHeight = (params.initialVelocity ** 2 * Math.sin(params.angle * Math.PI / 180) ** 2) / (2 * params.gravity)
            return `Maximum height is ${maxHeight.toFixed(2)} m. This happens when vertical velocity becomes zero. The formula is h_max = v₀²sin²θ / (2g) = ${params.initialVelocity}² × sin²(${params.angle}°) / (2 × ${params.gravity}) = ${maxHeight.toFixed(2)} m`
        }

        return `That's an interesting question! I'm here to help you understand projectile motion. Try asking about:\n• Why the ball comes back down\n• How angle affects the trajectory\n• Energy conservation\n• Maximum height or range\n• What happens if you change parameters\n\nWhat would you like to know?`
    }

    if (!isExpanded) {
        return (
            <button
                onClick={() => setIsExpanded(true)}
                className="fixed bottom-6 right-6 bg-primary-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-primary-700 transition-all hover:scale-105"
            >
                💬 Ask AI Assistant
            </button>
        )
    }

    return (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <span className="text-xl">🤖</span>
                    <div>
                        <h3 className="font-semibold">Physics AI Assistant</h3>
                        <p className="text-xs text-primary-100">Powered by Claude</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsExpanded(false)}
                    className="text-white hover:text-primary-100 transition-colors"
                >
                    ✕
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] px-4 py-2 rounded-lg ${message.role === 'user'
                                ? 'bg-primary-600 text-white'
                                : 'bg-white border border-gray-200 text-gray-800'
                                }`}
                        >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-3">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about the simulation..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    )
}
