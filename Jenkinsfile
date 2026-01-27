pipeline {
    agent any

    environment {
        GITHUB_REPO = 'https://github.com/Jayashan00/project.git'
        DOCKERHUB_CREDENTIALS = 'dockerhub-creds'
        GITHUB_CREDENTIALS = 'github-creds'

        BACKEND_IMAGE = 'jayashan00/srilanka-backend'
        FRONTEND_IMAGE = 'jayashan00/srilanka-frontend'
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
                sh '''
                    cd terraform
                    terraform init
                '''
            }
        }

        stage('Terraform Apply') {
            steps {
                echo '🚀 Applying Terraform with AWS Credentials...'
                // This block injects the credentials named 'aws-creds' into environment variables
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
        stage('Deploy to Server') {
                    steps {
                        echo '🚀 Deploying to EC2 Instance...'
                        script {
                            // 1. Get the Public IP from Terraform Output
                            def server_ip = sh(script: "cd terraform && terraform output -raw public_ip", returnStdout: true).trim()

                            echo "Connecting to ${server_ip}..."

                            // 2. SSH into the server and update containers
                            // We use StrictHostKeyChecking=no to avoid yes/no prompts
                            sshagent(['ec2-ssh-key']) { // Replace with your Jenkins Credential ID for the PEM key
                                sh """
                                    ssh -o StrictHostKeyChecking=no ubuntu@${server_ip} '
                                        # Stop and remove old containers
                                        docker stop backend frontend || true
                                        docker rm backend frontend || true

                                        # Remove old images to save space
                                        docker system prune -af

                                        # Pull new images
                                        docker pull jayashan00/srilanka-backend:latest
                                        docker pull jayashan00/srilanka-frontend:latest

                                        # Start Backend
                                        docker run -d -p 5000:5000 \
                                            --name backend \
                                            --network app-network \
                                            -e MONGODB_URI="mongodb://mongo_db:27017/travel" \
                                            jayashan00/srilanka-backend:latest

                                        # Start Frontend
                                        docker run -d -p 3001:80 \
                                            --name frontend \
                                            jayashan00/srilanka-frontend:latest
                                    '
                                """
                            }
                        }
                    }
                }
    } // <--- This closing brace was likely missing for 'stages'

    post {
        success {
            echo '✅ Pipeline Completed Successfully!'
        }
        failure {
            echo '❌ Pipeline Failed — Check Logs.'
        }
    }
} // <--- This closing brace is for 'pipeline'