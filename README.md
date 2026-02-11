# Physics Visualizer 🚀

An AI-powered educational platform for visualizing physics concepts through interactive simulations. Built for STEM learning with a focus on motion physics (kinematics and dynamics).

![Physics Visualizer](https://img.shields.io/badge/Physics-Visualizer-blue)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)

## ✨ Features

### 🎯 Static Simulation Library
- **13 Pre-defined Simulations** covering kinematics and dynamics
- **Keyword Matching** - Natural language query to simulation matching
- **Simulation Browser** - Visual catalog with domain filtering
- **oPhysics-Style Layout** - Simulation on left, controls on right, graphs below

### 🔐 Authentication System
- **User Login/Registration** with demo mode
- **Protected Routes** - My Simulations page requires authentication
- **Personalized Experience** - User greeting and saved simulations
- **Persistent Sessions** - LocalStorage-based authentication

### 📊 Interactive Visualizations
- **Real-time Animation** - Smooth 60fps canvas-based physics animations
- **Dynamic Graphs** - Position, velocity, acceleration, and energy graphs
- **Parameter Controls** - Adjust parameters with sliders for instant feedback
- **Simple Representations** - Objects shown as dots/circles with labels

### 🎛️ Available Simulations

**Kinematics (4 simulations):**
- Projectile Motion
- Vertical Projectile Motion
- Free Fall
- Uniform Acceleration in 1D

**Dynamics (5 simulations):**
- Inclined Plane with Friction
- Friction on Horizontal Surface
- Inclined Plane with Pulley (Two Masses)
- Simple Pendulum
- Conical Pendulum

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/physics-visualizer.git
cd physics-visualizer
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Set up environment variables**

Create `.env` file in the `backend` directory:
```env
PORT=3000
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your_api_key_here  # Optional, not used in static mode
```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

Open your browser and navigate to `http://localhost:5173`

## 📖 Usage

### Quick Start
1. **Sign Up** - Create an account (demo mode accepts any credentials)
2. **Enter a Query** - Type a physics problem like "A ball is thrown straight up with a speed of 10 m/s"
3. **Find Simulation** - Click to match your query to a simulation
4. **Load & Explore** - Adjust parameters and watch the simulation update in real-time
5. **Browse Library** - Click "Browse All Simulations" to see all available simulations

### Example Queries
- "A ball is thrown straight up with a speed of 10 m/s" → Vertical Projectile Motion
- "A block slides down a 30° incline with friction" → Inclined Plane with Friction
- "A pendulum swings from 30° angle" → Simple Pendulum
- "A box is pulled across a horizontal surface" → Friction on Horizontal Surface

## 🏗️ Project Structure

```
physics-visualizer/
├── backend/
│   ├── src/
│   │   ├── data/
│   │   │   └── simulationLibrary.ts    # 13 pre-defined simulations
│   │   ├── routes/
│   │   │   └── api.ts                  # API endpoints
│   │   ├── utils/
│   │   │   └── matcher.ts              # Keyword matching algorithm
│   │   └── server.ts                   # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnimationCanvas.tsx     # Physics animation
│   │   │   ├── ControlPanel.tsx        # Dynamic parameter controls
│   │   │   ├── GraphDashboard.tsx      # Real-time graphs
│   │   │   ├── ProblemInput.tsx        # Query input & matching
│   │   │   └── SimulationBrowser.tsx   # Simulation catalog
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx         # Authentication state
│   │   ├── pages/
│   │   │   ├── Home.tsx                # Landing page
│   │   │   ├── Login.tsx               # Login page
│   │   │   ├── Register.tsx            # Registration page
│   │   │   ├── SimulationWorkspace.tsx # Main workspace
│   │   │   ├── MySimulations.tsx       # User's saved simulations
│   │   │   └── Help.tsx                # Help & documentation
│   │   ├── utils/
│   │   │   └── physicsEngine.ts        # Physics calculations
│   │   └── App.tsx                     # Main app with routing
│   └── package.json
└── README.md
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Navigation
- **Recharts** - Graph visualization
- **Canvas API** - Animation rendering
- **Tailwind CSS** - Styling

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **tsx** - TypeScript execution

## 🎨 Design Philosophy

- **Simplicity** - Static library over dynamic AI generation for reliability
- **Education-First** - Clear explanations and real-time parameter manipulation
- **Visual Excellence** - Smooth animations and intuitive UI
- **Accessibility** - Voice input support and keyboard navigation

## 📝 API Endpoints

### Simulations
- `GET /api/simulations` - Get all simulations
- `GET /api/simulations/:id` - Get simulation by ID
- `GET /api/simulations/domain/:domain` - Get simulations by domain (kinematics/dynamics)
- `POST /api/match-simulation` - Match query to simulation

### Health
- `GET /health` - Server health check

## 🧪 Testing

The application includes:
- **13 Working Simulations** - All tested and verified
- **Keyword Matching** - Tested with various queries
- **Authentication Flow** - Login/logout/registration tested
- **Parameter Manipulation** - Real-time updates verified
- **Protected Routes** - Access control tested

## 🚧 Future Enhancements

- [ ] Database integration for persistent user simulations
- [ ] More simulation types (energy, waves, electromagnetism)
- [ ] Collaborative features (share simulations)
- [ ] Mobile app version
- [ ] Advanced physics (numerical integration for large angles)
- [ ] Export simulation data as CSV/JSON

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Vignesh**
- GitHub: [@saivignesh060](https://github.com/saivignesh060)

## 🙏 Acknowledgments

- Inspired by [oPhysics.com](https://ophysics.com) for the layout and simulation approach
- Built for STEM education and hackathon demonstration
- Physics calculations based on classical mechanics principles

---

**Made with ❤️ for physics education**
