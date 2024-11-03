pipeline {
    agent { docker { image 'node:22.8-slim' } }
    environment {
        DOCKER_IMAGE = "${GIT_BRANCH.tokenize('/').pop()}-${GIT_COMMIT.substring(0,7)}"
    }
    stages {
        stage('build') {
            steps {
                sh "docker build -t ${DOCKER_IMAGE} . "
                withCredentials(
                    [usernamePassword(
                        credentialsId:'dockerhub',
                        passwordVariable: 'DOCKER_USERNAME',
                        usernameVariable: 'DOCKER_PASSWORD')
                    ]) {
                        sh 'echo $DOCKER_PASSWORD | docker login --username $DOCKER_USERNAME --password-stdin'
                        sh "docker push ${DOCKER_IMAGE}"
                        sh "docker push ${DOCKER_IMAGE}:latest"
                    }

                sh "docker image rm ${DOCKER_IMAGE}"
                sh "docker image rm ${DOCKER_IMAGE}:latest"
            }
        }
    }

    post {
        success {
            echo 'SUCCESSFUL'
        }
        failure {
            echo 'FAILED'
        }
    }
}
