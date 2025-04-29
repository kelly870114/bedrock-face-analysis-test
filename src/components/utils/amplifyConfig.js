import { Amplify } from 'aws-amplify';
import { AWSIoTProvider, PubSub } from '@aws-amplify/pubsub';

// 這個函數將初始化 Amplify 和 IoT 提供者
export const configureAmplifyIoT = (config) => {
  try {
    // 設置區域和身份池ID
    const region = config.region;
    const identityPoolId = config.cognitoIdentityPoolId;
    const iotEndpoint = config.iotEndpoint;
    
    console.log("正在配置 Amplify...");
    
    // 先配置Auth，這是必要的
    Amplify.configure({
      // 只配置Auth，不配置其他組件
      Auth: {
        identityPoolId: identityPoolId,
        region: region,
        mandatorySignIn: false
      }
    });
    
    console.log("Auth配置完成，添加IoT提供者...");
    
    // 然後單獨添加IoT提供者
    PubSub.addPluggable(new AWSIoTProvider({
      aws_pubsub_region: region,
      aws_pubsub_endpoint: `wss://${iotEndpoint}/mqtt`,
    }));
    
    console.log("IoT提供者添加成功");
    return true;
  } catch (error) {
    console.error("Amplify配置錯誤:", error);
    return false;
  }
};