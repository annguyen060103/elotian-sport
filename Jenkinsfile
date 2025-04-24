pipeline {
    agent any

    environment {
        IMAGE_NAME = 'lehaitien/gym-crm-fe'
        IMAGE_TAG  = 'jenkins'
    }

    stages {
        stage('Build and Deploy FE on Remote Server') {
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')
                ]) {
                    sshagent(['my-ssh-key']) {
                        sh """
ssh -o StrictHostKeyChecking=no root@192.168.1.101 << 'EOF'
echo "Connected to remote server (FE)."
uptime

echo "Cloning frontend repository..."
rm -rf ~/gym-crm-fe
git clone https://github.com/annguyen060103/elotian-sport.git ~/gym-crm-fe
cd ~/gym-crm-fe

echo "Logging into Docker Hub..."
echo "${DOCKER_PASS}" | docker login -u "${DOCKER_USER}" --password-stdin

echo "Building FE Docker image..."
docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .

echo "Pushing Docker image to Docker Hub..."
docker push ${IMAGE_NAME}:${IMAGE_TAG}

echo "Pulling the latest Docker image..."
docker pull ${IMAGE_NAME}:${IMAGE_TAG}

echo "Stopping old frontend container..."
docker stop gym-crm-fe-container || true
docker rm gym-crm-fe-container || true

echo "Running new frontend container..."
docker run -d \\
    --name gym-crm-fe-container \\
    --network backend \\
    -p 5173:5173 \\
    ${IMAGE_NAME}:${IMAGE_TAG}

echo "FE Container is running:"
docker ps | grep gym-crm-fe-container

EOF
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            mail to: 'lehaitien422003dev@gmail.com',
                 subject: "Gym CRM FE - Deployment Successful",
                 body: """Frontend has been deployed successfully.

Jenkins Job: ${env.JOB_NAME}
Build Number: ${env.BUILD_NUMBER}
Build URL: ${env.BUILD_URL}
Time: ${new Date()}
"""
        }
        failure {
            mail to: 'lehaitien422003dev@gmail.com',
                 subject: "Gym CRM FE - Deployment Failed",
                 body: """The frontend deployment has FAILED.

Jenkins Job: ${env.JOB_NAME}
Build Number: ${env.BUILD_NUMBER}
Build URL: ${env.BUILD_URL}
Time: ${new Date()}

Please check logs for issues.
"""
        }
    }
}
