# Use the official Node.js 18 LTS image as a base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Create the 'uploads' directory for file storage
RUN mkdir -p uploads

# Install curl for the health check
RUN apk add --no-cache curl

# Expose the port the application will run on
EXPOSE 5000

# Health check to ensure the server is running before marking the container as healthy
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# The command to start the application
CMD ["npm", "start"]
