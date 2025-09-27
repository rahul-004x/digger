# Digger

Digger is an AI-powered search assistant that provides answers with citations. It allows users to ask questions and receive well-sourced, contextually relevant responses.

## Features

- 🔍 AI-powered search with source citations
- 🧠 Contextual conversation memory
- 🔗 Web browsing capabilities with source validation
- 📝 Markdown support with code highlighting and math equations
- 🔐 User authentication via Clerk

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **UI**: Tailwind CSS with Radix UI components
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Clerk
- **API**: tRPC
- **AI**: Leverages AI-SDK for chat completion

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up environment variables (copy `.env.example` to `.env.local` and fill in the values)
4. Set up the database:
   ```bash
   pnpm db:generate
   pnpm db:push
   ```
5. Run the development server:
   ```bash
   pnpm dev
   ```

## Development

- **Database Management**: Use `pnpm db:studio` to access the Drizzle Studio
- **Code Formatting**: Run `pnpm format:write` to format the codebase
- **Linting**: Run `pnpm lint` to check for code issues
- **Type Checking**: Run `pnpm typecheck` to validate TypeScript types

## Deployment

Deploy the application on Vercel or any platform that supports Next.js applications.
