# tlight-ui

![Pipeline Status](https://github.com/Tuhis/tlight-ui/actions/workflows/pipeline.yml/badge.svg)
<!-- COVERAGE_BADGE -->

A modern, dynamic web interface for controlling the **tlight** lighting system. Built with React, Vite, and Redux, this application allows users to manage lighting nodes, configure effects, and orchestrate light shows with a premium user experience.

## Features

*   **Node Management**: Discover and control lighting nodes on your network.
*   **Effect Configuration**: Apply and customize dynamic effects like *SmoothColors*, *Solid*, and more.
*   **Interactive UI**: Responsive design with rich hover effects and fluid animations.
*   **Real-time Updates**: Instant feedback on lighting state changes.

## Tech Stack

*   **Core**: React 19, Redux Toolkit
*   **Build Tool**: Vite
*   **Styling**: Vanilla CSS / CSS Variables for theming
*   **Testing**: Vitest (Unit/Integration), Playwright (E2E)
*   **Containerization**: Docker (Nginx serving production build)

## Prerequisites

*   **Node.js**: v20 or higher
*   **npm**: v10 or higher

## Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Tuhis/tlight-ui.git
    cd tlight-ui
    ```

2.  **Install dependencies**:
    ```bash
    npm ci
    ```

3.  **Start the development server**:
    ```bash
    npm start
    ```
    The application will run at [http://localhost:3000](http://localhost:3000).

## Testing

This project uses a comprehensive testing strategy with **Vitest** for unit/integration tests and **Playwright** for end-to-end testing.

### Unit & Integration Tests
Run the test suite in watch mode:
```bash
npm test
```

Generate a coverage report:
```bash
npm run test:coverage
```

### End-to-End (E2E) Tests
Run the Playwright test suite (headless):
```bash
npm run test:e2e
```

Run E2E tests with UI runner:
```bash
npm run test:e2e:ui
```

## Building for Production

To create a production-ready build:
```bash
npm run build
```
The output will be in the `build/` directory.

### Docker Build
The project includes a multi-stage Dockerfile that builds the React app and serves it with Nginx.

```bash
docker build -t tlight-ui .
docker run -p 8080:8080 tlight-ui
```
Access the containerized app at `http://localhost:8080`.

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment.
*   **On Push/PR**: Runs unit tests, linting, and E2E tests.
*   **Coverage**: Automatically updates the coverage badge in this README.
*   **Deployment**: Builds and pushes the Docker image to GitHub Container Registry (GHCR) on successful master branch builds.

## Project Structure

*   `src/components`: UI components (cards, inputs, layout).
*   `src/slices`: Redux state slices (nodes, effects).
*   `src/actions`: Redux async actions.
*   `e2e`: Playwright test specifications.
*   `vite.config.js`: Vite configuration options.

## TODO / Known Issues

*   Refactor `CardGrids` to reduce code duplication.
