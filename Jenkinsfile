pipeline {
    agent any

    environment {
        BACKEND_IMAGE  = 'jayashan00/srilanka-backend'
        FRONTEND_IMAGE = 'jayashan00/srilanka-frontend'
        DOCKERHUB_CREDS = 'dockerhub-creds'
    }

    stages {

        stage('Build Backend Image') {
            steps {
                sh '''
                    cd server
                    docker build -t ${BACKEND_IMAGE}:latest .
                '''
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh '''
                    docker build -t ${FRONTEND_IMAGE}:latest .
                '''
            }
        }

        stage('DockerHub Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: DOCKERHUB_CREDS,
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh 'echo "$PASS" | docker login -u "$USER" --password-stdin'
                }
            }
        }

        stage('Push Images') {
            steps {
                sh '''
                    docker push ${BACKEND_IMAGE}:latest
                    docker push ${FRONTEND_IMAGE}:latest
                '''
            }
        }

        stage('Terraform Init & Apply') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-creds',
                    accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                    secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                ]]) {
                    sh '''
                        cd terraform
                        terraform init
                        terraform apply -auto-approve
                    '''
                }
            }
        }

        stage('Deploy on EC2') {
            steps {
                script {
                    def ip = sh(
                        script: "cd terraform && terraform output -raw public_ip",
                        returnStdout: true
                    ).trim()

                    sshagent(['ec2-ssh-key']) {
                        sh """
                        ssh -o StrictHostKeyChecking=no ubuntu@${ip} '
                            echo "⏳ Waiting for Docker to be ready..."
                            until command -v docker >/dev/null 2>&1; do
                                sleep 5
                            done

                            sudo docker network create app-network || true

                            sudo docker rm -f backend frontend mongo || true

                            sudo docker run -d \
                              --name mongo \
                              --network app-network \
                              -p 27017:27017 \
                              mongo:7.0

                            sudo docker pull ${BACKEND_IMAGE}:latest
                            sudo docker pull ${FRONTEND_IMAGE}:latest

                            sudo docker run -d \
                              --name backend \
                              --network app-network \
                              -p 5000:5000 \
                              -e MONGODB_URI="mongodb://mongo:27017/travel" \
                              ${BACKEND_IMAGE}:latest

                            sudo docker run -d \
                              --name frontend \
                              --network app-network \
                              -p 3001:80 \
                              ${FRONTEND_IMAGE}:latest
                        '
                        """
                    }
                }
            }
        }

    }

    post {
        success {
            echo '✅ CI/CD Pipeline Completed Successfully'
        }
        failure {
            echo '❌ Pipeline Failed — Check Logs'
        }
    }
}
