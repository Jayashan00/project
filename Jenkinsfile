pipeline {
    agent any

    environment {
        GITHUB_REPO = 'https://github.com/Jayashan00/project.git'
        DOCKERHUB_USER = 'jayashan00'

        FRONTEND_IMAGE = "${DOCKERHUB_USER}/srilanka-frontend"
        BACKEND_IMAGE = "${DOCKERHUB_USER}/srilanka-backend"

        DOCKER_CREDENTIALS = 'dockerhub-creds'
        GITHUB_CREDENTIALS = 'github-creds'
        AWS_CREDENTIALS    = 'aws-creds'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'master',
                    credentialsId: "${GITHUB_CREDENTIALS}",
                    url: "${GITHUB_REPO}"
            }
        }

        stage('Build Backend Image') {
            steps {
                sh """
                    cd backend
                    docker build -t ${BACKEND_IMAGE}:latest .
                """
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh """
                    cd frontend
                    docker build -t ${FRONTEND_IMAGE}:latest .
                """
            }
        }

        stage('Login to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDENTIALS}", usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh 'echo "$PASS" | docker login -u "$USER" --password-stdin'
                }
            }
        }

        stage('Push Images') {
            steps {
                sh "docker push ${BACKEND_IMAGE}:latest"
                sh "docker push ${FRONTEND_IMAGE}:latest"
            }
        }

        stage('Terraform Init') {
            steps {
                sh "cd terraform && terraform init"
            }
        }

        stage('Terraform Apply') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: "${AWS_CREDENTIALS}"]]) {
                    sh """
                        cd terraform
                        terraform apply -auto-approve
                    """
                }
            }
        }
    }
}
