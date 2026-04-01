@echo off
chcp 65001 >nul 2>&1
title SEO Content Generator - factory 停止

echo ========================================
echo   SEO Content Generator を停止します
echo ========================================
echo.

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5178 " ^| findstr "LISTENING"') do (
    echo ポート5178のプロセスを停止中...
    taskkill /PID %%a /F >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3002 " ^| findstr "LISTENING"') do (
    echo ポート3002のプロセスを停止中...
    taskkill /PID %%a /F >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5179 " ^| findstr "LISTENING"') do (
    echo ポート5179のプロセスを停止中...
    taskkill /PID %%a /F >nul 2>&1
)

echo.
echo 全サーバーを停止しました
echo.
pause
