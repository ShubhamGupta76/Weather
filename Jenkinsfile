pipeline {
    agent any
    
    // Environment variables for the pipeline
    environment {
        NODE_VERSION = '18'
        NPM_CONFIG_LOGLEVEL = 'error'
    }
    
    options {
        // Discard old builds to save disk space
        buildDiscarder(logRotator(numToKeepStr: '10'))
        // Timeout after 15 minutes
        timeout(time: 15, unit: 'MINUTES')
        // Add timestamps to console output
        timestamps()
    }
    
    stages {
        // Stage 1: Checkout source code from GitHub
        stage('Checkout') {
            steps {
                script {
                    echo '📦 Checking out source code from GitHub repository...'
                }
                checkout scm
            }
        }
        
        // Stage 2: Setup Node.js environment
        stage('Setup Node.js') {
            steps {
                script {
                    echo "🔧 Setting up Node.js ${NODE_VERSION}..."
                }
                bat '''
                    @echo off
                    REM Verify Node.js and npm versions (assuming Node.js is already installed)
                    node --version
                    npm --version
                    if errorlevel 1 (
                        echo ERROR: Node.js or npm not found. Please install Node.js first.
                        exit /b 1
                    )
                '''
            }
        }
        
        // Stage 3: Install dependencies
        stage('Install Dependencies') {
            steps {
                script {
                    echo '📥 Installing npm dependencies...'
                }
                bat '''
                    @echo off
                    REM Clean install to ensure fresh dependencies
                    npm ci --prefer-offline --no-audit
                    if errorlevel 1 (
                        echo npm ci failed, trying npm install...
                        npm install
                    )
                    
                    REM Verify node_modules exists
                    if not exist node_modules (
                        echo ERROR: node_modules directory not found after installation
                        exit /b 1
                    )
                    echo Dependencies installed successfully!
                '''
            }
        }
        
        // Stage 4: Build application
        stage('Build') {
            steps {
                script {
                    echo '🏗️  Building Angular application...'
                }
                bat '''
                    @echo off
                    REM Run production build
                    npm run build
                    if errorlevel 1 (
                        echo ERROR: Build failed!
                        exit /b 1
                    )
                    
                    REM Verify build output exists
                    if not exist build (
                        if not exist dist (
                            echo ERROR: Build output directory not found
                            echo Expected 'build' or 'dist' directory
                            exit /b 1
                        )
                    )
                    echo Build completed successfully!
                '''
            }
        }
        
        // Stage 5: Build Verification
        stage('Build Verification') {
            steps {
                script {
                    echo '✅ Verifying build artifacts...'
                }
                bat '''
                    @echo off
                    setlocal enabledelayedexpansion
                    REM Determine build output directory (Angular uses 'dist', React uses 'build')
                    set BUILD_DIR=
                    if exist build (
                        set BUILD_DIR=build
                    ) else (
                        if exist dist (
                            set BUILD_DIR=dist
                        ) else (
                            echo ERROR: No build output directory found
                            exit /b 1
                        )
                    )
                    
                    echo Checking build output in: %BUILD_DIR%
                    echo Listing contents of %BUILD_DIR%:
                    dir /b %BUILD_DIR%
                    echo.
                    
                    REM Search for index.html recursively (Angular 17+ might have nested structure)
                    set INDEX_FOUND=0
                    for /r "%BUILD_DIR%" %%f in (index.html) do (
                        if exist "%%f" (
                            echo Found index.html at: %%f
                            set INDEX_FOUND=1
                            goto :found
                        )
                    )
                    
                    REM Check root of BUILD_DIR
                    if exist "%BUILD_DIR%\\index.html" (
                        echo Found index.html at: %BUILD_DIR%\\index.html
                        set INDEX_FOUND=1
                        goto :found
                    )
                    
                    REM Check common Angular output paths
                    if exist "%BUILD_DIR%\\weather-frontend\\browser\\index.html" (
                        echo Found index.html at: %BUILD_DIR%\\weather-frontend\\browser\\index.html
                        set INDEX_FOUND=1
                        goto :found
                    )
                    
                    :found
                    if !INDEX_FOUND!==0 (
                        echo ERROR: index.html not found in %BUILD_DIR% or subdirectories
                        echo Searching for any HTML files...
                        dir /s /b "%BUILD_DIR%\\*.html" 2>nul
                        exit /b 1
                    )
                    
                    REM Display build size information
                    echo.
                    echo Build verification successful!
                    echo Build directory: %BUILD_DIR%
                    echo Total files in build:
                    dir /s "%BUILD_DIR%" | find /c /v ""
                '''
            }
        }
    }
    
    post {
        // Actions to perform after successful build
        success {
            script {
                echo '✅ Pipeline completed successfully!'
                echo '🚀 Vercel will auto-deploy on git push (if configured)'
            }
        }
        
        // Actions to perform after failed build
        failure {
            script {
                echo '❌ Pipeline failed!'
                echo 'Please check the logs above for error details.'
            }
        }
        
        // Actions to perform always (cleanup, notifications, etc.)
        always {
            script {
                echo '🧹 Cleaning up...'
                // Optional: Clean up node_modules to save space (uncomment if needed)
                // sh 'rm -rf node_modules'
            }
        }
    }
}

