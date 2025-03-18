# Push script for GitHub using token
Write-Host "Starting GitHub push process with token..." -ForegroundColor Cyan

# Prompt for GitHub token (will not be displayed)
$secureToken = Read-Host "Enter your GitHub Personal Access Token" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureToken)
$token = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Add all files
Write-Host "Adding files to Git..." -ForegroundColor Green
git add .

# Commit changes
Write-Host "Committing changes..." -ForegroundColor Green
git commit -m "Add NiFi integration with certificate-based authentication"

# Configure remote with token
Write-Host "Configuring remote repository with token..." -ForegroundColor Green
git remote set-url origin "https://KB1629:$token@github.com/KB1629/DataZen.git"

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

# Reset the remote URL to remove the token
git remote set-url origin https://github.com/KB1629/DataZen.git

Write-Host "Process completed!" -ForegroundColor Cyan
Write-Host "The token has been removed from the remote URL for security."

# Keep window open
Write-Host "Press any key to exit..."
$host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Out-Null 