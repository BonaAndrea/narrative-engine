# Narrative Engine

An interactive narrative platform / visual novel engine built as a portfolio project.  
Users can read branching stories, make choices that affect variables and flags, and save their progress.

## Tech Stack

**Frontend**
- React 19 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion (scene transitions, stagger animations)
- Zustand (game state management)
- TanStack Query (data fetching)

**Backend**
- ASP.NET Core 9 Web API
- Entity Framework Core 9 + Npgsql
- PostgreSQL
- Swagger / OpenAPI

## Architecture

```
React (Vite) ──► ASP.NET Core Web API ──► PostgreSQL
     │                    │
  Zustand            EF Core Migrations
  TanStack Query     Repository pattern
  Framer Motion
```

The narrative engine is data-driven: stories, scenes and choices are stored in the database as structured JSON. The frontend interprets conditions and applies effects locally for performance, while the backend handles persistence and validation.

## Features

- 📖 Branching narrative system with scenes and choices
- 🔀 Variable and flag system (conditions on choices, effects on selection)
- 💾 Save / Load system with multiple slots per user
- 🎬 Animated scene transitions (fade + blur + stagger)
- 📚 Story library with published stories
- 🏁 Ending screen with playthrough statistics

## Project Structure

```
NarrativeEngine/
├── NarrativeEngine.API/        # ASP.NET Core backend
│   ├── Controllers/            # REST API endpoints
│   ├── Data/                   # DbContext
│   ├── Models/Domain/          # Entity models
│   └── Migrations/             # EF Core migrations
└── narrative-engine-client/    # React frontend
    └── src/
        ├── components/         # Reusable UI components
        ├── pages/              # Route pages
        ├── store/              # Zustand store
        ├── hooks/              # Custom hooks
        ├── services/           # API layer
        └── types/              # TypeScript interfaces
```

## Getting Started

### Prerequisites
- .NET 9 SDK
- Node.js 18+
- Docker Desktop

### 1. Start the database

```bash
docker run --name narrative-db \
  -e POSTGRES_USER=narrativeuser \
  -e POSTGRES_PASSWORD=narrativepass \
  -e POSTGRES_DB=narrativeengine \
  -p 5432:5432 \
  -d postgres:16
```

### 2. Run the backend

```bash
cd NarrativeEngine.API
dotnet ef database update
dotnet run
```

API available at `http://localhost:5059`  
Swagger UI at `http://localhost:5059/swagger`

### 3. Run the frontend

```bash
cd narrative-engine-client
npm install
npm run dev
```

Frontend available at `http://localhost:5173`

## Data Model

```
Story ──► Scene ──► Choice ──► Scene (branching)
            │
          Content[] (paragraphs, dialogues, images)
          Effects[]  (SET_VARIABLE, ADD_FLAG, ...)
          Conditions[] (HAS_FLAG, VARIABLE_EQUALS, ...)
```

Save slots store the full game state as JSON blobs:
variables, flags, visited scenes and choice history.

## Roadmap

- [x] Core narrative engine (scenes, choices, variables, flags)
- [x] Save / Load system
- [x] Animated story player
- [x] Story library
- [x] Ending screen with statistics
- [ ] Authentication system
- [ ] Visual story editor (React Flow)
- [ ] Audio / background image support
- [ ] Deploy (Vercel + Railway)