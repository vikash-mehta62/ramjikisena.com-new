# Fix Next.js Cache - Admin Dashboard 404 Error
# Run this script to clear cache and restart

Write-Host "🔧 Fixing Next.js Cache..." -ForegroundColor Yellow
Write-Host ""

# Stop any process on port 3000
Write-Host "1. Stopping frontend on port 3000..." -ForegroundColor Cyan
try {
    npx kill-port 3000 2>$null
    Write-Host "   ✅ Port 3000 cleared" -ForegroundColor Green
} catch {
    Write-Host "   ℹ️  No process running on port 3000" -ForegroundColor Gray
}

Write-Host ""

# Delete .next cache
Write-Host "2. Deleting .next cache folder..." -ForegroundColor Cyan
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next
    Write-Host "   ✅ Cache deleted" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  No cache folder found" -ForegroundColor Gray
}

Write-Host ""

# Delete node_modules/.cache if exists
Write-Host "3. Deleting node_modules cache..." -ForegroundColor Cyan
if (Test-Path "node_modules/.cache") {
    Remove-Item -Recurse -Force node_modules/.cache
    Write-Host "   ✅ Node cache deleted" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  No node cache found" -ForegroundColor Gray
}

Write-Host ""
Write-Host "✅ Cache cleared successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Starting frontend..." -ForegroundColor Yellow
Write-Host ""

# Start frontend
npm run dev
