FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency specifications
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy application source code
COPY . .

# Expose HTTP health check port
EXPOSE 3000

# Start Dead Lead Society Bot
CMD ["npm", "start"]
