#!/bin/bash

#
# Copyright 2024 Amazon.com, Inc. or its affiliates. All Rights Reserved.
#
# Permission is hereby granted, free of charge, to any person obtaining a copy of this
# software and associated documentation files (the "Software"), to deal in the Software
# without restriction, including without limitation the rights to use, copy, modify,
# merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
# permit persons to whom the Software is furnished to do so.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
# INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
# PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
# HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
# OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
# SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
#

#title           fastForward.sh
#summary         This script configures a users environment if they are skipping to a lab.
#author          @rawlsimo
#contributors    
#date            2024-03-04
#version         1.0
#usage           sh fastForward 1 typescript # fast forward to after lab 1 using typescript
#versions:
#   1.0: Initial version.
#==============================================================================

lab=$1
language=$2

case $lab in
  1)
    source_directory="10-application-development";;
  2)
    source_directory="20-source-control";;
  3)
    source_directory="30-continuous-integration";;
  4)
    source_directory="40-continuous-delivery";;
  5)
    source_directory="50-blue-green";;
  6)
    source_directory="60-observeability";;
esac

echo "[0/12] Remove existing application - estimated time to completion: 0 - 3 minutes"
if [ -d "cicd_workshop" ] 
then
  rm -rf cicd_workshop
fi
if [ -d "temp" ] 
then
  rm -rf temp
fi

echo "[1/12] Unzip code - estimated time to completion: <1 minute"
unzip -q -o code.zip -d temp
#rm code.zip #leave the file so the script can be re-run

mkdir cicd_workshop

# bootstrap if $langage is typescript
if [ ${language} = "typescript" ]
then
  echo "[2/12] Bootstrap application - estimated time to completion: 3 minutes"
  cd cicd_workshop
  yes y | npm create vite@latest my-app -- --template react-ts -y
  cd my-app
  npm install

  if [ ${lab} -gt 2 ]
  then
    npm install -D vitest jsdom @testing-library/react
    sed -i '7 a \    "test": "vitest",\n\    "test:junit": "vitest --reporter=junit --outputFile=./junit.xml",' package.json
  fi
  cd ../..
fi

if [ ${lab} -gt 1 ]
then
  echo "[3/12] Initialize Git - estimated time to completion: <1 minute"
  # Set default branch
  git config --global init.defaultBranch main

  # skip git config, otherwise we'd have to ask for input
  #git config --global user.name "your-user-name"
  #git config --global user.email your-email-address

  # Init local repo
  cd cicd_workshop
  git init
  cd ..
fi

if [ ${lab} -gt 1 ]
then
  echo "[4/12] Initialize CDK - estimated time to completion: 2 minutes"
  # Init cdk

  mkdir -p cicd_workshop/app-cdk && cd cicd_workshop/app-cdk

  cdk init app --language=${language}
  cdk bootstrap
  cd ../..
fi

echo "[5/12] Update code to lab 3 - estimated time to completion: <1 minute"
if [ ${lab} -gt 2 ]
then
  cp -r temp/${language}/30-continuous-integration/cicd_workshop .
else
  cp -r temp/${language}/${source_directory}/cicd_workshop .
fi

if [ "${language}" == "python" ]
then
  echo "[6/12] Initialising Python - estimated time to completion: 2 minutes"
  cd cicd_workshop/my-app
  python3 -m venv .venv
  source .venv/bin/activate
  pip install -r requirements.txt
  cd ..

  if [ ${lab} -gt 1 ]
  then
    cd app-cdk
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    cd ..
  fi
  cd ..
fi

if [ ${lab} -gt 1 ]
then
  echo "[7/12] Deploy pipeline stack - estimated time to completion: 5 minutes"

  cd cicd_workshop/app-cdk
  cdk deploy pipeline-stack --outputs-file stackOut --require-approval never

  # capture the repo
  REPO=$(cat stackOut | grep CodeCommitRepositoryUrl | cut -d\" -f4)
  rm stackOut

  # add the origin
  cd ..
  git remote add origin $REPO

  cd ..
fi

if [ ${lab} -gt 1 ]
then
  echo "[8/12] Push to CodeCommit - estimated time to completion: 2 minutes"

  cd cicd_workshop
  git add .
  git commit -m "Initial Commit"
  git push --set-upstream origin main
  cd ..
fi

if [ ${lab} -gt 3 ]
then
  echo "[9/12] Update code to lab ${lab} - estimated time to completion: <1 minute"
  cp -r temp/${language}/${source_directory}/cicd_workshop .

  echo "[10/12] Deploy pipeline stack - estimated time to completion: 5 minutes"
  cd cicd_workshop/app-cdk
  cdk deploy pipeline-stack --outputs-file stackOut --require-approval never

  if [ ${lab} -gt 4 ]
  then
    # update taskdef.json and appspec.yaml
    EXECROLE=$(cat stackOut | jq -r '."prod-app-stack".ExecutionRoleArn')
    TASKDEF=$(cat stackOut | jq -r '."prod-app-stack".TaskDefinitionArn')
    TASKFAMILIY=$(cat stackOut | jq -r '."prod-app-stack".TaskDefinitionFamily')
    IMAGE=$(aws ecs describe-task-definition --task-definition $TASKDEF | jq -r '.taskDefinition.containerDefinitions[0] .image')

    cd ~/Workshop/cicd_workshop
    sed -i 's,<TASK_DEFINITION>,'"$TASKDEF"',g' appspec.yaml
    sed -i 's,arn:aws:iam::<ACCOUNT>:role/<ECS-TASKDEF-EXECUTION-ROLE>,'"$EXECROLE"',g' taskdef.json
    sed -i 's,<ECS-TASKDEF-FAMILY-NAME>,'"$TASKFAMILIY"',g' taskdef.json
    sed -i 's,<ACCOUNT>.dkr.ecr.<REGION>.amazonaws.com/<ECR-IMAGE>:latest,'"$IMAGE"',g' taskdef.json
  fi

  echo "[11/12] Push to CodeCommit - estimated time to completion: 2 minutes"
  cd ~/Workshop/cicd_workshop
  git add .
  git commit -m "Application stack"
  git push origin main
  cd ..
fi

echo "[12/12] Cleanup - estimated time to completion: <1 minute"
rm -rf temp
