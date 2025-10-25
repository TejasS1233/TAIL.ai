FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
ENV NODE_ENV=production
EXPOSE 8001
CMD ["node", "-r", "dotenv/config", "--experimental-json-modules", "src/index.js"]
# server/Dockerfile
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all backend files
COPY . .

# Expose backend port
EXPOSE 8000

# Default command for development
CMD ["npm", "run", "dev"]