# Push script for GitHub
Write-Host "Starting GitHub push process..." -ForegroundColor Cyan

# Add all files
Write-Host "Adding files to Git..." -ForegroundColor Green
git add .

# Commit changes
Write-Host "Committing changes..." -ForegroundColor Green
git commit -m "Add NiFi integration with certificate-based authentication"

# Configure remote with username
Write-Host "Configuring remote repository..." -ForegroundColor Green
git remote set-url origin https://KB1629@github.com/KB1629/DataZen.git

# Push to GitHub
Write-Host "Pushing to GitHub... (you may need to enter your password or token)" -ForegroundColor Yellow
git push origin main

Write-Host "Process completed!" -ForegroundColor Cyan
Write-Host "If authentication failed, you may need to create a Personal Access Token on GitHub."
Write-Host "Visit: https://github.com/settings/tokens to create one."

# Keep window open
Write-Host "Press any key to exit..."
$host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Out-Null 