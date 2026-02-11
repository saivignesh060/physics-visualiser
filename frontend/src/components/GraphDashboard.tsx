import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { GraphDataPoint } from '../types/types'

interface GraphDashboardProps {
    data: GraphDataPoint[]
    currentTime: number
}

export default function GraphDashboard({ data, currentTime }: GraphDashboardProps) {
    // Find current data point
    const currentIndex = Math.floor(currentTime / 0.02)
    const currentData = data.slice(0, Math.max(currentIndex, 1))

    return (
        <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Live Graphs</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Position vs Time */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Position vs Time</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={currentData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="time"
                                label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis
                                label={{ value: 'Position (m)', angle: -90, position: 'insideLeft' }}
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{ fontSize: 12, backgroundColor: 'rgba(255,255,255,0.95)' }}
                                formatter={(value: number) => value.toFixed(2)}
                            />
                            <Legend wrapperStyle={{ fontSize: 12 }} />
                            <Line
                                type="monotone"
                                dataKey="positionX"
                                stroke="#3b82f6"
                                name="X Position"
                                dot={false}
                                strokeWidth={2}
                            />
                            <Line
                                type="monotone"
                                dataKey="positionY"
                                stroke="#10b981"
                                name="Y Position"
                                dot={false}
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Velocity vs Time */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Velocity vs Time</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={currentData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="time"
                                label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis
                                label={{ value: 'Velocity (m/s)', angle: -90, position: 'insideLeft' }}
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{ fontSize: 12, backgroundColor: 'rgba(255,255,255,0.95)' }}
                                formatter={(value: number) => value.toFixed(2)}
                            />
                            <Legend wrapperStyle={{ fontSize: 12 }} />
                            <Line
                                type="monotone"
                                dataKey="velocityX"
                                stroke="#8b5cf6"
                                name="Vx"
                                dot={false}
                                strokeWidth={2}
                            />
                            <Line
                                type="monotone"
                                dataKey="velocityY"
                                stroke="#ec4899"
                                name="Vy"
                                dot={false}
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Energy vs Time */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Energy vs Time</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={currentData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="time"
                                label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis
                                label={{ value: 'Energy (J)', angle: -90, position: 'insideLeft' }}
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{ fontSize: 12, backgroundColor: 'rgba(255,255,255,0.95)' }}
                                formatter={(value: number) => value.toFixed(2)}
                            />
                            <Legend wrapperStyle={{ fontSize: 12 }} />
                            <Line
                                type="monotone"
                                dataKey="kineticEnergy"
                                stroke="#f59e0b"
                                name="KE"
                                dot={false}
                                strokeWidth={2}
                            />
                            <Line
                                type="monotone"
                                dataKey="potentialEnergy"
                                stroke="#06b6d4"
                                name="PE"
                                dot={false}
                                strokeWidth={2}
                            />
                            <Line
                                type="monotone"
                                dataKey="totalEnergy"
                                stroke="#ef4444"
                                name="Total"
                                dot={false}
                                strokeWidth={2}
                                strokeDasharray="5 5"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Acceleration vs Time */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Acceleration vs Time</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={currentData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="time"
                                label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis
                                label={{ value: 'Acceleration (m/s²)', angle: -90, position: 'insideLeft' }}
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{ fontSize: 12, backgroundColor: 'rgba(255,255,255,0.95)' }}
                                formatter={(value: number) => value.toFixed(2)}
                            />
                            <Legend wrapperStyle={{ fontSize: 12 }} />
                            <Line
                                type="monotone"
                                dataKey="accelerationX"
                                stroke="#14b8a6"
                                name="Ax"
                                dot={false}
                                strokeWidth={2}
                            />
                            <Line
                                type="monotone"
                                dataKey="accelerationY"
                                stroke="#fb923c"
                                name="Ay"
                                dot={false}
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
