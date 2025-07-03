@echo off
echo 🚀 P2L TV GitHub Pages Setup
echo ==============================
echo.

set /p repoName="Enter your GitHub repository name (e.g., p2l-tv): "
set /p apiKey="Enter your Gemini API key (or press Enter to skip): "

echo.
echo ✅ Updating vite.config.ts with base path: /%repoName%/

:: Update vite.config.ts with correct base path
powershell -Command "(Get-Content 'vite.config.ts') -replace '/p2l-tv/', '/%repoName%/' | Set-Content 'vite.config.ts'"

if not "%apiKey%"=="" (
    echo GEMINI_API_KEY=%apiKey% > .env.local
    echo ✅ Created .env.local with your API key
)

:: Update README with correct repository name
powershell -Command "(Get-Content 'README.md') -replace 'yourusername/p2l-tv', 'yourusername/%repoName%' -replace '/p2l-tv/', '/%repoName%/' | Set-Content 'README.md'"
echo ✅ Updated README.md with your repository name

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Push your code to GitHub
echo 2. Add GEMINI_API_KEY to repository secrets (Settings ^> Secrets and variables ^> Actions)
echo 3. Enable GitHub Pages (Settings ^> Pages ^> Source: GitHub Actions)
echo 4. Your app will be available at: https://yourusername.github.io/%repoName%/
echo.
pause
