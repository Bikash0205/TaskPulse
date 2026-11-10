@echo off
setlocal
echo ===================================================
echo     TaskPulse - Install Signed Mobile APK to Device
echo ===================================================
echo.

set ADB_EXE=adb
where adb >nul 2>&1
if %errorlevel% neq 0 (
    if exist "%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe" (
        set "ADB_EXE=%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe"
    )
)

echo Checking connected devices...
"%ADB_EXE%" devices
echo.
echo Installing apk_final\taskpulse_to_sign-aligned-debugSigned.apk...
"%ADB_EXE%" install -r apk_final\taskpulse_to_sign-aligned-debugSigned.apk
if %errorlevel% equ 0 (
    echo.
    echo [SUCCESS] APK installed successfully!
    echo Launching TaskPulse with animated boot screen...
    "%ADB_EXE%" shell am force-stop io.taskpulse.app
    "%ADB_EXE%" shell am start -n io.taskpulse.app/.MainActivity
) else (
    echo.
    echo [NOTE] If installation failed, make sure your Android phone is connected via USB with USB Debugging enabled.
)
pause
