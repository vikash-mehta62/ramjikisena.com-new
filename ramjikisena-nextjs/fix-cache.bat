@echo off
echo.
echo ========================================
echo   Fix Next.js Cache - Admin Dashboard
echo ========================================
echo.

echo [1/4] Stopping frontend on port 3000...
npx kill-port 3000 2>nul
echo       Done!
echo.

echo [2/4] Deleting .next cache folder...
if exist .next (
    rmdir /s /q .next
    echo       Cache deleted!
) else (
    echo       No cache found
)
echo.

echo [3/4] Deleting node_modules cache...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo       Node cache deleted!
) else (
    echo       No node cache found
)
echo.

echo [4/4] Starting frontend...
echo.
echo ========================================
echo   Cache cleared! Starting server...
echo ========================================
echo.

npm run dev
