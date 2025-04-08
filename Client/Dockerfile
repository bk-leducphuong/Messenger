# Dockerfile for React Client
ARG ENV_FILE
# Use Node.js alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all other source code
COPY . .

# Copy environment variables file
COPY ${ENV_FILE} .env

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0"]