export interface DocSource {
  service: string;
  title: string;
  url: string;
}

export const SOURCES: DocSource[] = [
  { service: "ec2", title: "What is Amazon EC2?", url: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html" },
  { service: "s3", title: "What is Amazon S3?", url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html" },
  { service: "lambda", title: "What is AWS Lambda?", url: "https://docs.aws.amazon.com/lambda/latest/dg/welcome.html" },
  { service: "iam", title: "What is AWS IAM?", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html" },
  { service: "vpc", title: "What is Amazon VPC?", url: "https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html" },
  { service: "rds", title: "What is Amazon RDS?", url: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html" },
  { service: "dynamodb", title: "What is Amazon DynamoDB?", url: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html" },
  { service: "cloudfront", title: "What is Amazon CloudFront?", url: "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html" },
  { service: "route53", title: "What is Amazon Route 53?", url: "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html" },
  { service: "sqs", title: "What is Amazon SQS?", url: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html" },
  { service: "sns", title: "What is Amazon SNS?", url: "https://docs.aws.amazon.com/sns/latest/dg/welcome.html" },
  { service: "api-gateway", title: "What is Amazon API Gateway?", url: "https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html" },
  { service: "cloudwatch", title: "What is Amazon CloudWatch?", url: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html" },
  { service: "ecs", title: "What is Amazon ECS?", url: "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html" },
  { service: "eks", title: "What is Amazon EKS?", url: "https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html" },
  { service: "fargate", title: "What is AWS Fargate?", url: "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/what-is-fargate.html" },
  { service: "bedrock", title: "What is Amazon Bedrock?", url: "https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html" },
  { service: "sagemaker", title: "What is Amazon SageMaker?", url: "https://docs.aws.amazon.com/sagemaker/latest/dg/whatis.html" },
  { service: "kinesis", title: "What is Amazon Kinesis Data Streams?", url: "https://docs.aws.amazon.com/streams/latest/dev/introduction.html" },
  { service: "redshift", title: "What is Amazon Redshift?", url: "https://docs.aws.amazon.com/redshift/latest/mgmt/welcome.html" },
  { service: "athena", title: "What is Amazon Athena?", url: "https://docs.aws.amazon.com/athena/latest/ug/what-is.html" },
  { service: "glue", title: "What is AWS Glue?", url: "https://docs.aws.amazon.com/glue/latest/dg/what-is-glue.html" },
  { service: "step-functions", title: "What is AWS Step Functions?", url: "https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html" },
  { service: "eventbridge", title: "What is Amazon EventBridge?", url: "https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-what-is.html" },
  { service: "cognito", title: "What is Amazon Cognito?", url: "https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html" },
  { service: "secrets-manager", title: "What is AWS Secrets Manager?", url: "https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html" },
  { service: "kms", title: "What is AWS KMS?", url: "https://docs.aws.amazon.com/kms/latest/developerguide/overview.html" },
  { service: "acm", title: "What is AWS Certificate Manager?", url: "https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html" },
  { service: "waf", title: "What is AWS WAF?", url: "https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html" },
  { service: "cloudtrail", title: "What is AWS CloudTrail?", url: "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html" },
  { service: "well-architected", title: "AWS Well-Architected Framework", url: "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html" },
];
