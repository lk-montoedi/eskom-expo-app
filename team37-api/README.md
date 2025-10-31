# Team 37 API

This is the backend API for the Team 37 project.

## Installation

To get the API running locally, follow these steps:

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- A package manager like [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/)

### Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-name>/team37-api
    ```

2.  **Install dependencies:**
    Run one of the following commands depending on your package manager:
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```
    or
    ```bash
    pnpm install
    ```

3.  **Environment Variables:**
    This project uses a `.env` file for environment variables. Create a `.env` file in the `team37-api` directory and add the necessary variables. You can use the `.env.example` file as a template if one is available.

4.  **Run the development server:**
    ```bash
    npm run back
    ```
    This will start the server with `nodemon`, which will automatically restart on file changes. The API should now be running.
