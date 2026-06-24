#!/bin/bash

echo "Starting StreamServer Installation..."

mkdir -p streamserver
cd streamserver

echo "Downloading configuration files..."
curl -s -O https://raw.githubusercontent.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME/main/docker-compose.yml

echo "Creating default environment variables..."
cat << EOF > .env
# Point this to the MASTER drive or folder where your media is stored.
HOST_MEDIA_PATH=./media
EOF

echo "Pulling images and starting containers..."
docker compose up -d

echo ""
echo "Installation Complete!"
echo "StreamServer is now running in the background."
echo "Open your browser and go to: http://localhost:5173"
echo "To scan your own media, edit the .env file in the 'streamserver' folder to point to your videos, then restart the containers."