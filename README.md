# TriniphiX Node.js Starter

A lightweight Node.js project scaffold for TriniphiX. It ships with a zero-dependency HTTP server, a branded landing page, a health endpoint, and Node's built-in test runner.

## Requirements

- Node.js 20 or newer
- npm 10 or newer

## Getting started

```bash
npm install
npm start
```

The server starts on `http://0.0.0.0:3000` by default. You can override the host and port with environment variables:

```bash
HOST=127.0.0.1 PORT=8080 npm start
```

## Available scripts

- `npm start` - run the TriniphiX HTTP server.
- `npm run dev` - run the server in watch mode for local development.
- `npm test` - run the automated test suite with Node's built-in test runner.

## Project structure

```text
public/          Static assets served by the app
src/app.js       Request handler and route logic
src/server.js    Server entrypoint
test/            Automated tests
```

## Endpoints

- `GET /` - TriniphiX landing page.
- `GET /health` - JSON health check for uptime monitoring.
