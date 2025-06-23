# BizAway Tech Challenge - Trip Planner API

This project is a solution for the BizAway Backend Tech Challenge. It's a robust API built with NestJS to search for trips and manage a personal collection of saved trips.

The application follows modern software architecture principles like Hexagonal Architecture and CQRS to deliver a scalable, maintainable, and testable solution.

## Features

- **Trip Search**: Find trips between two destinations by integrating with a 3rd party API.
- **Smart Sorting**: Sort search results by the `fastest` or `cheapest` options.
- **Performance First**: A caching layer (Redis or in-memory) is implemented for the search functionality to reduce latency on repeated queries and to be mindful of external API rate limits.
- **Trip Management**: Full CRUD (Create, Read, Update, Delete) functionality for saving and managing your favorite trips.
- **Flexible Persistence**: Choose between a `TypeORM` (PostgreSQL) persistence layer or a simple `in-memory` database.
- **API Documentation**: The API is self-documented using Swagger (OpenAPI).
- **Rate Limiting**: The API has a global rate limit of 20 requests per 10 seconds to prevent abuse.

## Architecture

- **Framework**: [NestJS](https://nestjs.com/), a progressive Node.js framework for building efficient, reliable and scalable server-side applications.
- **Architecture Style**: **Hexagonal Architecture (Ports and Adapters)** is used to isolate the core application logic from outside concerns. This makes the domain independent of infrastructural details like databases, caches, or external APIs.
- **Design Pattern**: The **Command and Query Responsibility Segregation (CQRS)** pattern is used to separate write operations (Commands) from read operations (Queries), allowing for independent scaling and optimization of each.
- **Language**: TypeScript

## Prerequisites

- Node.js (v18 or newer recommended)
- NPM, Yarn or PNPM
- Docker & Docker Compose

## Environment Configuration

The project uses a `.env` file to manage environment variables. Before running the application, you need to create a `.env` file in the root of the project.

You can copy the example file:

```bash
cp .env.example .env
```

_Note: You'll need to create the `.env.example` file first with the content below._

### `.env.example`

```dotenv
# Application
NODE_ENV=development
PORT=3000

# Drivers (persistance: 'in-memory' or 'type-orm', cache: 'in-memory', 'noop' or 'redis')
DATABASE_DRIVER=type-orm
CACHE_DRIVER=redis

# External Trips API
API_URL=https://z0qw1e7jpd.execute-api.eu-west-1.amazonaws.com/default/trips
API_KEY=YOUR_API_KEY_HERE # Replace with the API key provided

# PostgreSQL Database (for 'type-orm' driver)
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=bizaway

# Redis (for 'redis' cache driver)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_USERNAME=
REDIS_TTL=3600 # Cache time-to-live in seconds
```

## Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd bizaway-tech-challenge
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

## Running the Application

### With Docker (Recommended)

This is the easiest way to get the application and its dependencies (PostgreSQL, Redis) up and running.

1.  Make sure you have a `.env` file configured (you can use the docker-compose values for hosts e.g. `POSTGRES_HOST=bizaway-database`).
2.  Run the following command:
    `bash
docker-compose up -d --build
`
    The application will be available at `http://localhost:3000`.

### Locally (for Development)

If you prefer to run the application without Docker, you'll need to have your own instances of PostgreSQL and/or Redis running.

1.  Ensure your `.env` file points to your local services.
2.  Run the app in development mode:
    ```bash
    npm run start:dev
    ```

## Running Tests

The project has both unit and end-to-end (e2e) tests.

- **Run all unit tests:**
  ```bash
  npm run test
  ```
- **Run all e2e tests:**
  ```bash
  npm run test:e2e
  ```
  _Note: e2e tests require a running instance of the application and its dependencies._

## API Documentation

The API is documented using Swagger. Once the application is running, you can access the interactive documentation at:

[http://localhost:3000/api/v1/docs](http://localhost:3000/api/v1/docs)

### Main Endpoints

- `GET /api/v1/trips/search`: Searches for trips from an external API.
  - Query Params: `origin` (string), `destination` (string), `sort_by` ('fastest' | 'cheapest').
- `POST /api/v1/trips`: Saves a new trip to the database.
- `GET /api/v1/trips`: Lists all saved trips.
- `GET /api/v1/trips/{id}`: Retrieves a single saved trip by its ID.
- `PUT /api/v1/trips`: Updates a saved trip.
- `DELETE /api/v1/trips`: Deletes a saved trip.

## Design Decisions & Compromises

- **Sorting Strategy**: The external API for searching trips does not support sorting. The current implementation fetches all available trips for a given origin and destination and performs the sorting (`fastest` or `cheapest`) within the application. For very large datasets, this could be memory-intensive, but it's a reasonable trade-off given the API's limitations.
- **Architecture**: The choice of Hexagonal Architecture and CQRS introduces a higher level of abstraction and boilerplate compared to a simpler MVC pattern. This decision was made to favor long-term maintainability, scalability, and testability, which are crucial for enterprise-level applications.
- **Error Handling**: The project includes a basic setup for handling domain-specific exceptions. This could be further improved with more granular error-catching and user-friendly error responses.
- **Configuration**: The persistence and caching layers are dynamically configurable via environment variables. This provides great flexibility for different environments (development, testing, production) without changing the code.
