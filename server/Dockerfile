# Build Stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production Stage
FROM node:22-alpine

WORKDIR /app

# Set production environment default
ENV NODE_ENV=production

# Copy package files for production install
COPY package*.json ./

# Install ONLY production dependencies
RUN npm install --only=production

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 4000

# Start server
CMD ["node", "dist/index.js"]
