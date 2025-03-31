#!/bin/bash

echo "Starting deployment process..."

# Clean up existing builds
echo "Cleaning up previous builds..."
rm -rf .next
rm -rf node_modules

# Install dependencies
echo "Installing dependencies..."
npm install --legacy-peer-deps --no-fund

# Build the application
echo "Building the application..."
npm run build

# Deploy to Vercel
echo "Deploying to Vercel..."
npx vercel --prod

echo "Deployment process completed!" 