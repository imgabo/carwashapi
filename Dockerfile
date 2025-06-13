# Use Node.js 18 LTS
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Debug: Show what was generated
RUN echo "=== Build completed ===" && ls -la dist/ && echo "=== All JS files in dist ===" && find dist -name "*.js" -type f

# Expose port
EXPOSE 3000

# Start the application - try different possible locations
CMD ["sh", "-c", "if [ -f dist/main.js ]; then node dist/main.js; elif [ -f dist/src/main.js ]; then node dist/src/main.js; else echo 'Available files:' && find dist -name '*.js' && exit 1; fi"]