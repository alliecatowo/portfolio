FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8080

# Build the application
RUN npm run generate

# Expose the app port
EXPOSE 8080

# Start the application
CMD ["node", ".output/server/index.mjs"] 