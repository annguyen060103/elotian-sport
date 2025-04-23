@echo off
echo =============================
echo Building Docker image...
echo =============================

docker build -t lehaitien/gym-crm-fe:v1 .

IF %ERRORLEVEL% NEQ 0 (
    echo Build failed. Exiting...
    exit /b %ERRORLEVEL%
)

echo =============================
echo Pushing Docker image to Docker Hub...
echo =============================

docker push lehaitien/gym-crm-fe:v1

IF %ERRORLEVEL% NEQ 0 (
    echo Push failed. Make sure you are logged in with `docker login`.
    exit /b %ERRORLEVEL%
)

echo =============================
echo Build and push completed successfully!
echo =============================
