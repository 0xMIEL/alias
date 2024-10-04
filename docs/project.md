# Node.js-Based Game "Alias" with Chat and Word Checking

## Content

1. [Description](#game-description)
2. [System Requirements](#system-requirements)
3. [Setup and Installation](#setup-and-installation)
    - [Running the Application with Docker](#running-the-application-with-docker)
4. [Database Schema Design](#database-schema-design)
5. [Running Tests](#running-tests)
6. [Error Handling](#error-handling)


## Game Description
Alias is a word-guessing game where players form teams. Each team takes turns where one member describes a word and others guess it. The game includes a chat for players to communicate and a system to check for similar words.

### Game Flow
1. **User Registration & Login**

- Users must register and log in to access the application.

2. **Lobby/Homepage**

- After logging in, users are presented with the game lobby, where they can:
    - Join an existing room (if it's not full), or
    - Create a new game room with preferences, including the number of **players per team**, **number of rounds**, **time per round**.
    - Can filter games list based of their game settings

3. **Room Creation & Team Selection**

 - Users who create a room act as the host and can set the game options
 - Players can join a game room by clicking on a specific game on a game list

4. **Starting the Game**

 - The host has the option to start the game once enough players have joined.
 - After starting, a brief timer countdown prepares the players for the game and transitions to the game screen.

5. **Gameplay**

 - A team is randomly chosen to take the first turn.
 - A chat window is visible to all players, but only the active team can write in the chat during their turn.
 - One player from the active team is given a word from the word list (which is pre-configured in the system).
 - As the team guesses the correct word, a new word is presented.
 - There is a configurable time limit for each round (set during game creation).

6. **Rounds & Winning**

- The game can be limited by rounds.
- The team with the most correctly guessed words at the end of all rounds wins the game.

7. **Word Similarity & Anti-Cheating**

- The game incorporates a word similarity algorithm to check if the guessed word is correct. It also prevents players from cheating by detecting if they simply repeat the displayed word.

8. **Game End & Results**

- At the end of the game, players are shown the game results, including which team won.
- A "Leave Game Room" button allows players to exit the game and return to the main lobby.

9. **Player Profiles**

- Players can view profiles of others, which show statistics such as the number of games played and wins.


## System Requirements

- **Backend**: Node.js, Express with Typescript

- **Database**: MongoDB with Mongoose

- **Frontend**: Handlebars

- **Libraries**: 

    - **bcryptjs**: For password hashing and encryption.
    - **cookie-parser**: For parsing and signing cookies.
    - **dotenv**: For loading environment variables from a .env file.
    - **express-handlebars**: For integrating Handlebars templating with Express.
    - **jsonwebtoken**: For creating and verifying JSON Web Tokens.
    - **mongoose**: An Object Data Modeling library for MongoDB.
    - **socket.io**: For real-time communication.
    - **socket.io-client**: Client-side library for real-time connections.

## Setup and Installation

### Clone the Project

```bash
git clone https://github.com/pologora/alias.git
```

### Install dependencies

```Bash
npm install
```

### Running the Application with Docker

### Docker Setup

1. **Install docker:** Ensure Docker is installed on your machine. You can follow the installation instructions on [the official Docker website](https://www.docker.com/).

2. **Configuration:**

- Rename `env.example` to `.env` and adjust the variables as needed. The database configuration variables are already set for the Docker MongoDB database.

3. **Run script:**

```Bash
npm start
```

## Database Schema Design

![Screenshot](https://github.com/pologora/alias/blob/docs/docs/screenshots/database.png)

## Running Tests
    - to run unit tests:
    
```bash
npm run test
```

## Error Handling

1. Custom Error Class: `AppError` class is used to create custom error objects with additional properties for better error management.
2. Asynchronous Error Wrapper: `asyncErrorCatch` function wraps asynchronous functions to automatically catch errors and pass them to the global error handler.
3. Global Error Handler: `globalErrorHanler` - The global error handler middleware is used at the end of the app to handle all errors passed down the middleware chain.
4. Uncaught Exceptions: To handle uncaught exceptions, log the error and exit the process.
5. Unhandled Rejections: To handle unhandled promise rejections, log the error and close the server gracefully.