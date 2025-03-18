@echo off
echo Starting GitHub push process...
echo.

echo Adding all files to Git...
git add .

echo Committing changes...
git commit -m "Add NiFi integration with certificate-based authentication"

echo Setting up remote URL...
git remote set-url origin https://KB1629@github.com/KB1629/DataZen.git

echo Pushing to GitHub...
git push origin main

echo.
echo If prompted, enter your GitHub password or personal access token.
echo.
echo Process completed! Press any key to exit.
pause > nul 