# Synapse: A Modern, Performant Chat-bot

This repository contains the source code for a next-generation, highly performant chatbot frontend, engineered with a cutting-edge technology stack. It leverages the synergistic power of the React and Vite ecosystems to deliver a superior developer experience (DX) and a blazing-fast, responsive user interface.

---

## Table of Contents

- [Core Architecture](#core-architecture--technical-stack)
- [Key Features](#key-features-deep-dive)
- [Project Structure](#project-structure)
- [Local Development Lifecycle](#local-development-lifecycle)
- [Build & Deployment](#build--deployment)
- [Contribution Guidelines](#contribution-guidelines)

## Core Architecture & Technical Stack

This project is built upon a foundation of modern, best-in-class web technologies, chosen for their performance, scalability, and developer ergonomics.

- **UI Framework**: **React**

  - Utilizes a component-driven architecture for building encapsulated, reusable, and stateful UI components. React's declarative paradigm simplifies complex UI logic and enhances predictability.

- **Build Tool & Dev Environment**: **Vite**

  - A next-generation frontend toolchain that provides an exceptionally fast development environment.
  - **Development**: Leverages native ES modules (ESM) in the browser, eliminating the need for a bundling step during development. This results in near-instantaneous server start and Hot Module Replacement (HMR).
  - **Production**: Bundles code with Rollup, which is highly optimized for producing efficient and tree-shaken production builds.

- **Underlying Transpiler/Bundler**: **esbuild**

  - Vite leverages `esbuild` for pre-bundling dependencies and for TypeScript/JSX transpilation. Written in Go, `esbuild` is orders of magnitude faster than traditional JavaScript-based toolchains, forming the core of Vite's performance advantage.

- **Code Quality**: **ESLint**

  - Integrated static code analysis to enforce code style, identify problematic patterns, and maintain a high degree of code quality and consistency across the codebase.

- **Target Environment Configuration**: **Browserslist**
  - Provides a unified configuration to define the target browser matrix. This configuration is consumed by tools like `esbuild` to generate compatible JavaScript and CSS, ensuring a consistent user experience.

## Key Features Deep-Dive

- **Optimized Development Feedback Loop**: Vite's implementation of **Hot Module Replacement (HMR)** provides instantaneous feedback in the browser upon code changes, without requiring a full page reload. This preserves application state and dramatically accelerates the development and debugging process.

- **Performant Production Builds**: The production build pipeline, powered by Rollup and `esbuild`, performs aggressive **tree-shaking** to eliminate unused code, code-splitting to generate lazy-loadable chunks, and minification to ensure the smallest possible bundle sizes for end-users.

- **Extensible Configuration**: The `vite.config.js` file serves as the central hub for project configuration, allowing for deep customization of plugins, build options, server behavior, and module resolution aliasing.

- **Robust File Handling**: The architecture supports advanced asset handling, including glob imports and optimized static asset processing, ensuring efficient delivery of all required resources.

## N8N

- Added N8N with user authentication by sending the required headers from N8n to the backend providing the access to the backend .
- It does so after seeing the logged in user credentials and after verifying it

## Local Development Lifecycle

### Prerequisites

- Node.js (LTS version recommended)
- npm or a compatible package manager (e.g., Yarn, pnpm)

### 1. Installation

Clone the repository and install the project dependencies.

```sh
git clone <repository-url>
cd chatbot-frontend
npm install
```

### 2. Running the Development Server

Execute the following command to start the Vite development server with HMR enabled.

```sh
npm run dev
```

The application will be accessible at `http://localhost:5173` (or the next available port).

### 3. Linting

To run the linter across the entire project, use:

```sh
npm run lint
```

## Build & Deployment

To generate an optimized static build for production environments, run:

```sh
npm run build
```

This command transpiles and bundles all assets into the `dist/` directory. This directory is self-contained and can be deployed to any static hosting provider.

## Contribution Guidelines

We welcome contributions to enhance the platform. Please adhere to the following process:

1.  **Fork** the repository.
2.  Create a new feature branch (`git checkout -b feature/my-new-feature`).
3.  Commit your changes with descriptive commit messages.
4.  Ensure all code passes the linting checks.
5.  Push to your branch (`git push origin feature/my-new-feature`).
6.  Create a new **Pull Request** for review.
