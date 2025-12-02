#!/bin/bash
# Deploy script for production server

echo "🚀 Deploying KonfiDayPlaner to production server..."

# Build and push Docker images
echo "📦 Building Docker images..."
docker-compose build

# Optional: Tag and push to registry if using remote Docker registry
# docker tag konfidayplaner-app:latest your-registry/konfidayplaner-app:latest
# docker tag konfidayplaner-api:latest your-registry/konfidayplaner-api:latest
# docker push your-registry/konfidayplaner-app:latest
# docker push your-registry/konfidayplaner-api:latest

echo "✅ Build completed!"
echo ""
echo "📋 Next steps for server deployment:"
echo "1. Copy docker-compose.yml to your server"
echo "2. Copy .env.production to server as .env"
echo "3. Run: docker-compose up -d"
echo ""
echo "🔧 Server commands:"
echo "scp docker-compose.yml user@lu2adevelopment.de:~/konfidayplaner/"
echo "scp .env.production user@lu2adevelopment.de:~/konfidayplaner/.env"
echo ""
echo "ssh user@lu2adevelopment.de"
echo "cd ~/konfidayplaner"
echo "docker-compose up -d"