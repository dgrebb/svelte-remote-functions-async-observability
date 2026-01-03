# SvelteKit Remote Functions with OpenTelemetry Observability

A proof-of-concept demonstrating SvelteKit's experimental **remote functions** feature with **OpenTelemetry observability** baked in. This project showcases how to create type-safe, async server functions that can be called directly from Svelte components while maintaining full observability through distributed tracing.

## Overview

This POC combines:

- **SvelteKit Remote Functions** (`query()` API) - Server functions callable directly from components
- **OpenTelemetry** - Distributed tracing and observability
- **Async/Await in Components** - Native async support in Svelte 5
- **Type Safety** - End-to-end TypeScript types from server to client

Remote functions allow you to call server-side code directly from your components with full type safety and automatic serialization. OpenTelemetry provides visibility into the performance and behavior of these calls through distributed tracing.

## Features

- ✅ **Remote Functions** - Type-safe server functions callable from components
- ✅ **OpenTelemetry Integration** - Automatic instrumentation and custom spans
- ✅ **Distributed Tracing** - Track requests across your application
- ✅ **Async Components** - Native async/await support in Svelte 5
- ✅ **Database Integration** - PostgreSQL with Drizzle ORM
- ✅ **Authentication** - Better Auth integration
- ✅ **Observability UI** - Grafana OTEL-LGTM stack for visualization

## Prerequisites

- Node.js 18+ (with pnpm recommended)
- Docker and Docker Compose
- PostgreSQL (via Docker Compose)

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Database and Observability Stack

Start the PostgreSQL database:

```bash
pnpm db:start
```

Start the OpenTelemetry observability stack (Grafana, Loki, Tempo, Prometheus):

```bash
docker compose -f otel/docker-compose.yaml up -d
```

The Grafana UI will be available at <http://localhost:3030> for viewing traces, logs, and metrics.

### 3. Setup Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://root:mysecretpassword@localhost:5432/local
PUBLIC_OBSERVABILITY_ENABLED=true
```

### 4. Setup Database

Push the database schema:

```bash
pnpm db:push
```

### 5. Run Development Server

```bash
pnpm dev
```

The application will be available at <http://localhost:5173>

To run without observability:

```bash
pnpm dev:no-otel
```

## Project Structure

```text
src/
├── instrumentation.server.ts     # OpenTelemetry SDK initialization
├── routes/
│   ├── admin/
│   │   ├── posts.remote.ts       # Example remote function
│   │   └── +page.svelte          # Component using remote function
│   └── ...
└── lib/
    └── server/
        ├── db/                    # Database schema and connection
        └── observability/
            └── withSpan.ts        # Utility for creating custom spans
```

## Usage

### Creating Remote Functions

Remote functions are created using the `query()` API from `$app/server`:

```typescript
// src/routes/admin/posts.remote.ts
import { query } from '$app/server';
import { db } from '$lib/server/db';
import { withSpan } from '$lib/server/observability/withSpan';

export const getAllPosts = query(async () => {
    return withSpan('rf:getAllPosts', async () => {
        const posts = await db.query.post.findMany();
        return posts;
    });
});
```

### Using Remote Functions in Components

Remote functions can be called directly in Svelte components with full type safety:

```svelte
<script lang="ts">
    import { getAllPosts } from './posts.remote';

    // Remote functions return promises - use with #await blocks
</script>

{#await getAllPosts()}
    <p>Loading posts...</p>
{:then posts}
    {#each posts as post}
        <li>{post.title}</li>
    {/each}
{:catch error}
    <p>Error: {error.message}</p>
{/await}
```

### Adding Observability

Use the `withSpan()` utility to add custom spans for observability:

```typescript
import { withSpan } from '$lib/server/observability/withSpan';

export const myRemoteFunction = query(async (id: string) => {
    return withSpan('rf:myRemoteFunction', async () => {
        // Your function logic here
        // This will create a span in OpenTelemetry
    }, {
        'function.id': id,  // Custom attributes
        'function.type': 'remote'
    });
});
```

The `withSpan()` function:

- Creates a new OpenTelemetry span for the function execution
- Automatically handles errors and sets span status
- Records exceptions when errors occur
- Respects the `PUBLIC_OBSERVABILITY_ENABLED` environment variable

## Observability

### Architecture

The observability stack uses **OpenTelemetry** for instrumentation and the **Grafana OTEL-LGTM** (OpenTelemetry, Loki, Grafana, Tempo, Mimir/Prometheus) stack for visualization and storage.

**Application Side:**

- **OpenTelemetry SDK** - Instrumentation and span creation in `src/instrumentation.server.ts`
- **OTLP Exporter** - Exports traces via OTLP (OpenTelemetry Protocol) to the collector on port `4318`
- **Auto-instrumentations** - Automatically instruments Node.js HTTP, database, and other operations

**Observability Stack (`otel/docker-compose.yaml`):**

The stack uses the `grafana/otel-lgtm` Docker image, which packages together:

- **Grafana** - Visualization and dashboards (accessible at <http://localhost:3030>)
- **Loki** - Log aggregation and querying
- **Tempo** - Distributed tracing backend that receives OpenTelemetry traces
- **Prometheus/Mimir** - Metrics storage and querying
- **Pyroscope** - Continuous profiling (included but not currently used in this POC)

The OpenTelemetry collector receives traces on port `4318` (OTLP/gRPC) and `4317` (OTLP/HTTP) and forwards them to Tempo for storage. Grafana queries Tempo to visualize traces.

### OpenTelemetry Configuration

OpenTelemetry is initialized in `src/instrumentation.server.ts` when SvelteKit starts (via the `instrumentation.server` experimental feature). The SDK is configured to:

- Send traces to `http://localhost:4318/v1/traces` using OTLP Protocol Buffers
- Use service name `sveltekit` for all spans
- Enable auto-instrumentations for Node.js libraries (HTTP, database, etc.)

### Viewing Traces

1. Start the observability stack: `docker compose -f otel/docker-compose.yaml up -d`
2. Access Grafana at <http://localhost:3030>
3. Execute remote functions in your application
4. View traces in the Grafana Explore view (select Tempo as the data source)

### Custom Spans

Custom spans are created using the `withSpan()` utility. Spans include:

- Function name as the span name
- Custom attributes (tags)
- Error tracking
- Execution timing

### Disabling Observability

Set `PUBLIC_OBSERVABILITY_ENABLED=false` in your `.env` file or use:

```bash
pnpm dev:no-otel
```

When disabled, `withSpan()` will execute the function without creating spans, ensuring no performance overhead.

## Configuration

### SvelteKit Configuration

The project requires these experimental features in `svelte.config.js`:

```javascript
kit: {
  experimental: {
    remoteFunctions: true,      // Enable remote functions
    tracing: {
      server: true              // Enable server-side tracing
    },
    instrumentation: {
      server: true              // Enable instrumentation hook
    }
  }
},
compilerOptions: {
  experimental: {
    async: true                 // Enable async components
  }
}
```

### OpenTelemetry Setup

OpenTelemetry configuration is detailed in the [Observability](#observability) section above. The SDK is initialized in `src/instrumentation.server.ts` and automatically loaded by SvelteKit when the `instrumentation.server` experimental feature is enabled.

## Database

The project uses **PostgreSQL** with **Drizzle ORM** for type-safe database queries. Drizzle provides TypeScript-first database tooling with excellent type inference and a lightweight query builder.

### Database Setup

The database schema is defined in `src/lib/server/db/schema.ts` using Drizzle's declarative API. The schema file exports table definitions and relations that Drizzle uses to generate TypeScript types and SQL migrations.

### Database Commands

- **`pnpm db:start`** - Starts the PostgreSQL database using Docker Compose. The database runs on `localhost:5432` with credentials defined in `compose.yaml`.
- **`pnpm db:push`** - Pushes schema changes directly to the database (useful for development). This command compares your schema file with the database and applies differences without generating migration files.
- **`pnpm db:studio`** - Opens Drizzle Studio, a visual database browser. Access it at the URL shown in the terminal to explore tables, run queries, and view data.
- **`pnpm db:generate`** - Generates migration files based on schema changes (for production workflows).
- **`pnpm db:migrate`** - Runs pending migration files against the database.

### Database Schema

The schema (`src/lib/server/db/schema.ts`) defines the following tables:

- **`user`** - User accounts with email, name, role, and ban status
- **`session`** - User sessions with tokens, expiration, and metadata
- **`account`** - OAuth/provider accounts linked to users
- **`verification`** - Email verification and password reset tokens
- **`post`** - Blog posts with title, slug, body, and author reference

Relations are defined using Drizzle's `relations()` API, enabling type-safe joins and nested queries. For example, users can have many sessions and accounts, and posts reference their author.

### How Schema.ts Works

The schema file uses Drizzle's table definition API:

```typescript
export const user = pgTable('user', {
    id: text('id').primaryKey(),
    email: text('email').notNull().unique(),
    // ... other fields
});
```

Each table is defined with column types (e.g., `text()`, `timestamp()`, `boolean()`), constraints (e.g., `.primaryKey()`, `.notNull()`, `.unique()`), and relationships using `.references()`. Drizzle infers TypeScript types from these definitions, ensuring type safety throughout your application.

The database connection is established in `src/lib/server/db/index.ts`, which creates a Drizzle instance with the schema, enabling typed queries like `db.query.user.findMany()`.

## Authentication

The project uses **Better Auth** for authentication, a modern authentication library with built-in support for multiple providers, session management, and admin features.

### Better Auth Configuration

Better Auth is configured in `src/lib/auth.ts`:

```typescript
export const auth = betterAuth({
    emailAndPassword: {
        enabled: true
    },
    database: drizzleAdapter(db, {
        provider: 'pg'
    }),
    plugins: [admin()]
});
```

### Authentication Features

- **Email/Password Authentication** - Traditional email and password sign-up and login
- **Drizzle Integration** - Uses the Drizzle adapter to store auth data in PostgreSQL
- **Admin Plugin** - Enables admin functionality for user management
- **Session Management** - Handles sessions, tokens, and security automatically
- **Type Safety** - Full TypeScript support with inferred types

### Auth Client

The client-side auth is configured in `src/lib/auth-client.ts` using Better Auth's Svelte integration. It provides reactive auth state and methods that work seamlessly with SvelteKit's server-side rendering.

### Protected Routes

Routes can be protected using SvelteKit's layout server files. The `(protected)` route group checks for authenticated sessions and redirects unauthenticated users.

Auth is integrated into SvelteKit's hooks (`src/hooks.server.ts`) using the `svelteKitHandler` from Better Auth, which handles all auth-related requests automatically.

## Development

### Available Scripts

```bash
pnpm dev              # Start dev server with observability
pnpm dev:no-otel      # Start dev server without observability
pnpm build            # Build for production
pnpm preview          # Preview production build
pnpm check            # Type check
pnpm lint             # Lint code
pnpm format           # Format code
```

### (Optional) SSL Certificate in `dev` Mode

This can be accomplished by creating a local certificate authority and generating

1. [Install `mkcert`](https://github.com/FiloSottile/mkcert?tab=readme-ov-file#installation)
2. Create and install the local certificate authority:

    ```shell
    mkcert -install
    Created a new local CA 💥
    The local CA is now installed in the system trust store! ⚡️
    The local CA is now installed in the Firefox trust store (requires browser restart)! 🦊
    ```

3. Create a certificate for the application:

    ```shell
    cd svelte-remote-functions-async-observability
    mkcert -key-file cert/key.pem -cert-file cert/cert.pem localhost
    ```

    *Note:* The `./cert` directory is excluded from tracking via `.gitignore`.

4. Update `vite.config.ts`

    ```javascript
    import { sveltekit } from '@sveltejs/kit/vite';
    import { defineConfig } from 'vite';
    import fs from 'fs';

    export default defineConfig({
        // ...
        plugins: [sveltekit()],
        server: {
            https: {
                key: fs.readFileSync(`${__dirname}/cert/key.pem`),
                cert: fs.readFileSync(`${__dirname}/cert/cert.pem`)
            },
            proxy: {} // Note that proxy is needed — with or without options
        }
        // ...
    });
    ```

5. Restart the application:

```shell
◄ 1h6m25s ○ pnpm dev

...

  VITE v7.3.0  ready in 341 ms

  ➜  Local:   https://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

## Technologies

- **SvelteKit** - Full-stack framework
- **Svelte 5** - UI framework with runes and async components
- **OpenTelemetry** - Observability framework
- **Drizzle ORM** - Type-safe SQL ORM
- **PostgreSQL** - Database
- **Better Auth** - Authentication
- **TypeScript** - Type safety
- **Docker Compose** - Local development environment

## Limitations

This is a proof-of-concept demonstrating experimental SvelteKit features:

- Remote functions are **experimental** and may change
- Async components require Svelte 5 with experimental flags
- Some features may not be production-ready

## License

MIT
