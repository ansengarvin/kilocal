# Load node image
FROM node:20-alpine

# Set working directory
WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

# Copy files over
COPY . .

# Run file
CMD ["npm", "start"]

# Expose port
EXPOSE 8000