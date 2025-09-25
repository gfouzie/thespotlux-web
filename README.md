# Spotlux Frontend

## Environment Setup

Create a `.env.local` file in the root directory with:

```bash
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Environment
NODE_ENV=development
```

## Available Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Start production server
npm start

# Lint
npm run lint
```

## API Configuration

The app uses environment variables for API endpoints:

- **Development**: `http://localhost:8000` (default)
- **Production**: Set `NEXT_PUBLIC_API_URL` to your production API URL

API configuration is centralized in `src/lib/config.ts` and utilities are in `src/lib/api.ts`.

## Environment Variables

| Variable              | Description          | Default                 |
| --------------------- | -------------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000` |
| `NODE_ENV`            | Environment mode     | `development`           |
