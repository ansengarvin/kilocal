# Load node image
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --omit=dev

# Install serve
FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist

# Expose port
EXPOSE 5000

CMD ["serve", "-s", "dist", "-l", "3000"]