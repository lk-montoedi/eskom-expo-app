# server/Dockerfile
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app files
COPY . .

# Set environment variables
ENV PORT=3001

# Expose port
EXPOSE 3001

# Start the server
CMD [ "node", "server.js" ]
