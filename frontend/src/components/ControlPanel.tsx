import { SimulationParameters, PhysicsProblem, SimulationTemplate } from '../types/types'
import { formatNumber } from '../utils/physicsEngine'

interface ControlPanelProps {
    parameters: SimulationParameters
    onParameterChange: (key: string, value: number) => void
    onReset: () => void
    problem: PhysicsProblem
    simulation?: SimulationTemplate
}

export default function ControlPanel({ parameters, onParameterChange, onReset, problem, simulation }: ControlPanelProps) {
    // Get parameter definitions from simulation template or use defaults
    const parameterDefs = simulation?.parameterDefinitions || []

    return (
        <div className="physics-card space-y-6 h-fit sticky top-6">
            <div>
                <h2 className="text-lg font-bold text-gray-800 mb-2">Parameters</h2>
                <p className="text-xs text-gray-500">Adjust values to see instant changes</p>
            </div>

            {/* Dynamic parameter controls based on simulation */}
            {parameterDefs.map(param => {
                const value = parameters[param.key] ?? param.min

                return (
                    <div key={param.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {param.label}: <span className="font-semibold text-primary-600">
                                {formatNumber(value)} {param.unit}
                            </span>
                        </label>
                        <input
                            type="range"
                            min={param.min}
                            max={param.max}
                            step={param.step}
                            value={value}
                            onChange={(e) => onParameterChange(param.key, Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{param.min} {param.unit}</span>
                            <span>{param.max} {param.unit}</span>
                        </div>
                    </div>
                )
            })}

            {parameterDefs.length === 0 && (
                <div className="text-sm text-gray-500 text-center py-4">
                    No adjustable parameters for this simulation
                </div>
            )}

            <hr className="border-gray-300" />

            {/* Real-time calculated values */}
            <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Real-Time Values</h3>
                <div className="space-y-2 text-sm bg-gray-50 p-3 rounded-lg">
                    {problem.domain[0] === 'kinematics' && (
                        <>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Initial Velocity:</span>
                                <span className="font-mono font-semibold text-gray-900">
                                    {formatNumber(parameters.initialVelocity ?? 0)} m/s
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Launch Angle:</span>
                                <span className="font-mono font-semibold text-gray-900">
                                    {formatNumber(parameters.angle ?? 0)}°
                                </span>
                            </div>
                            {parameters.initialHeight !== undefined && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Initial Height:</span>
                                    <span className="font-mono font-semibold text-gray-900">
                                        {formatNumber(parameters.initialHeight)} m
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    {parameters.acceleration !== undefined ? 'Acceleration:' : 'Gravity:'}
                                </span>
                                <span className="font-mono font-semibold text-gray-900">
                                    {formatNumber(parameters.acceleration ?? parameters.gravity ?? 9.8)} m/s²
                                </span>
                            </div>
                        </>
                    )}
                    {problem.domain[0] === 'dynamics' && (
                        <>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Mass:</span>
                                <span className="font-mono font-semibold text-gray-900">
                                    {formatNumber(parameters.mass || 1)} kg
                                </span>
                            </div>
                            {parameters.inclineAngle !== undefined && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Incline Angle:</span>
                                    <span className="font-mono font-semibold text-gray-900">
                                        {formatNumber(parameters.inclineAngle)}°
                                    </span>
                                </div>
                            )}
                            {parameters.frictionCoefficient !== undefined && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Friction (μ):</span>
                                    <span className="font-mono font-semibold text-gray-900">
                                        {formatNumber(parameters.frictionCoefficient)}
                                    </span>
                                </div>
                            )}
                            {parameters.tension !== undefined && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tension:</span>
                                    <span className="font-mono font-semibold text-gray-900">
                                        {formatNumber(parameters.tension)} N
                                    </span>
                                </div>
                            )}
                            {parameters.length !== undefined && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Length:</span>
                                    <span className="font-mono font-semibold text-gray-900">
                                        {formatNumber(parameters.length)} m
                                    </span>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <hr className="border-gray-300" />

            {/* Governing Equations - Domain Specific */}
            <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Key Equations</h3>
                <div className="bg-gray-50 p-3 rounded text-xs space-y-1 font-mono">
                    {problem.domain[0] === 'kinematics' && (
                        <>
                            <div>x = v₀t cos(θ)</div>
                            <div>y = v₀t sin(θ) - ½gt²</div>
                            <div>v = √(vₓ² + vᵧ²)</div>
                        </>
                    )}
                    {problem.domain[0] === 'dynamics' && (
                        <>
                            <div>F_net = ma</div>
                            <div>F_friction = μN</div>
                            <div>N = mg cos(θ)</div>
                        </>
                    )}
                </div>
            </div>

            <button
                onClick={onReset}
                className="w-full py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-medium"
            >
                🔄 Reset
            </button>
        </div>
    )
}
