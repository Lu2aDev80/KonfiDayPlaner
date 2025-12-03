#!/usr/bin/env pwsh
# Quick deployment script for API path fixes

Write-Host "=== KonfiDayPlaner - Quick Rebuild & Deploy ===" -ForegroundColor Cyan
Write-Host "This will rebuild and redeploy the frontend container`n"

# Check if docker-compose is available
if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] docker-compose not found!" -ForegroundColor Red
    exit 1
}

# Confirm action
Write-Host "This will:" -ForegroundColor Yellow
Write-Host "  1. Stop the app container"
Write-Host "  2. Rebuild with no cache"
Write-Host "  3. Start the updated container"
Write-Host ""
$confirm = Read-Host "Continue? (y/N)"

if ($confirm -ne 'y' -and $confirm -ne 'Y') {
    Write-Host "Aborted." -ForegroundColor Yellow
    exit 0
}

Write-Host "`n[1/3] Stopping app container..." -ForegroundColor White
docker-compose stop app

Write-Host "`n[2/3] Rebuilding app container (this may take a few minutes)..." -ForegroundColor White
docker-compose build --no-cache app

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n[ERROR] Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n[3/3] Starting updated container..." -ForegroundColor White
docker-compose up -d app

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n[ERROR] Failed to start container!" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== Deployment Complete ===" -ForegroundColor Green
Write-Host ""

# Wait a moment for container to start
Start-Sleep -Seconds 3

Write-Host "Checking container status..." -ForegroundColor White
docker-compose ps app

Write-Host "`nRecent logs:" -ForegroundColor White
docker-compose logs --tail=10 app

Write-Host "`n=== Verification Steps ===" -ForegroundColor Cyan
Write-Host "1. Clear browser cache"
Write-Host "2. Navigate to: https://lu2adevelopment.de/minihackathon/"
Write-Host "3. Open DevTools (F12) and check console"
Write-Host "4. Verify no 404 errors"
Write-Host ""
Write-Host "Frontend URL: http://localhost:8080/minihackathon/" -ForegroundColor Green
Write-Host "API Health:   http://localhost:3000/api/health" -ForegroundColor Green
