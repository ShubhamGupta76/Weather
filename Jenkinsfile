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
                sh '''
                    # Install Node.js 18 using nvm (if available) or use system Node.js
                    if command -v nvm &> /dev/null; then
                        source ~/.nvm/nvm.sh
                        nvm install ${NODE_VERSION}
                        nvm use ${NODE_VERSION}
                    fi
                    
                    # Verify Node.js and npm versions
                    node --version
                    npm --version
                '''
            }
        }
        
        // Stage 3: Install dependencies
        stage('Install Dependencies') {
            steps {
                script {
                    echo '📥 Installing npm dependencies...'
                }
                sh '''
                    # Clean install to ensure fresh dependencies
                    npm ci --prefer-offline --no-audit || npm install
                    
                    # Verify node_modules exists
                    if [ ! -d "node_modules" ]; then
                        echo "ERROR: node_modules directory not found after installation"
                        exit 1
                    fi
                '''
            }
        }
        
        // Stage 4: Build application
        stage('Build') {
            steps {
                script {
                    echo '🏗️  Building React application...'
                }
                sh '''
                    # Run production build
                    npm run build
                    
                    # Verify build output exists
                    if [ ! -d "build" ] && [ ! -d "dist" ]; then
                        echo "ERROR: Build output directory not found"
                        echo "Expected 'build' or 'dist' directory"
                        exit 1
                    fi
                '''
            }
        }
        
        // Stage 5: Build Verification
        stage('Build Verification') {
            steps {
                script {
                    echo '✅ Verifying build artifacts...'
                }
                sh '''
                    # Determine build output directory (React typically uses 'build', some configs use 'dist')
                    BUILD_DIR=""
                    if [ -d "build" ]; then
                        BUILD_DIR="build"
                    elif [ -d "dist" ]; then
                        BUILD_DIR="dist"
                    else
                        echo "ERROR: No build output directory found"
                        exit 1
                    fi
                    
                    # Check if index.html exists (required for React apps)
                    if [ ! -f "${BUILD_DIR}/index.html" ]; then
                        echo "ERROR: index.html not found in ${BUILD_DIR}"
                        exit 1
                    fi
                    
                    # Check if static assets directory exists
                    if [ ! -d "${BUILD_DIR}/static" ] && [ ! -d "${BUILD_DIR}/assets" ]; then
                        echo "WARNING: Static assets directory not found, but continuing..."
                    fi
                    
                    # Display build size information
                    echo "Build verification successful!"
                    echo "Build directory: ${BUILD_DIR}"
                    echo "Build size: $(du -sh ${BUILD_DIR} | cut -f1)"
                    echo "Number of files: $(find ${BUILD_DIR} -type f | wc -l)"
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

