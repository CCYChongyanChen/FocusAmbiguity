# Backend Dockerfile

# Use the official Node.js image
FROM node:18

# Create and set the working directory
WORKDIR /app

# Copy the package.json and install dependencies
COPY package*.json ./

RUN npm install
RUN pwd
RUN ls -la
RUN ls -la node_modules

COPY . .

# Expose the port that the backend server will run on
EXPOSE 4000

# Start the backend server
CMD ["node", "server.js"]
