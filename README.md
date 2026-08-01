# FlowForge AI

AI-assisted project management platform for software development organizations.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS v4, React Router, Axios, Zustand
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Language:** JavaScript only (no TypeScript)
- **Monorepo:** npm workspaces

## Prerequisites

- Node.js 22+
- npm 10+
- MongoDB

## Getting Started

```bash
# Install all dependencies
npm install

# Create environment files
cp server/.env.example server/.env
cp client/.env.example client/.env

# Start both frontend and backend
npm run dev
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both client and server |
| `npm run dev:client` | Start frontend only |
| `npm run dev:server` | Start backend only |
| `npm run build` | Build frontend for production |
| `npm run lint` | Lint both client and server |
| `npm run format` | Format code with Prettier |

## Project Structure

```
FlowForge-AI/
├── client/          # React frontend
├── server/          # Express backend
├── docs/            # Project documentation
├── .gitignore
├── .prettierrc
├── .prettierignore
├── README.md
└── package.json
```

## Documentation

See the [docs/](./docs/) directory for detailed documentation:

- [Project Bible](./docs/Project-Bible.md)
- [Requirements](./docs/Requirements.md)
- [Architecture](./docs/Architecture.md)
- [Database](./docs/Database.md)
- [API](./docs/API.md)
- [Development Roadmap](./docs/Development-Roadmap.md)

## License

Private — All rights reserved.
