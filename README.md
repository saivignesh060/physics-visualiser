# Physics Visualizer

## 1. Project Title
Physics Visualizer

## 2. Description
Physics Visualizer is an AI-assisted educational web application that converts physics problem statements into interactive simulations.

The MVP focuses on motion-based topics (kinematics and dynamics) and provides:
- Natural-language problem input
- Simulation matching and loading
- Real-time animation
- Live graphs for position, velocity, acceleration, and energy
- AI assistant support for concept explanations

## 3. Tech Stack Used
### Frontend
- React 18
- TypeScript
- Vite
- React Router DOM
- Recharts
- Tailwind CSS

### Backend
- Node.js
- Express
- TypeScript
- tsx

### AI Integrations
- Google Gemini API (`@google/generative-ai`)
- Anthropic SDK (`@anthropic-ai/sdk`)

### Tooling
- npm workspaces
- concurrently

## 4. Project Structure
```text
physics-visualizer/
|-- frontend/
|   |-- src/
|   |   |-- api/
|   |   |-- components/
|   |   |-- contexts/
|   |   |-- pages/
|   |   |-- types/
|   |   `-- utils/
|   `-- package.json
|-- backend/
|   |-- src/
|   |   |-- data/
|   |   |-- routes/
|   |   |-- services/
|   |   `-- utils/
|   `-- package.json
|-- images/
|-- package.json
`-- README.md
```

## 5. How to Run the Project
### Prerequisites
- Node.js 18 or later
- npm 9 or later

### Installation
From the project root:

```bash
npm install
```

### Environment Variables
Create a file at `backend/.env`:

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
CLAUDE_API_KEY=your_key_here
```

### Run in Development
From the project root:

```bash
npm run dev
```

This starts:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

### Build
From the project root:

```bash
npm run build
```

## 6. Dependencies
### Root
- `concurrently`

### Frontend
- `react`, `react-dom`
- `react-router-dom`
- `recharts`
- `katex`
- `jspdf`
- `tesseract.js`
- `@anthropic-ai/sdk`

### Backend
- `express`
- `cors`
- `dotenv`
- `bcrypt`
- `jsonwebtoken`
- `pg`
- `@google/generative-ai`
- `@anthropic-ai/sdk`

## 7. Important Instructions
- `GEMINI_API_KEY` is optional for simulation matching and chatbot fallback flows, but required for `POST /api/simulation/generate`.
- Keep `FRONTEND_URL` aligned with the actual frontend origin to avoid CORS errors.
- Authentication in the current MVP is demo-mode (client-side localStorage based).
- The `My Simulations` page in MVP uses mock data and is intended as a protected logged-in experience.
- Run commands from the repository root so workspace scripts resolve correctly.

## 8. Demo Videos of MVP
- Demo video link: `PASTE_GOOGLE_DRIVE_LINK_HERE`

## 9. Demo Images of MVP
### 1. AI Problem Input and Simulation Matching
Shows how users enter a natural-language physics problem and quickly find the best simulation.

![AI Problem Input and Simulation Matching](images/question_enter_img.png)

### 2. Live Graphs with Physics AI Assistant
Shows synchronized motion/energy graphs with parameter controls and an in-context AI assistant panel.

![Live Graphs with Physics AI Assistant](images/graphs_ai_assistnt.png)

### 3. My Simulations Dashboard (Logged-in Users Only)
Shows the saved simulations view with filtering, quick load actions, and summary stats. This feature is only available when the user is logged in.

![My Simulations Dashboard](images/my_simulations.png)

### 4. Projectile Motion Simulation
Shows a projectile trajectory visualization where launch angle and initial velocity can be adjusted to study range and peak height.

![Projectile Motion Simulation](images/projectile_motion.png)

### 5. Inclined Plane with Friction
Shows force balance on an inclined surface with friction effects, helping users observe how slope and friction change acceleration.

![Inclined Plane with Friction](<images/inclined_plane_with _friction.png>)

### 6. Simple Pendulum
Shows periodic pendulum motion with live parameter control, useful for understanding oscillation behavior over time.

![Simple Pendulum](images/simple_pendulum.png)
