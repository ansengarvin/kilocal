# Load node image
FROM node:latest

# Set working directory
WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

# Copy files over
COPY . .

# Run file
RUN npm run start

# Expose port
EXPOSE 8000