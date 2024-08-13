<<<<<<< HEAD
import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as cdk from 'aws-cdk-lib';
interface ConsumerProps extends StackProps {
  ecrRepository: ecr.Repository,
  fargateServiceTest: ecsPatterns.ApplicationLoadBalancedFargateService,
  fargateServiceProd: ecsPatterns.ApplicationLoadBalancedFargateService,
}

export class PipelineCdkStack extends cdk.Stack {
=======
import * as cdk from 'aws-cdk-lib';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
interface ConsumerProps extends StackProps {
  ecrRepository: ecr.Repository,
  fargateServiceTest: ecsPatterns.ApplicationLoadBalancedFargateService,
}

export class MyPipelineStack extends cdk.Stack {
>>>>>>> parent of 0c3d7d3 (Delete app-cdk directory)
  constructor(scope: Construct, id: string, props: ConsumerProps) {
    super(scope, id, props);

    // Recupera el secreto de GitHub
    const githubSecret = secretsmanager.Secret.fromSecretNameV2(this, 'aws/secretsmanager', 'github/personal_access_token');
    
<<<<<<< HEAD
    // Define el pipeline
    const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      pipelineName: 'CICD_Pipeline',
      crossAccountKeys: false,
    });

    // Crea un proyecto de CodeBuild -- agregamos el enviroment
    const codeBuild = new codebuild.PipelineProject(this, 'BuildProject', {
=======
    // Crea un proyecto de CodeBuild -- agregamos el enviroment
    const buildProject = new codebuild.PipelineProject(this, 'BuildProject', {
>>>>>>> parent of 0c3d7d3 (Delete app-cdk directory)
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
        privileged: true,
        computeType: codebuild.ComputeType.LARGE,
      },
      buildSpec: codebuild.BuildSpec.fromSourceFilename('buildspec_test.yml'),
    });

<<<<<<< HEAD
=======
    // Define el pipeline
    const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      pipelineName: 'CICD_Pipeline',
    });

>>>>>>> parent of 0c3d7d3 (Delete app-cdk directory)
    const dockerBuild = new codebuild.PipelineProject(this, 'DockerBuild', {
      environmentVariables: {
        IMAGE_TAG: { value: 'latest' },
        IMAGE_REPO_URI: { value: props.ecrRepository.repositoryUri },
        AWS_DEFAULT_REGION: { value: process.env.CDK_DEFAULT_REGION },
      },
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
        privileged: true,
        computeType: codebuild.ComputeType.LARGE,
      },
      buildSpec: codebuild.BuildSpec.fromSourceFilename('buildspec_docker.yml'),
    });

    const dockerBuildRolePolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: [
        'ecr:GetAuthorizationToken',
        'ecr:BatchCheckLayerAvailability',
        'ecr:GetDownloadUrlForLayer',
        'ecr:GetRepositoryPolicy',
        'ecr:DescribeRepositories',
        'ecr:ListImages',
        'ecr:DescribeImages',
        'ecr:BatchGetImage',
        'ecr:InitiateLayerUpload',
        'ecr:UploadLayerPart',
        'ecr:CompleteLayerUpload',
        'ecr:PutImage',
      ],
    });

    dockerBuild.addToRolePolicy(dockerBuildRolePolicy);

<<<<<<< HEAD
    // Define los artefactos
    const sourceOutput = new codepipeline.Artifact();
    const unitTestOutput = new codepipeline.Artifact();
=======
   /* const signerARNParameter = new ssm.StringParameter(this, 'SignerARNParam', {
      parameterName: 'signer-profile-arn',
      stringValue: 'arn:aws:signer:us-east-1:808759191433:/signing-profiles/ecr_signing_profile',
    });

    const signerParameterPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [signerARNParameter.parameterArn],
      actions: ['ssm:GetParametersByPath', 'ssm:GetParameters'],
    });*/

    //dockerBuild.addToRolePolicy(signerParameterPolicy);

    const signerPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: [
        'signer:PutSigningProfile',
        'signer:SignPayload',
        'signer:GetRevocationStatus',
      ],
    });

  //  dockerBuild.addToRolePolicy(signerPolicy);

    // Define los artefactos
    const sourceOutput = new codepipeline.Artifact();
    const buildOutput = new codepipeline.Artifact();
>>>>>>> parent of 0c3d7d3 (Delete app-cdk directory)
    const dockerBuildOutput = new codepipeline.Artifact();

    // Agrega la etapa de origen con GitHub
    pipeline.addStage({
      stageName: 'Source',
      actions: [
        new codepipeline_actions.GitHubSourceAction({
          actionName: 'GitHub_Source',
          owner: 'cmendo',
          repo: 'aws_workshop_repo',
          branch: 'main', // o la rama que prefieras
          oauthToken: githubSecret.secretValue, 
          output: sourceOutput,
        }),
      ],
    });

    // Agrega la etapa de construcción
    pipeline.addStage({
<<<<<<< HEAD
      stageName: 'Code-Quality-Testing',
      actions: [
        new codepipeline_actions.CodeBuildAction({
          actionName: 'Unit-Test',
          project: codeBuild,
          input: sourceOutput,
          outputs: [unitTestOutput],
        }),
      ],
    });
  
=======
      stageName: 'Build',
      actions: [
        new codepipeline_actions.CodeBuildAction({
          actionName: 'Build',
          project: buildProject,
          input: sourceOutput,
          outputs: [buildOutput],
        }),
      ],
    });

>>>>>>> parent of 0c3d7d3 (Delete app-cdk directory)
    pipeline.addStage({
      stageName: 'Docker-Push-ECR',
      actions: [
        new codepipeline_actions.CodeBuildAction({
          actionName: 'Docker-Build',
          project: dockerBuild,
          input: sourceOutput,
          outputs: [dockerBuildOutput],
        }),
      ],
    });

    pipeline.addStage({
      stageName: 'Deploy-Test',
      actions: [
        new codepipeline_actions.EcsDeployAction({
          actionName: 'Deploy-Fargate-Test',
          service: props.fargateServiceTest.service,
          input: dockerBuildOutput,
        }),
      ]
    });

<<<<<<< HEAD
    /*pipeline.addStage({
      stageName: 'Deploy-Production',
      actions: [
        new codepipeline_actions.ManualApprovalAction({
          actionName: 'Approve-Deploy-Prod',
          runOrder: 1,
        }),
        new codepipeline_actions.EcsDeployAction({
          actionName: 'Deploy-Fargate-Prod',
          service: props.fargateServiceProd.service,
          input: dockerBuildOutput,
          runOrder: 2,
        }),
      ],
    });*/

=======
>>>>>>> parent of 0c3d7d3 (Delete app-cdk directory)
    // Crear una salida para la URL del pipeline
    new CfnOutput(this, 'PipelineConsoleUrl', {
      value: `https://${cdk.Aws.REGION}.console.aws.amazon.com/codesuite/codepipeline/pipelines/${pipeline.pipelineName}/view?region=${cdk.Aws.REGION}`,
    });
  }
}