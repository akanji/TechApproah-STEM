# Use Node.js as the base
FROM node:18-slim

# Create the app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the frontend and backend bundle
RUN npm run build

# Expose the application port
EXPOSE 3000

# Start the bundled server
CMD [ "npm", "run", "start" ]
