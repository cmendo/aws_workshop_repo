import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AppCdkStack } from '../lib/app-cdk-stack';
<<<<<<< HEAD
<<<<<<< HEAD
import { PipelineCdkStack } from '../lib/pipeline-cdk-stack';
=======
import { MyPipelineStack } from '../lib/pipeline-cdk-stack';
>>>>>>> parent of 0c3d7d3 (Delete app-cdk directory)
=======
import { MyPipelineStack } from '../lib/pipeline-cdk-stack';
>>>>>>> parent of 0c3d7d3 (Delete app-cdk directory)
import { EcrCdkStack } from '../lib/ecr-cdk-stack';

const app = new cdk.App();

const ecrCdkStack = new EcrCdkStack(app, 'ecr-stack', {});

const testCdkStack = new AppCdkStack(app, 'test', {
    ecrRepository: ecrCdkStack.repository,
});

<<<<<<< HEAD
<<<<<<< HEAD
const prodCdkStack = new AppCdkStack(app, 'prod', {
    ecrRepository: ecrCdkStack.repository,
});

const pipelineCdkStack = new PipelineCdkStack(app, 'pipeline-stack', {
    ecrRepository: ecrCdkStack.repository,
    fargateServiceTest: testCdkStack.fargateService,
    fargateServiceProd: prodCdkStack.fargateService,
=======
const pipelineCdkStack = new MyPipelineStack(app, 'pipeline-stack', {
    ecrRepository: ecrCdkStack.repository,
    fargateServiceTest: testCdkStack.fargateService,
>>>>>>> parent of 0c3d7d3 (Delete app-cdk directory)
=======
const pipelineCdkStack = new MyPipelineStack(app, 'pipeline-stack', {
    ecrRepository: ecrCdkStack.repository,
    fargateServiceTest: testCdkStack.fargateService,
>>>>>>> parent of 0c3d7d3 (Delete app-cdk directory)
});