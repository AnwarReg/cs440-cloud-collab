# backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose backend port
EXPOSE 5001

# Start the server
CMD ["npm", "start"]
