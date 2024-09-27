# Stage 1: Build
FROM node:16 AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install all dependencies, including dev dependencies like TypeScript
RUN npm install --prefer-offline --no-audit

# Copy the rest of your application code
COPY . .

# Transpile TypeScript files to JavaScript
RUN npm run build

# Stage 2: Development
FROM node:16 AS development

# Set the working directory
WORKDIR /usr/src/app

# Set the environment variable for development
ENV NODE_ENV=development

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install all dependencies
RUN npm install --prefer-offline --no-audit

# Copy the build output from the build stage
COPY --from=build /usr/src/app .

# Command to run your application in development mode
CMD sh -c "npx tsc -w & npx nodemon -L --watch ./build server.js"

# Stage 3: Production
FROM node:16 AS production

# Set the working directory
WORKDIR /usr/src/app

# Set the environment variable for production
ENV NODE_ENV=production

# Copy package.json and package-lock.json to install only production dependencies
COPY package*.json ./

# Install only production dependencies
RUN npm install --prefer-offline --no-audit --only=production 

# Copy the build output from the build stage
COPY --from=build /usr/src/app/build ./build

# Command to run your application in production mode
CMD ["node", "./build/server.js"] 