# Remix Task Management App

## Overview
This is a task management application built with Remix, Prisma, and PostgreSQL. It allows users to create, manage, and track tasks efficiently.

## Features
- User-based task management
- Task creation with priority and due date
- Database migrations with Atlas
- ORM operations with Prisma
- Uses Remix for server-side rendering and routing

## Prerequisites
Ensure you have the following installed:
- Node.js (latest LTS recommended)
- pnpm (as the package manager)
- Docker (for database setup, if needed)
- Atlas (for database migrations)

## Installation
1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd <project-folder>
   ```

2. Install dependencies:
   ```sh
   pnpm install
   ```

3. Set up the environment variables:
   - Create a `.env` file in the root directory and define `DATABASE_URL`.

4. Run database migrations:
   ```sh
   pnpm task db:migrate
   ```

5. Start the application:
   ```sh
   pnpm task start
   ```

## Database Management
The project uses Atlas for migrations and Prisma for ORM.

- **Run Migrations**:
  ```sh
  pnpm task db:migrate
  ```
- **Reset Database**:
  ```sh
  pnpm task db:reset
  ```
- **Push Prisma Schema**:
  ```sh
  pnpm task db:push
  ```

## Running in Development Mode
To start the Remix app in development mode:
```sh
pnpm task start
```

## Deployment
For deploying to a production environment, make sure to:
- Use a PostgreSQL database
- Run `pnpm task db:migrate` to apply migrations
- Use a process manager like PM2 or a hosting provider that supports Node.js

## License
This project is licensed under MIT

