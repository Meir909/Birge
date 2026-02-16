#!/bin/bash

# GitHub Repository Setup
echo "Setting up BIRoad GitHub repository..."

# Initialize git if not exists
if [ ! -d ".git" ]; then
    git init
    git remote add origin https://github.com/Meir909/BIRoad.git
fi

# Add all files
git add .

# Initial commit
git commit -m "Initial BIRoad project setup"

# Push to main
git push -u origin main

echo "GitHub setup complete!"
