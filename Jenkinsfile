pipeline {
    agent any

    environment {
        GITHUB_REPO = 'https://github.com/Jayashan00/project.git'
        DOCKER_IMAGE = 'jayashan00/srilanka-project'
        DOCKER_CREDENTIALS = 'dockerhub-creds'
        GITHUB_CREDENTIALS = 'github-creds'
        PROJECT_DIR = 'project'
    }

    stages {
        stage('Checkout from GitHub') {
            steps {
                echo '📦 Cloning repository from GitHub...'
                git branch: 'master',
                    credentialsId: "${GITHUB_CREDENTIALS}",
                    url: "${GITHUB_REPO}"
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                sh "docker build -t ${DOCKER_IMAGE}:latest ."
            }
        }

        stage('Login to Docker Hub') {
            steps {
                echo '🔐 Logging into Docker Hub...'
                withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDENTIALS}", usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
                    sh 'echo "$DOCKERHUB_PASS" | docker login -u "$DOCKERHUB_USER" --password-stdin'
                }
            }
        }

        stage('Tag & Push Images to Docker Hub') {
            steps {
                echo '🚀 Tagging and pushing Docker image...'
                sh """
                    docker tag ${DOCKER_IMAGE}:latest ${DOCKER_IMAGE}:latest
                    docker push ${DOCKER_IMAGE}:latest
                """
            }
        }

        stage('Run Containers') {
            steps {
                echo '🧱 Running Docker containers...'
                sh 'docker compose down || true'
                sh 'docker compose up -d'
            }
        }

        stage('Check Running Services') {
            steps {
                echo '🔍 Checking running containers...'
                sh 'docker ps'
            }
        }
    }

    post {
        success {
            echo '✅ Build and deployment successful!'
        }
        failure {
            echo '❌ Pipeline failed! Check Jenkins logs.'
        }
    }
}
