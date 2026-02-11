import { useState, useCallback } from 'react'
import ProblemInput from '../components/ProblemInput'
import SimulationBrowser from '../components/SimulationBrowser'
import AnimationCanvas from '../components/AnimationCanvas'
import GraphDashboard from '../components/GraphDashboard'
import ControlPanel from '../components/ControlPanel'
import { PhysicsProblem, SimulationParameters, GraphDataPoint, SimulationTemplate } from '../types/types'
import { generateSimulationData } from '../utils/physicsEngine'

export default function SimulationWorkspace() {
    const [currentView, setCurrentView] = useState<'input' | 'browser' | 'simulation'>('input')
    const [simulation, setSimulation] = useState<SimulationTemplate | null>(null)
    const [problem, setProblem] = useState<PhysicsProblem | null>(null)
    const [parameters, setParameters] = useState<SimulationParameters>({
        initialVelocity: 10,
        angle: 45,
        gravity: 9.8,
        mass: 1,
    })
    const [graphData, setGraphData] = useState<GraphDataPoint[]>([])
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)

    const loadSimulation = useCallback((simTemplate: SimulationTemplate) => {
        console.log('Loading simulation:', simTemplate.name)
        setSimulation(simTemplate)

        // Convert simulation template to PhysicsProblem format
        const newProblem: PhysicsProblem = {
            problemText: simTemplate.description,
            domain: [simTemplate.domain],
            objects: [{
                id: 'obj_1',
                type: simTemplate.objectType,
                mass: simTemplate.defaultParameters.mass || 1,
                position: { x: 0, y: 0 },
                velocity: {
                    x: (simTemplate.defaultParameters.initialVelocity || 0) *
                        Math.cos((simTemplate.defaultParameters.angle || 0) * Math.PI / 180),
                    y: (simTemplate.defaultParameters.initialVelocity || 0) *
                        Math.sin((simTemplate.defaultParameters.angle || 0) * Math.PI / 180)
                },
                acceleration: { x: 0, y: -(simTemplate.defaultParameters.gravity || 9.8) },
                color: '#f59e0b',
                label: simTemplate.objectType === 'block' ? 'Block' :
                    simTemplate.objectType === 'pendulum' ? 'Bob' : 'Ball',
                metadata: simTemplate.defaultParameters
            }],
            environment: {
                gravity: simTemplate.defaultParameters.gravity || 9.8,
                airResistance: false,
                ...simTemplate.defaultParameters
            },
            timeRange: [0, 'auto'],
        }

        setProblem(newProblem)
        setParameters(simTemplate.defaultParameters as SimulationParameters)

        // Generate simulation data
        const data = generateSimulationData(newProblem, simTemplate.defaultParameters as SimulationParameters)
        setGraphData(data)
        setCurrentTime(0)
        setCurrentView('simulation')
    }, [])

    const handleParameterChange = useCallback((key: string, value: number) => {
        if (!simulation || !problem) return

        const newParams = { ...parameters, [key]: value }
        setParameters(newParams)

        // Regenerate simulation data
        const data = generateSimulationData(problem, newParams)
        setGraphData(data)
        setCurrentTime(0)
    }, [simulation, problem, parameters])

    const handleReset = useCallback(() => {
        setCurrentTime(0)
        setIsPlaying(false)
    }, [])

    const handleNewSimulation = () => {
        setCurrentView('input')
        setSimulation(null)
        setProblem(null)
        setGraphData([])
        setIsPlaying(false)
        setCurrentTime(0)
    }

    return (
        <div className="space-y-6">
            {/* Input/Browser View */}
            {currentView === 'input' && (
                <div className="physics-card">
                    <ProblemInput
                        onSimulationSelected={loadSimulation}
                        onBrowseClick={() => setCurrentView('browser')}
                    />
                </div>
            )}

            {currentView === 'browser' && (
                <div className="physics-card">
                    <button
                        onClick={() => setCurrentView('input')}
                        className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        ← Back to Search
                    </button>
                    <SimulationBrowser onSelectSimulation={loadSimulation} />
                </div>
            )}

            {/* Simulation View */}
            {currentView === 'simulation' && simulation && problem && (
                <>
                    {/* Header with simulation info */}
                    <div className="physics-card">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">{simulation.name}</h2>
                                <p className="text-gray-600 mt-1">{simulation.description}</p>
                            </div>
                            <button
                                onClick={handleNewSimulation}
                                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                            >
                                New Simulation
                            </button>
                        </div>
                    </div>

                    {/* Main simulation area - oPhysics style layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left: Animation (2/3 width) */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="physics-card">
                                <AnimationCanvas
                                    graphData={graphData}
                                    isPlaying={isPlaying}
                                    onPlayPauseToggle={() => setIsPlaying(!isPlaying)}
                                    currentTime={currentTime}
                                    onTimeUpdate={setCurrentTime}
                                    parameters={parameters}
                                />
                            </div>

                            {/* Graphs below animation */}
                            <div className="physics-card">
                                <GraphDashboard
                                    data={graphData}
                                    currentTime={currentTime}
                                />
                            </div>
                        </div>

                        {/* Right: Control Panel (1/3 width) */}
                        <div className="lg:col-span-1">
                            <ControlPanel
                                parameters={parameters}
                                onParameterChange={handleParameterChange}
                                onReset={handleReset}
                                problem={problem}
                                simulation={simulation}
                            />
                        </div>
                    </div>

                    {/* Explanation section */}
                    <div className="physics-card bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">📚 Physics Explanation</h3>
                        <p className="text-blue-800">{simulation.explanation}</p>
                    </div>
                </>
            )}
        </div>
    )
}
