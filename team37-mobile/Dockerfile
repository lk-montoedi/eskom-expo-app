FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the project
COPY . .

# Prevent interactive prompts
ENV CI=1

# Expo ports
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

# Start Expo using the local CLI via npx
CMD ["npx", "expo", "start", "--host", "lan"]
