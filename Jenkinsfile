pipeline {
    agent any

    environment {
        COMPOSE_FILE = 'docker-compose.yml'
        PROJECT_DIR = "${WORKSPACE}"
        DOCKER_HUB_REPO_BACKEND = 'jayashan00/srilanka-backend'
        DOCKER_HUB_REPO_NGINX = 'jayashan00/srilanka-nginx'
        IMAGE_TAG = "${env.BUILD_NUMBER}"  // automatically versioned
    }

    stage('Checkout from GitHub') {
        steps {
            echo '📦 Cloning repository from GitHub...'
            checkout([
                $class: 'GitSCM',
                branches: [[name: '*/master']],
                userRemoteConfigs: [[
                    url: 'https://github.com/Jayashan00/project.git',  // ✅ exact repo name
                    credentialsId: 'github-creds'
                ]]
            ])
        }
    }


        stage('Build Docker Images') {
            steps {
                echo '🐳 Building Docker images using docker-compose...'
                sh 'docker compose build'
            }
        }

        stage('Login to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
                }
            }
        }

        stage('Tag & Push Images to Docker Hub') {
            steps {
                script {
                    echo '🚀 Tagging and pushing images...'
                    sh '''
                        # Backend
                        BACKEND_ID=$(docker images -q project_backend)
                        docker tag $BACKEND_ID $DOCKER_HUB_REPO_BACKEND:$IMAGE_TAG
                        docker push $DOCKER_HUB_REPO_BACKEND:$IMAGE_TAG

                        # NGINX
                        NGINX_ID=$(docker images -q project_nginx)
                        docker tag $NGINX_ID $DOCKER_HUB_REPO_NGINX:$IMAGE_TAG
                        docker push $DOCKER_HUB_REPO_NGINX:$IMAGE_TAG
                    '''
                }
            }
        }

        stage('Run Containers') {
            steps {
                echo '🚀 Running Docker containers...'
                sh 'docker compose up -d'
            }
        }

        stage('Check Running Services') {
            steps {
                sh 'docker ps'
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully! Images pushed to Docker Hub.'
        }
        failure {
            echo '❌ Pipeline failed! Check Jenkins logs.'
        }
    }
}
