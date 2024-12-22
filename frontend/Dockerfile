# Load node image
FROM node:latest

# Set working directory
WORKDIR /app

COPY package*.json ./

RUN npm cache clean --force

# Install dependencies
RUN npm install

# Copy files over
COPY . .

# Build for production
RUN npm run build --omit=dev

# Install serve
RUN npm install -g serve

# Expose port
EXPOSE 5000