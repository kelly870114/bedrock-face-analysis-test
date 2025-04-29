// src/config/amplify.js
import { Amplify } from 'aws-amplify';
import { IoTProvider } from '@aws-amplify/pubsub';

export const configureAmplify = (region, identityPoolId, iotEndpoint) => {
  Amplify.configure({
    Auth: {
      // 指定無身份提供者的身份池
      identityPoolId: identityPoolId,
      region: region,
      mandatorySignIn: false,
      authenticationFlowType: 'USER_SRP_AUTH'
    },
    // 確保PubSub配置正確
    PubSub: {
      aws_pubsub_endpoint: `wss://${iotEndpoint}/mqtt`,
      aws_pubsub_region: region,
      provider: 'IoTProvider'
    }
  });
};