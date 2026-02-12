import { useState } from 'react'
import { PhysicsProblem, SimulationParameters, ChatMessage } from '../types/types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface ChatbotProps {
    problem: PhysicsProblem
    parameters: SimulationParameters
}

export default function Chatbot({ problem, parameters }: ChatbotProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            role: 'assistant',
            content: "I can help explain this simulation. Ask about motion, forces, energy, or how a parameter changes the outcome.",
            timestamp: Date.now(),
        },
    ])
    const [input, setInput] = useState('')
    const [isExpanded, setIsExpanded] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const generateFallbackResponse = (question: string): string => {
        const q = question.toLowerCase()
        const domain = problem.domain[0] || 'physics'

        if (q.includes('energy')) {
            return 'Check the energy graph while the animation runs. If losses are not modeled, total energy should stay near constant while kinetic and potential energies trade off.'
        }

        if (q.includes('acceleration') || q.includes('gravity')) {
            const g = parameters.gravity ?? 9.8
            return `Acceleration controls how quickly velocity changes over time. In this setup, gravity is ${g.toFixed(2)} m/s^2.`
        }

        if (q.includes('velocity') || q.includes('speed')) {
            const v0 = parameters.initialVelocity ?? 0
            return `Initial velocity is ${v0.toFixed(2)} m/s. Watch how the velocity graph changes as you adjust related sliders.`
        }

        return `You are exploring a ${domain} simulation. Try asking about acceleration, energy trends, or how changing one parameter affects the trajectory.`
    }

    const fetchAssistantResponse = async (userMessage: string): Promise<string> => {
        const response = await fetch(`${API_BASE_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: userMessage,
                context: {
                    problemText: problem.problemText,
                    domain: problem.domain,
                    objectTypes: problem.objects.map(obj => obj.type),
                    parameters,
                },
            }),
        })

        if (!response.ok) {
            throw new Error('Chat request failed')
        }

        const data = await response.json()
        if (!data?.response || typeof data.response !== 'string') {
            throw new Error('Invalid chat response')
        }

        return data.response
    }

    const handleSend = async () => {
        const trimmed = input.trim()
        if (!trimmed || isLoading) return

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: trimmed,
            timestamp: Date.now(),
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            const response = await fetchAssistantResponse(trimmed)
            const assistantMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response,
                timestamp: Date.now(),
            }
            setMessages(prev => [...prev, assistantMessage])
        } catch (error) {
            const assistantMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: generateFallbackResponse(trimmed),
                timestamp: Date.now(),
            }
            setMessages(prev => [...prev, assistantMessage])
        } finally {
            setIsLoading(false)
        }
    }

    if (!isExpanded) {
        return (
            <button
                onClick={() => setIsExpanded(true)}
                className="fixed bottom-6 right-6 bg-primary-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-primary-700 transition-all hover:scale-105"
            >
                Ask AI Assistant
            </button>
        )
    }

    return (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
                <div>
                    <h3 className="font-semibold">Physics AI Assistant</h3>
                    <p className="text-xs text-primary-100">Context-aware help</p>
                </div>
                <button
                    onClick={() => setIsExpanded(false)}
                    className="text-white hover:text-primary-100 transition-colors"
                >
                    X
                </button>
            </div>

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
                        <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600">
                            Thinking...
                        </div>
                    </div>
                )}
            </div>

            <div className="border-t border-gray-200 p-3">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                void handleSend()
                            }
                        }}
                        placeholder="Ask about the simulation..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    />
                    <button
                        onClick={() => void handleSend()}
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
