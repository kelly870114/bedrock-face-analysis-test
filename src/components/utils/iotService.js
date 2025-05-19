import { Auth } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub';
import { PubSub } from '@aws-amplify/pubsub';
import { config } from '../../config';

// 初始化 PubSub 配置
let isConfigured = false;

const configurePubSub = async () => {
  if (isConfigured) return;
  
  try {
    // 添加 IoT Provider
    Auth.configure({
      identityPoolId: config.cognitoIdentityPoolId,
      region: 'us-east-1'
    });
    
    // 配置 IoT Provider
    const iotProvider = new AWSIoTProvider({
      aws_pubsub_region: 'us-east-1',
      aws_pubsub_endpoint: `wss://${config.iotEndpoint}/mqtt`,
    });
    
    // 添加 provider 到 PubSub
    PubSub.addPluggable(iotProvider);
    
    isConfigured = true;
    console.log('PubSub 已配置完成');
  } catch (error) {
    console.error('配置 PubSub 失敗:', error);
    throw error;
  }
};

// 連接 IoT 並訂閱主題
export const connectIoT = async (sessionId, handlers) => {
  try {
    if (!sessionId) {
      throw new Error('缺少必要的 session_id 參數');
    }
    
    console.log(`正在設置IoT連接，session_id: ${sessionId}`);
    
    // 確保 PubSub 已配置
    await configurePubSub();
    
    // 訂閱主題
    const statusTopic = `face-analysis/${sessionId}/status`;
    const errorTopic = `face-analysis/${sessionId}/error`;
    const completedTopic = `face-analysis/${sessionId}/completed`;
    
    console.log(`準備訂閱主題: face-analysis/${sessionId}/+`);
    
    // 訂閱狀態主題
    const statusSubscription = PubSub.subscribe(statusTopic).subscribe({
      next: data => {
        console.log(`收到狀態更新:`, data.value);
        handlers.onStatus && handlers.onStatus(data.value);
      },
      error: error => {
        console.error(`狀態主題訂閱錯誤:`, error);
        handlers.onConnectionError && handlers.onConnectionError(error);
      }
    });
    
    // 訂閱階段結果主題
    const stageSubscriptions = [];
    const stages = ['faceShape', 'features', 'overall'];
    
    stages.forEach(stage => {
      const topic = `face-analysis/${sessionId}/result/${stage}`;
      const subscription = PubSub.subscribe(topic).subscribe({
        next: data => {
          console.log(`收到 ${stage} 階段結果:`, data.value);
          handlers.onStageResult && handlers.onStageResult(stage, data.value);
        },
        error: error => {
          console.error(`${stage} 結果主題訂閱錯誤:`, error);
        }
      });
      stageSubscriptions.push(subscription);
    });
    
    // 訂閱錯誤主題
    const errorSubscription = PubSub.subscribe(errorTopic).subscribe({
      next: data => {
        console.error(`收到錯誤:`, data.value);
        handlers.onError && handlers.onError(data.value);
      },
      error: error => {
        console.error(`錯誤主題訂閱錯誤:`, error);
      }
    });
    
    // 訂閱完成主題
    const completedSubscription = PubSub.subscribe(completedTopic).subscribe({
      next: data => {
        console.log(`收到完成通知:`, data.value);
        handlers.onComplete && handlers.onComplete(data.value);
      },
      error: error => {
        console.error(`完成主題訂閱錯誤:`, error);
      }
    });
    
    console.log('成功訂閱所有主題');
    
    // 返回客戶端和斷開連接的方法
    return {
      disconnect: () => {
        try {
          statusSubscription.unsubscribe();
          errorSubscription.unsubscribe();
          completedSubscription.unsubscribe();
          stageSubscriptions.forEach(sub => sub.unsubscribe());
          console.log('已斷開所有IoT訂閱');
        } catch (e) {
          console.warn('斷開訂閱時出錯:', e);
        }
      }
    };
  } catch (error) {
    console.error('IoT 服務初始化失敗:', error);
    throw error;
  }
};