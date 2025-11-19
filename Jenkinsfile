pipeline {
    agent any

    environment {
        GITHUB_REPO = 'https://github.com/Jayashan00/project.git'
        DOCKERHUB_CREDENTIALS = 'dockerhub-creds'
        GITHUB_CREDENTIALS = 'github-creds'

        BACKEND_IMAGE = 'jayashan00/srilanka-backend'
        FRONTEND_IMAGE = 'jayashan00/srilanka-frontend'
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
                echo '🐳 Building Backend Docker Image...'
                sh '''
                    cd server
                    docker build -t ${BACKEND_IMAGE}:latest .
                '''
            }
        }

        stage('Build Frontend Image') {
            steps {
                echo '🌐 Building Frontend Docker Image...'
                sh '''
                    docker build -t ${FRONTEND_IMAGE}:latest .
                '''
            }
        }


        stage('Login to DockerHub') {
            steps {
                echo '🔐 Logging into DockerHub...'
                withCredentials([usernamePassword(credentialsId: "${DOCKERHUB_CREDENTIALS}", usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh 'echo "$PASS" | docker login -u "$USER" --password-stdin'
                }
            }
        }

        stage('Push Images') {
            steps {
                echo '🚀 Pushing Backend & Frontend Images to DockerHub...'
                sh '''
                    docker push ${BACKEND_IMAGE}:latest
                    docker push ${FRONTEND_IMAGE}:latest
                '''
            }
        }

        stage('Terraform Init') {
                    steps {
                        echo '📦 Running Terraform Init...'
                        // Init usually doesn't need creds unless using S3 backend,
                        // but good practice to keep env consistent.
                        sh '''
                            cd terraform
                            terraform init
                        '''
                    }
                }

                stage('Terraform Apply') {
                    steps {
                        echo '🚀 Applying Terraform...'
                        // LOGIC ADDED HERE: Injecting the 'aws-creds' from your screenshot
                        withCredentials([[
                            $class: 'AmazonWebServicesCredentialsBinding',
                            credentialsId: 'aws-creds',
                            accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                            secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                        ]]) {
                            sh '''
                                cd terraform
                                terraform apply -auto-approve
                            '''
                        }
                    }
                }

    post {
        success {
            echo '✅ Pipeline Completed Successfully!'
        }
        failure {
            echo '❌ Pipeline Failed — Check Logs.'
        }
    }
}
