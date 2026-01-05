# Hello World Agent

A simple demonstration agent built with Claude Agent SDK that greets users and shares fun facts.

## Setup

```bash
npm install
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
```

## Run

```bash
# Development
npm run dev

# CLI
npm run agent "Hello!"

# Production
npm run build
npm start
```

## Deploy

```bash
fly launch
fly secrets set ANTHROPIC_API_KEY=your-key
fly deploy
```

Visit the web UI at http://localhost:3002
