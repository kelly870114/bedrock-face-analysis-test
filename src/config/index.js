export const config = {
  apiEndpoint: process.env.REACT_APP_API_ENDPOINT || 'https://9zrvjl4tx7.execute-api.us-east-1.amazonaws.com/prod',
  // 使用您的 Cognito Identity Pool ID
  cognitoIdentityPoolId: 'us-east-1:443dfd99-637e-4845-a41a-df1e349a9427',
  // 使用您的 IoT 端點
  iotEndpoint: 'a39n9041f2gqr0-ats.iot.us-east-1.amazonaws.com'
};