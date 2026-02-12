# Physics Visualizer

Physics Visualizer is an AI-assisted educational web app for exploring motion physics through interactive simulations.  
It focuses on kinematics and dynamics with a static simulation library, real-time animation, and live graphs.

## Current Status

- Monorepo with `frontend` (React + TypeScript + Vite) and `backend` (Express + TypeScript)
- Static simulation library served from backend API
- Simulation matching via Gemini (when configured) with robust local keyword fallback
- Real-time canvas animation and graph dashboard in the frontend

## Features

### Simulation Workflow

- Natural-language query input
- Query-to-simulation matching
- One-click simulation load
- Parameter sliders with instant regeneration of simulation data
- Play/pause animation and reset controls

### Visualization

- Canvas-based animation
- Position, velocity, acceleration, and energy graphs
- Domain-specific scene renderers (projectile, incline, pulley, pendulum, block systems)

### Auth and App Structure

- Login and registration pages
- Protected "My Simulations" route
- Workspace for simulation interaction
- Help page and chatbot UI

## Simulation Library

The project currently includes 10 simulations.

### Kinematics (4)

1. Projectile Motion
2. Vertical Projectile Motion
3. Free Fall
4. Uniform Acceleration in 1D

### Dynamics (6)

1. Block on Block Friction
2. Inclined Plane with Friction
3. Friction on Horizontal Surface
4. Inclined Plane with Pulley (Two Masses)
5. Simple Pendulum
6. Conical Pendulum

## Recent Updates

- Fixed Free Fall animation/data progression
- Added and exposed `initialHeight` and `initialVelocity` for Free Fall
- Fixed Uniform Acceleration in 1D motion progression
- Added explicit `acceleration` parameter handling for Uniform 1D
- Improved block-on-block discoverability in simulation matching
- Improved backend match fallback behavior when Gemini is unavailable or fails

## Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- React Router
- Recharts
- Tailwind CSS

### Backend

- Node.js
- Express
- TypeScript
- tsx (dev runner)

## Project Structure

```text
physics-visualizer/
|-- backend/
|   |-- src/
|   |   |-- data/
|   |   |   `-- simulationLibrary.ts
|   |   |-- routes/
|   |   |   `-- api.ts
|   |   |-- services/
|   |   |   `-- geminiService.ts
|   |   |-- utils/
|   |   |   `-- matcher.ts
|   |   `-- server.ts
|   `-- package.json
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- types/
|   |   `-- utils/
|   `-- package.json
|-- package.json
`-- README.md
```

## Prerequisites

- Node.js 18+
- npm 9+

## Installation

From repository root:

```bash
npm install
```

## Environment Variables

Create `backend/.env`:

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
```

Notes:

- `GEMINI_API_KEY` is optional.  
  If missing, the app still works using local keyword-based matching.
- `FRONTEND_URL` must match your frontend origin for CORS.

## Running Locally

From repository root:

```bash
npm run dev
```

This runs:

- Backend at `http://localhost:3000`
- Frontend at `http://localhost:5173`

## Build

From repository root:

```bash
npm run build
```

## API Endpoints

### Simulations

- `GET /api/simulations`
- `GET /api/simulations/:id`
- `GET /api/simulations/domain/:domain` where domain is `kinematics` or `dynamics`
- `POST /api/match-simulation`

### Health

- `GET /health`

## Example Queries

- `A ball is thrown straight up with a speed of 10 m/s`
- `An object falls from 100 m under gravity`
- `Object moving with constant acceleration in one dimension`
- `A block slides down a 30 deg incline with friction`
- `A 2 kg block is on top of a 4 kg block and the lower block is pulled with 20 N force`

## Deployment

- Frontend deployment guide: `VERCEL_DEPLOYMENT.md`
- Render configuration is included in `render.yaml`

## Contributing

1. Create a feature branch
2. Make changes with tests/build passing
3. Open a pull request

## License

MIT

## Author

- Vignesh
- GitHub: `@saivignesh060`
