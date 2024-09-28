# Step 1: Use an official Node.js image as the base
FROM node:20-alpine

# Step 2: Set the working directory in the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json to the working directory
COPY package*.json .

# Step 4: Install the dependencies
RUN npm install

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Expose the port your app runs on (e.g., 3000)
EXPOSE 3000

# Step 7: Define the command to run the application
CMD ["npm", "start"]
