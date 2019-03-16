def webacs = "https://github.com/asterics/WebACS.git"

pipeline {
    parameters {
        choice(name: 'agent', description: 'Agent', choices: ['Linux', 'Win'])
        choice(name: 'image', description: 'Docker Image', choices: ['node:10', 'node:11'])
        gitParameter(branchFilter: 'origin.*/(.*)', defaultValue: env.BRANCH_NAME, name: 'BRANCH', type: 'PT_BRANCH_TAG', useRepository: "${webacs}")
    }
    agent {
        docker {
            image params.image
            label params.agent
        }
    }
    stages {
        stage('Test') {
            steps {
                sh '''
                    mkdir deps
                    yarn global add http-server --prefix deps/
                    ./deps/bin/hs dist/ &
                    yarn test
                    kill -2 $(ps aux | grep 'bin/hs' | awk '{print $2}')
                '''
            }
        }
        stage('Build') {
            steps {
                sh '''
                    yarn install
                    yarn build
                '''
            }
        }
        stage('Bundle') {
            steps {
                zip zipFile: 'WebACS.zip', archive: false, dir: 'dist'
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