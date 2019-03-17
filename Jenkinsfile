def webacs = "https://github.com/asterics/WebACS.git"

pipeline {
    parameters {
        choice(name: 'agent', description: 'Agent', choices: ['Linux', 'Win'])
        choice(name: 'image', description: 'Docker Image', choices: ['node:10', 'node:11'])
        gitParameter(branchFilter: 'origin.*/(.*)', defaultValue: env.BRANCH_NAME, name: 'BRANCH', type: 'PT_BRANCH_TAG', useRepository: "${webacs}")
    }
    agent none
    stages {
        stage('Build') {
            agent {
                docker {
                    image params.image
                    label params.agent
                }
            }
            steps {
                sh '''
                    yarn install
                    yarn build
                '''
            }
        }
        stage('Test') {
            agent {
                docker {
                    image params.image
                    label params.agent
                }
            }
            steps {
                sh '''
                    yarn global add http-server --prefix deps/
                    ./deps/bin/hs dist/ &
                    yarn test
                '''
            }
        }
        stage('Deploy') {
            agent {
                label params.agent
            }
            steps {
                sh 'zip -r WebACS.zip dist/*'
                archiveArtifacts artifacts: 'WebACS.zip', fingerprint: true
            }
        }
    }
    post {
        always {
            cleanWs cleanWhenAborted: false, cleanWhenFailure: false, cleanWhenNotBuilt: false
        }
    }
}