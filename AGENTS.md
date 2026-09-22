# ListShop Extranet - Agent Guide

## Overview
This is a web application (Angular 10) that performs administrative tasks for the ListShop platform. It is designed to run locally and can be pointed to either a local test server or a live production server.

## Project Structure
- `src/app`: Contains the main application logic.
  - `model`: Data models/interfaces.
  - `shared/services`: API interaction services (e.g., `list.service.ts`, `tag.service.ts`).
- `src/environments`: Environment-specific configurations.
- `Dockerfile` & `nginx.conf`: Configuration for containerized deployment.
- `server.ts`: Entry point for Angular Universal (SSR).

## Tech Stack
- **Framework**: Angular 10
- **Language**: TypeScript
- **Styling**: SCSS / Bootstrap 4 / PrimeNG
- **Server-Side Rendering**: Angular Universal / Express
- **Build Tool**: Angular CLI

## Configuration (Local vs. Production)
The application points to different API servers depending on the environment configuration.

### Switching API Servers
To switch the API target, modify `src/environments/environment.ts` or `src/environments/environment.prod.ts`.

- **Live Production Server**: `https://nastyvarmits.fr/api/`
- **Local Test Server**: `http://localhost:8182/`

By default:
- `ng serve` uses `src/environments/environment.ts`.
- `ng build --prod` uses `src/environments/environment.prod.ts` (mapped via `angular.json`).

*Note: Currently, the environment files have both URLs available. Ensure you uncomment the desired `apiUrl` in the relevant environment file before building or serving.*

## Key Commands
- `npm start`: Runs the development server (`ng serve`).
- `npm run build`: Builds the project for production.
- `npm run dev:ssr`: Runs the application with SSR in development mode.
- `npm run test`: Executes unit tests via Karma.
- `npm run lint`: Runs TSLint.

## Development Guidelines
- **API Interaction**: All API calls should be made through services located in `src/app/shared/services`.
- **Environment Variables**: Always use the `environment` constant to access configuration values like `apiUrl`.
- **Models**: Use the interfaces defined in `src/app/model` for type safety.
