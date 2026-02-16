#!/bin/bash

# BIRoad Deployment Script
echo "Starting BIRoad deployment..."

# Build frontend
echo "Building frontend..."
cd biroad-front
# Add build commands here

# Deploy backend
echo "Deploying backend..."
cd ../biroad-backend
npm install
npm start

echo "Deployment complete!"
