# Use Node.js 18 LTS
FROM node:22

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Debug: Show what files we have
RUN echo "=== Files before build ===" && ls -la src/

# Build the application and verify output
RUN npm run build

# Debug: Show what was generated
RUN echo "=== Files after build ===" && ls -la dist/ && echo "=== Contents of dist ===" && find dist -type f -name "*.js"

# Create a startup script that handles different file locations
RUN echo '#!/bin/bash\n\
if [ -f /app/dist/main.js ]; then\n\
  echo "Starting with dist/main.js"\n\
  exec node /app/dist/main.js\n\
elif [ -f /app/dist/src/main.js ]; then\n\
  echo "Starting with dist/src/main.js"\n\
  exec node /app/dist/src/main.js\n\
else\n\
  echo "ERROR: Cannot find main.js file"\n\
  echo "Available files in dist:"\n\
  find /app/dist -name "*.js" -type f\n\
  exit 1\n\
fi' > /app/start.sh && chmod +x /app/start.sh

# Expose port
EXPOSE 3000

# Use the startup script
CMD ["/app/start.sh"]