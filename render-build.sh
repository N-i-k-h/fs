#!/usr/bin/env bash
# Exit on error
set -o errexit

# 1. Install Frontend Dependencies
echo "Installing Frontend Dependencies..."
npm install

# 2. Build Frontend
echo "Building Frontend..."
npm run build

# 3. Install Backend Dependencies
echo "Installing Backend Dependencies..."
cd server
npm install
cd ..
