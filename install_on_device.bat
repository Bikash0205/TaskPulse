@echo off
echo ===================================================
echo     TaskPulse - Install Signed Mobile APK to Device
echo ===================================================
echo.
echo Checking connected devices...
adb devices
echo.
echo Installing apk_final\taskpulse_final-aligned-debugSigned.apk...
adb install -r apk_final\taskpulse_final-aligned-debugSigned.apk
if %errorlevel% equ 0 (
    echo.
    echo [SUCCESS] APK installed successfully!
    echo Launching TaskPulse with animated boot screen...
    adb shell am force-stop io.taskpulse.app
    adb shell am start -n io.taskpulse.app/.MainActivity
) else (
    echo.
    echo [NOTE] If installation failed, make sure your Android phone is connected via USB with USB Debugging enabled.
)
pause
