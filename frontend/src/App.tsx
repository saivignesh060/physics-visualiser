import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Home from './pages/Home'
import SimulationWorkspace from './pages/SimulationWorkspace'
import MySimulations from './pages/MySimulations'
import Help from './pages/Help'
import Login from './pages/Login'
import Register from './pages/Register'

function AppContent() {
    const [darkMode] = useState(false)
    const { user, logout, isAuthenticated } = useAuth()

    return (
        <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
            <header className="bg-gradient-to-r from-primary-700 to-primary-900 text-white shadow-lg">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                <span className="text-2xl">⚛️</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Physics Visualizer</h1>
                                <p className="text-xs text-primary-100">AI-Powered Learning System</p>
                            </div>
                        </Link>
                        <nav className="flex items-center space-x-6">
                            <Link to="/" className="hover:text-primary-200 transition-colors">Home</Link>
                            <Link to="/workspace" className="hover:text-primary-200 transition-colors">Workspace</Link>
                            {isAuthenticated && (
                                <Link to="/simulations" className="hover:text-primary-200 transition-colors">My Simulations</Link>
                            )}
                            <Link to="/help" className="hover:text-primary-200 transition-colors">Help</Link>

                            {isAuthenticated ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm text-primary-100">👋 {user?.name}</span>
                                    <button
                                        onClick={logout}
                                        className="px-4 py-1.5 bg-white text-primary-700 rounded-lg hover:bg-primary-50 transition-colors text-sm font-medium"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <Link
                                        to="/login"
                                        className="px-4 py-1.5 text-white hover:text-primary-200 transition-colors text-sm font-medium"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="px-4 py-1.5 bg-white text-primary-700 rounded-lg hover:bg-primary-50 transition-colors text-sm font-medium"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </nav>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/workspace" element={<SimulationWorkspace />} />
                    <Route
                        path="/simulations"
                        element={isAuthenticated ? <MySimulations /> : <Navigate to="/login" replace />}
                    />
                    <Route path="/help" element={<Help />} />
                    <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/workspace" replace />} />
                    <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/workspace" replace />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>

            <footer className="bg-gray-800 text-gray-300 py-6 mt-12">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm">© 2026 Physics Visualizer | AI-Powered Educational Technology</p>
                    <p className="text-xs text-gray-400 mt-2">Built with React, TypeScript, and Claude AI</p>
                </div>
            </footer>
        </div>
    )
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    )
}

export default App
