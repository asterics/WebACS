
pipeline {
  parameters {
    booleanParam(name: 'deploy', defaultValue: true, description: 'Deploy build')
    booleanParam(name: 'store', defaultValue: false, description: 'Store build')
    booleanParam(name: 'release', defaultValue: false, description: 'Release build')
    password(name: 'GH_TOKEN', defaultValue: '', description: 'Github user token. Note: don\'t use a password, will be logged to console on error.')
    choice(name: 'destination', description: 'Destination folder', choices: ['asterics-web-devlinux/WebACS', 'asterics-web-devwindows/WebACS', 'asterics-web-production/WebACS' ])
    choice(name: 'agent', description: 'Agent', choices: ['Linux', 'Win'])
    choice(name: 'image', description: 'Docker Image', choices: ['node:10', 'node:11'])
    gitParameter(name: 'BRANCH', branchFilter: 'origin.*?/(.*)', defaultValue: 'master', type: 'PT_BRANCH_TAG', useRepository: 'WebACS')
  }
  triggers {
    // pollSCM('H/15 * * * *')
    pollSCM('* * * * *')
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
    stage('Prepare') {
      when { 
        anyOf { 
          equals expected: true, actual: params.release
          equals expected: true, actual: params.store
        }
      }
      agent {
        label params.agent
      }
      steps {
        sh 'cd dist && zip -r ../WebACS.zip *'
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
    stage('Output') {
      parallel {
        stage('Deploy') {
          when {
            equals expected: true, actual: params.deploy
          }
          agent {
            label params.agent
          }
          environment {
            SERVER = credentials('server')
          }
          steps {
            sh '''
              mkdir build
              ln -s ../dist build/WebACS
            '''
            script {
              def remote = [ name: 'studyathome', host: 'studyathome.technikum-wien.at', user: env.SERVER_USR, password: env.SERVER_PSW, allowAnyHosts: true ]
              sshRemove remote: remote, path: "/var/www/html/${params.destination}", failOnError: false
              sshPut remote: remote, from: 'build/WebACS', into: "/var/www/html/${params.destination.replace("/WebACS", "")}"
            }
          }
        }
        stage('Store') {
          when {
            equals expected: true, actual: params.store
          }
          agent {
            label params.agent
          }
          steps {
            archiveArtifacts artifacts: 'WebACS.zip', fingerprint: true
            archiveArtifacts artifacts: 'dist/build.json', fingerprint: true
          }
        }
        stage('Release') {
          when {
            // branch 'master'
            // changeset 'assets'
            equals expected: true, actual: params.release
          }
          agent {
            docker {
              image params.image
              label params.agent
            }
          }
          environment {
            GIT_BRANCH = "$BRANCH"
          }
          steps {
            sh '''
              git checkout $BRANCH
              git pull
              yarn release:prepare
              yarn release --branch $BRANCH
            '''
          }
        }
      }
    }
  }
}