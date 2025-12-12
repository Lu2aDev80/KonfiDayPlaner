#!/usr/bin/env pwsh
# Health check script for KonfiDayPlaner deployment

Write-Host "=== KonfiDayPlaner Health Check ===" -ForegroundColor Cyan
Write-Host "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')`n"

$errorCount = 0
$warningCount = 0

# Function to test URL
function Test-Url {
    param($Url, $Name)
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "[OK] $Name" -ForegroundColor Green
            return $true
        } else {
            Write-Host "[WARN] $Name - Status: $($response.StatusCode)" -ForegroundColor Yellow
            $script:warningCount++
            return $false
        }
    } catch {
        Write-Host "[FAIL] $Name - Error: $($_.Exception.Message)" -ForegroundColor Red
        $script:errorCount++
        return $false
    }
}

# Check Docker Containers
Write-Host "`n1. Checking Docker Containers..." -ForegroundColor White
try {
    $containers = docker-compose ps --format json 2>$null | ConvertFrom-Json
    foreach ($container in $containers) {
        $status = if ($container.State -eq "running") { "OK" } else { "FAIL" }
        $color = if ($status -eq "OK") { "Green" } else { "Red" }
        Write-Host "   [$status] $($container.Service): $($container.State)" -ForegroundColor $color
        if ($status -eq "FAIL") { $script:errorCount++ }
    }
} catch {
    Write-Host "   [FAIL] Could not check containers" -ForegroundColor Red
    $script:errorCount++
}

# Check API Health
Write-Host "`n2. Checking API Health..." -ForegroundColor White
Test-Url "http://localhost:3000/api/health" "API Health Endpoint"

# Check Frontend
Write-Host "`n3. Checking Frontend..." -ForegroundColor White
Test-Url "http://localhost:8080/cahos-ops/" "Frontend Root"

# Check Database
Write-Host "`n4. Checking Database..." -ForegroundColor White
try {
    $dbCheck = docker-compose exec -T postgres pg_isready -U konfiadmin 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   [OK] PostgreSQL is ready" -ForegroundColor Green
    } else {
        Write-Host "   [FAIL] PostgreSQL not ready" -ForegroundColor Red
        $script:errorCount++
    }
} catch {
    Write-Host "   [FAIL] Could not check database" -ForegroundColor Red
    $script:errorCount++
}

# Check Disk Space
Write-Host "`n5. Checking Disk Space..." -ForegroundColor White
try {
    $drive = Get-PSDrive -Name C
    $freeGB = [math]::Round($drive.Free / 1GB, 2)
    $usedGB = [math]::Round($drive.Used / 1GB, 2)
    $totalGB = [math]::Round(($drive.Free + $drive.Used) / 1GB, 2)
    $percentFree = [math]::Round(($drive.Free / ($drive.Free + $drive.Used)) * 100, 1)
    
    Write-Host "   Total: $totalGB GB | Used: $usedGB GB | Free: $freeGB GB ($percentFree%)"
    
    if ($percentFree -lt 10) {
        Write-Host "   [WARN] Low disk space!" -ForegroundColor Yellow
        $script:warningCount++
    } else {
        Write-Host "   [OK] Sufficient disk space" -ForegroundColor Green
    }
} catch {
    Write-Host "   [WARN] Could not check disk space" -ForegroundColor Yellow
    $script:warningCount++
}

# Check Recent Logs for Errors
Write-Host "`n6. Checking Recent Logs..." -ForegroundColor White
try {
    $apiLogs = docker-compose logs --tail=50 api 2>&1
    $errorLines = $apiLogs | Select-String -Pattern "error|fail|exception" -SimpleMatch
    if ($errorLines.Count -gt 0) {
        Write-Host "   [WARN] Found $($errorLines.Count) error/warning lines in API logs" -ForegroundColor Yellow
        $script:warningCount++
    } else {
        Write-Host "   [OK] No errors in recent logs" -ForegroundColor Green
    }
} catch {
    Write-Host "   [WARN] Could not check logs" -ForegroundColor Yellow
    $script:warningCount++
}

# Summary
Write-Host "`n=== Health Check Summary ===" -ForegroundColor Cyan
if ($errorCount -eq 0 -and $warningCount -eq 0) {
    Write-Host "All checks passed!" -ForegroundColor Green
    Write-Host "`nSystem Status: HEALTHY" -ForegroundColor Green
    exit 0
} elseif ($errorCount -eq 0) {
    Write-Host "Warnings: $warningCount" -ForegroundColor Yellow
    Write-Host "`nSystem Status: OPERATIONAL WITH WARNINGS" -ForegroundColor Yellow
    exit 0
} else {
    Write-Host "Errors: $errorCount | Warnings: $warningCount" -ForegroundColor Red
    Write-Host "`nSystem Status: DEGRADED" -ForegroundColor Red
    exit 1
}
