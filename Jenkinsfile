
pipeline {
  parameters {
    choice(name: 'destination', description: 'Destination folder', choices: ['asterics-web-devlinux/WebACS', 'asterics-web-devwindows/WebACS', 'asterics-web-production/WebACS' ])
    choice(name: 'agent', description: 'Agent', choices: ['Linux', 'Win'])
    choice(name: 'image', description: 'Docker Image', choices: ['node:10', 'node:11'])
    gitParameter(name: 'BRANCH', branchFilter: 'origin.*?/(.*)', defaultValue: 'master', type: 'PT_BRANCH_TAG', useRepository: 'WebACS')
  }
  agent none
  stages {
    stage('Cleanup') {
      agent {
        label params.agent
      }
      steps {
        deleteDir()
      }
    }
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
    stage('Archive') {
      agent {
          label params.agent
      }
      steps {
          sh 'cd dist && zip -r ../WebACS.zip *'
          archiveArtifacts artifacts: 'WebACS.zip', fingerprint: true
      }
    }
    stage('Deploy') {
      environment {
        SERVER = credentials('server')
      }
      agent {
          label params.agent
      }
      steps {
        sh '''
          mkdir build
          mv dist build/WebACS
        '''
        script {
          def remote = [ name: 'studyathome', host: 'studyathome.technikum-wien.at', user: env.SERVER_USR, password: env.SERVER_PSW, allowAnyHosts: true ]
          sshRemove remote: remote, path: "/var/www/html/${params.destination}", failOnError: false
          sshPut remote: remote, from: 'build/WebACS', into: "/var/www/html/${params.destination.replace("/WebACS", "")}"
        }
      }
    }
  }
  post {
    always {
      cleanWs cleanWhenAborted: false, cleanWhenFailure: false, cleanWhenNotBuilt: false
    }
  }
}