# How to run

## Install dependencies

Run `npm install` to install project dependencies.

## Development

Look at `config.ts` for more details about available options and their default values. Do not forget to configure environment variables as they are essential for server to run properly.

Run `npm run dev` to start the server with `ts-node` and **without** watching for file changes; note that this requires to have `ts-node` installed globally - install it with command `npm install -g ts-node`.

Run `npm run dev:watch` to start the server with `ts-node-dev` and **with** watching for file changes; note that this requires to have `ts-node-dev` installed globally - install it with command `npm install -g ts-node-dev`.

## Build

Run `npm run build` to create dist folder `dist` containing all compiled files.

# Endpoints

This server provides **REST** and **WS** support; WS is configured to accept connection on all routes. Http server port can be configured.

**POST /convert** - creates a new record in conversion storage and emits update message to all connected clients

**GET /healthcheck** - get server status (availability to properly handle requests)

**GET /rate** - get conversion rate between two currencies

**GET /rates** - get all conversion rates for selected currency

**GET /symbols** - get all currency symbols known to the server

# Services

**currencyService** - implements exposed currency operations and delegates commands to other services

**eventService** - implements possibility to broadcast internal messages between connected clients, based on publish subscribe pattern

**fetchService** - implements currency data gatherer provided by 3rd party services

**storageService** - implements database connector to store or retrieve persistent data
