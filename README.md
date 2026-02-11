# AI-Powered Physics Visualization System

An educational web platform that transforms physics word problems into interactive visual simulations using AI.

## 🚀 Features

- **AI-Powered Problem Parsing**: Input physics problems in natural language
- **Interactive Visualizations**: Real-time animations with vector overlays
- **Live Graphs**: Position, velocity, acceleration, and energy plots
- **Parameter Manipulation**: Adjust values with sliders and see instant changes
- **AI Chatbot**: Get explanations and guidance powered by Claude
- **Physics Domains**: Kinematics (projectile motion, free fall)

## 📦 Project Structure

```
vch/
├── frontend/          # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Main pages
│   │   ├── utils/        # Physics engine & helpers
│   │   └── types/        # TypeScript definitions
│   └── package.json
├── backend/           # Node.js + Express API
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # Claude AI integration
│   │   └── server.ts     # Express server
│   └── package.json
└── package.json       # Root workspace config
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Anthropic API key (get from https://console.anthropic.com/)

### Installation

1. **Install dependencies:**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   # In the backend directory, edit .env file
   cd backend
   # Add your Claude API key to .env:
   # CLAUDE_API_KEY=your_api_key_here
   ```

3. **Start development servers:**

   **Option A - Run both servers:**
   ```bash
   # From root directory
   npm run dev
   ```

   **Option B - Run separately:**
   ```bash
   # Terminal 1 - Frontend
   cd frontend
   npm run dev

   # Terminal 2 - Backend
   cd backend
   npm run dev
   ```

4. **Open browser:**
   - Navigate to `http://localhost:5173`
   - Backend API runs on `http://localhost:3000`

## 🎯 Usage

1. **Enter a physics problem:**
   - "A ball is thrown at 15 m/s at a 30° angle"
   - "A projectile is launched at 20 m/s at 45°"

2. **Watch the simulation:**
   - See the animated trajectory
   - View real-time graphs
   - Toggle vector visualization

3. **Adjust parameters:**
   - Use sliders to change initial velocity, angle, gravity, mass
   - See instant updates in animation and graphs

4. **Ask the AI chatbot:**
   - "Why does the ball come back down?"
   - "What happens at maximum height?"
   - "How does angle affect range?"

## 🧪 Current Capabilities (MVP)

- ✅ Text input for physics problems
- ✅ Projectile motion simulations
- ✅ Real-time parameter manipulation
- ✅ 4 synchronized graphs (position, velocity, acceleration, energy)
- ✅ Vector visualization (velocity, acceleration)
- ✅ AI chatbot for explanations
- ✅ Calculated values (max height, range, time of flight)

## 🔮 Coming Soon (Future Phases)

- Voice and image input
- More physics domains (dynamics, energy, waves, electromagnetism)
- Save and share simulations
- PDF report export
- User accounts
- Multi-object scenarios
- 3D visualizations

## 🏗️ Technology Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Recharts (graphs)
- Canvas API (animations)

**Backend:**
- Node.js + Express
- Claude AI (Anthropic SDK)
- TypeScript

## 📝 License

ISC

## 🙏 Acknowledgments

- Built with Claude AI (Sonnet 4.5)
- Inspired by PhET Interactive Simulations
- PRD provided by user specifications

---

**Need help?** Check the implementation plan in the `brain/` directory for technical details.
