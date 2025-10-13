# client/Dockerfile
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all frontend files
COPY . .

# Expose frontend port
EXPOSE 3000

# Default command for development
CMD ["npm", "run", "dev"]