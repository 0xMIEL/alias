# Node.js-Based Game "Alias" with Chat and Word Checking

## Content

1. [Description](#game-description)
2. [System Requirements](#system-requirements)
3. [Setup and Installation](#setup-and-installation)
    - [Running the Application with Docker]()
    - [Running the Application without Docker]()


## Game Description
Alias is a word-guessing game where players form teams. Each team takes turns where one member describes a word and others guess it. The game includes a chat for players to communicate and a system to check for similar words.

### Objective
Teams try to guess as many words as possible from their teammates' descriptions.

### Turns
Each turn is timed. Describers cannot use the word or its derivatives.

### Scoring
Points are awarded for each correct guess. Similar words are checked for validation.

### End Game
The game concludes after a predetermined number of rounds, with the highest-scoring team winning.

## System Requirements

- **Backend**: Node.js

- **Database**: MongoDB

- **Frontend**: Handlebars

## Setup and Installation

### Running the Application with Docker

### Docker Setup

1. **Install docker:** Ensure Docker is installed on your machine. You can follow the installation instructions on [the official Docker website](https://www.docker.com/).

2. **Configuration:**

- Rename `env.dev.example` to `.env.dev` and adjust the variables as needed. The database configuration variables are already set for the Docker MongoDB database.

3. **Run script:**

```Bash
npm run docker
```

### Running the Application without Docker