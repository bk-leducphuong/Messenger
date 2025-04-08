ARG ENV_FILE
# Use Node.js as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Copy environment variables file
COPY ${ENV_FILE} .env

# Expose port (assuming your messenger server runs on port 3000)
EXPOSE 3001

# Start the server
CMD ["npm","run","start"]