# Use the official Node.js image as the base image
FROM node:23 AS base
ARG NODE_ENV
ARG MONGODB_URI

# Set environment variables
ENV NODE_ENV=${NODE_ENV}
ENV NEXT_PUBLIC_NODE_ENV=${NEXT_PUBLIC_NODE_ENV}
ENV MONGODB_URI=${MONGODB_URI}


FROM base AS builder
# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Ensure environment variables are set for the build
ENV NODE_ENV=${NODE_ENV:-production}
ENV NEXT_PUBLIC_NODE_ENV=${NEXT_PUBLIC_NODE_ENV:-production}

# Build the Next.js application
RUN yarn build

# Production stage
FROM base AS production

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./

# Ensure environment variables are set for production
ENV NODE_ENV=production
ENV NEXT_PUBLIC_NODE_ENV=production

# Create a file to verify environment variables at runtime
RUN echo "#!/bin/sh\necho 'Environment variables:'\necho \"NODE_ENV=\$NODE_ENV\"\necho \"NEXT_PUBLIC_NODE_ENV=\$NEXT_PUBLIC_NODE_ENV\"\necho \"Hostname=\$(hostname)\"\necho \"Date=\$(date)\"\n" > /app/env-check.sh && \
    chmod +x /app/env-check.sh

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application with environment check
CMD ["/bin/sh", "-c", "/app/env-check.sh && yarn start"]
