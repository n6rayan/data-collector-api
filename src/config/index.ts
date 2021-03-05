export default {
  providerApi: {
    url: 'http://provider-api-mock-service:3000'
  },
  aws: {
    endpoint: 'http://localstack:4566',
    region: 'eu-west-1',
    secretAccessKey: 'AWSSECRETACCESSEY123',
    accessKeyId: 'AKIAEXAMPLE123',
    sqs: {
      queueUrl: 'http://localstack:4566/000000000000/retry-queue'
    }
  }
};