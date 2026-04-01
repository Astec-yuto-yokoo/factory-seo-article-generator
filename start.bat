@echo off
chcp 65001 >nul 2>&1
title SEO Content Generator - factory

echo ========================================
echo   SEO Content Generator を起動します
echo ========================================
echo.

:: 既存プロセスの確認と終了
echo 既存のプロセスを確認中...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5178 " ^| findstr "LISTENING"') do (
    echo ポート5178が使用中です。終了します...
    taskkill /PID %%a /F >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3002 " ^| findstr "LISTENING"') do (
    echo ポート3002が使用中です。終了します...
    taskkill /PID %%a /F >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5179 " ^| findstr "LISTENING"') do (
    echo ポート5179が使用中です。終了します...
    taskkill /PID %%a /F >nul 2>&1
)
timeout /t 2 /nobreak >nul

:: スクレイピングサーバーを起動
echo スクレイピングサーバーを起動中...
start "scraping-server" /min cmd /c "cd /d %~dp0server && node scraping-server.js"
timeout /t 3 /nobreak >nul

:: メインアプリケーションを起動
echo メインアプリケーションを起動中...
start "main-app" /min cmd /c "cd /d %~dp0 && npm run dev"

:: 画像生成エージェントを起動
echo 画像生成エージェントを起動中...
start "image-agent" /min cmd /c "cd /d %~dp0ai-article-imager-for-wordpress && npm run dev"

:: 起動完了メッセージ
echo.
echo ========================================
echo   起動完了！
echo ========================================
echo   メインアプリ:         http://localhost:5178
echo   スクレイピングサーバー: http://localhost:3002
echo   画像生成エージェント:   http://localhost:5179
echo ========================================
echo.
echo ブラウザで http://localhost:5178 を開いてください
echo.
echo このウィンドウを閉じても各サーバーは動作し続けます
echo 全サーバーを停止するには stop.bat を実行してください
echo.
pause
