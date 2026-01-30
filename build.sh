#!/bin/bash
# Render build script
set -o errexit

# Install Python dependencies
cd backend
pip install --upgrade pip
pip install -r requirements-prod.txt

# Set up database (if needed)
# python -m alembic upgrade head