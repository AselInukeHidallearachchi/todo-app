# Use Node.js 18 (LTS)
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Accept build args for Next.js env vars
ARG NEXT_PUBLIC_API_BASE_URL


# Set env vars at build time so Next.js bakes them into the bundle
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL


# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Build the application (env vars will be baked in)
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]