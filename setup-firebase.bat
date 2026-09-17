@echo off
title TaskPulse Firebase Setup Wizard
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\setup-firebase.ps1"
pause
