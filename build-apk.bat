@echo off
echo ===================================================
echo        TaskPulse - Android APK Build Pipeline
echo ===================================================
echo.
echo Checking EAS CLI login status...
cd /d "%~dp0mobile"
call npx eas-cli whoami
if %errorlevel% neq 0 (
    echo.
    echo [NOTICE] You are not logged into Expo Application Services (EAS).
    echo Please log in or create a free account at https://expo.dev:
    echo.
    call npx eas-cli login
)

echo.
echo Triggering APK build (preview profile)...
call npx eas-cli build --platform android --profile preview

echo.
pause
