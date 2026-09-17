@echo off
title Firebase CLI - Login / Switch Account
echo ========================================================
echo       Firebase CLI - Google Account Switcher
echo ========================================================
echo.
echo Logging out any active session...
call npx -y firebase-tools@latest logout
echo.
echo Opening browser to log in with your preferred Google account...
call npx -y firebase-tools@latest login --reauth
echo.
echo ========================================================
echo Done! Your new account is now connected to Firebase CLI & MCP.
echo ========================================================
pause
