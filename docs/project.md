# Node.js-Based Game "Alias" with Chat and Word Checking

## Content

- [Node.js-Based Game "Alias" with Chat and Word Checking](#nodejs-based-game-alias-with-chat-and-word-checking)
  - [Content](#content)
  - [Game Description](#game-description)
    - [Game Flow](#game-flow)
  - [System Requirements](#system-requirements)
  - [Setup and Installation](#setup-and-installation)
    - [Clone the Project](#clone-the-project)
    - [Install dependencies](#install-dependencies)
    - [Running the Application with Docker](#running-the-application-with-docker)
    - [Docker Setup](#docker-setup)
  - [Database Schema Design](#database-schema-design)
  - [Running Tests](#running-tests)
  - [Error Handling](#error-handling)
  - [Entities](#entities)
    - [1. Users](#1-users)
    - [2. GameRooms](#2-gamerooms)
    - [3. FrontEnd](#3-frontend)
    - [4. Words](#4-words)
  - [Security](#security)
  - [Deployment](#deployment)
  - [Future Enhancements](#future-enhancements)
    - [1. User Profile: Player Statistics](#1-user-profile-player-statistics)
    - [2. Game Levels Based on Word Difficulty](#2-game-levels-based-on-word-difficulty)
    - [3. Filter games list](#3-filter-games-list)
  - [FAQ](#faq)
    - [1. How do I register and log in to the game?](#1-how-do-i-register-and-log-in-to-the-game)
    - [2. Can I play the game alone?](#2-can-i-play-the-game-alone)
    - [3. What if I experience issues with real-time chat?](#3-what-if-i-experience-issues-with-real-time-chat)
    - [4. How is word similarity checked during gameplay?](#4-how-is-word-similarity-checked-during-gameplay)
    - [5. Are my user credentials stored securely?](#5-are-my-user-credentials-stored-securely)
    - [6. How do I run the application locally?](#6-how-do-i-run-the-application-locally)
    - [7. How can I contribute to the project?](#7-how-can-i-contribute-to-the-project)
    - [8. What future enhancements are planned for the game?](#8-what-future-enhancements-are-planned-for-the-game)
    - [9. Where can I find the API documentation?](#9-where-can-i-find-the-api-documentation)
  - [Conclusion](#conclusion)
    - [Key Takeaways](#key-takeaways)


## Game Description
Alias is a word-guessing game where players form teams. Each team takes turns where one member describes a word and others guess it. The game includes a chat for players to communicate and a system to check for similar words.

### Game Flow
1. **User Registration & Login**

- Users must register and log in to access the application.

2. **Lobby/Homepage**

- After logging in, users are presented with the game lobby, where they can:
    - Join an existing room (if it's not full), or
    - Create a new game room with preferences, including the number of **players per team**, **number of rounds**, **time per round**.

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

- Player can logout from sesion.

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

## Entities

API documentation was created with **Swagger**, providing a user-friendly interface to explore and test the available endpoints.

**For full API documentation, visit:** [API Docs](http://localhost:3000/api-docs/)

### 1. Users

The Users module handles user registration, login and management. It allows creating new users, authenticating them and managing their profiles.

### 2. GameRooms

The GameRooms module is responsible for managing game rooms where players can join or create new rooms to start playing.

### 3. FrontEnd

The FrontEnd module provides the interface for interacting with the game, including user login, game room interaction, and word guessing.

### 4. Words

The Word Checker module is designed for managing words for the game. It allows retrieving random words from the database and also checks for similarities or potential cheating in chat messages.

**Levenshtein algorithm**

The Levenshtein algorithm is a string metric that quantifies the difference between two sequences by calculating the minimum number of single-character edits required to change one string into the other. The allowed operations include insertion, deletion and substitution.

How It Works

The algorithm uses dynamic programming to build a matrix where each cell represents the cost of transforming a substring of the first string into a substring of the second string. The matrix is filled based on the following rules:

- The first row and first column represent the cost of converting an empty string to the respective substrings.
- For each character comparison, if the characters are the same, the cost remains the same as the diagonal cell; if not, it considers the costs of insertion, deletion, and substitution, taking the minimum value.

The final cell in the matrix contains the Levenshtein distance, indicating the minimum number of edits required to convert one string into another.

## Security

The application implements security using JSON Web Tokens (JWT) for authentication and authorization. Users receive a JWT upon successful login, which must be included in the headers of protected routes. The token ensures that only authenticated users can access specific endpoints, such as managing profiles, game rooms, and words. Tokens are verified on each request to ensure validity and user identity.

## Deployment

Instructions for deploying the application.

## Future Enhancements

### 1. User Profile: Player Statistics

Enhance the user profile page to display player statistics, providing more insights into their performance. This could include:

- **Rounds Played**: Show the total number of rounds the player has participated in.
- **Final Score**: Display the player’s overall score across all rounds.
  
**Implementation Ideas**:

- Add fields like `roundsTotal` and `finalScore` to the user schema.
- Calculate and update these statistics after each game, potentially storing them in a `UserStats` collection or within the user’s profile document.

### 2. Game Levels Based on Word Difficulty

Introduce different levels in the game, allowing players to choose or progress through various difficulties. Each level could adjust the complexity of words given to the players.

**Implementation Ideas**:

- **Difficulty Levels**: Create levels such as *easy*, *medium*, and *hard*.
- **Word Bank**: Categorize words in the database by difficulty, allowing the game to serve more complex words as the level increases.
- Add a field like `difficultyLevel` in the game schema to track the level of each game.
- Update the game creation endpoint to allow players to select a difficulty level.
- Implement logic in the game flow to adjust word selection based on the chosen level.

These enhancements would improve user engagement by offering personalized performance tracking and a more varied gameplay experience.

### 3. Filter games list

Players w game lobby can filter games list based of their game settings.

## FAQ

### 1. How do I register and log in to the game?
To register, visit the homepage and fill out the registration form with your details. Once registered, you can log in using your credentials.

### 2. Can I play the game alone?
Currently, the game is designed for team play. However, you can create a game room and invite friends or other users to join.

### 3. What if I experience issues with real-time chat?
Ensure that your internet connection is stable. If you still encounter issues, try refreshing the page or logging out and back in.

### 4. How is word similarity checked during gameplay?
The game uses the Levenshtein algorithm to check for word similarity, which compares the guessed word with the correct answer and determines if they are close enough based on a defined threshold.

### 5. Are my user credentials stored securely?
Yes, user passwords are hashed using bcryptjs for security, ensuring that sensitive information is not stored in plain text.

### 6. How do I run the application locally?
To run the application locally, clone the repository, install the dependencies using `npm install`, and then start the application using `npm start`. Ensure you have Docker and MongoDB set up correctly if you're using Docker.

### 7. How can I contribute to the project?
We welcome contributions! Please fork the repository, make your changes, and submit a pull request. Be sure to follow the contribution guidelines outlined in the repository.

### 8. What future enhancements are planned for the game?
Future enhancements include user profiles for tracking statistics, different game levels based on word difficulty, and filtering options for the game lobby. Check the "Future Enhancements" section for more details.

### 9. Where can I find the API documentation?
You can access the full API documentation generated with Swagger at the following link: [API Docs](http://localhost:3000/api-docs/).

## Conclusion

The Node.js-based game "Alias" offers an engaging and interactive experience for players through its seamless integration of chat functionality and word-checking algorithms. The game promotes teamwork and communication while leveraging modern web technologies, including Node.js, Express, and MongoDB, to create a robust backend system.

### Key Takeaways

- **User-Centric Design**: The game emphasizes user experience, from easy registration and login to a well-structured gameplay flow. Players can easily join or create game rooms and enjoy an intuitive interface powered by Handlebars.
  
- **Real-Time Interaction**: Utilizing Socket.io, the game facilitates real-time communication between players, enhancing collaboration and excitement during gameplay.

- **Security Measures**: The implementation of JSON Web Tokens (JWT) ensures that user authentication and authorization are handled securely, providing peace of mind regarding user data and interactions.

- **Future Enhancements**: The outlined future enhancements aim to further improve player engagement and customization, allowing for personalized player statistics and varied difficulty levels, ensuring that the game continues to evolve with user needs.

This project was a collaborative effort by a team of four developers, who learned a great deal throughout the development process. From navigating technical challenges to implementing best practices in coding and design, each member gained invaluable experience that will contribute to their future endeavors in software development.

We encourage developers and enthusiasts to explore the codebase, contribute, and further innovate on this project.
