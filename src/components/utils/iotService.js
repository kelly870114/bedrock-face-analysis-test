import AWS from 'aws-sdk';
import mqtt from 'mqtt';
import { config } from '../../config';

// 初始化 AWS 認證
const initializeCredentials = async () => {
  AWS.config.region = 'us-east-1';
  
  // 設置 Cognito 認證
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: config.cognitoIdentityPoolId,
  });
  
  // 刷新認證
  try {
    await AWS.config.credentials.getPromise();
    return AWS.config.credentials;
  } catch (error) {
    console.error('獲取 AWS 認證失敗:', error);
    throw error;
  }
};

// 創建簽名 URL
const getSignedUrl = async () => {
  try {
    const credentials = await initializeCredentials();
    
    // 創建 IoT 客戶端
    const iotClient = new AWS.IotData({
      endpoint: `https://${config.iotEndpoint}`,
      credentials: AWS.config.credentials,
    });
    
    // 獲取簽名 URL
    return new Promise((resolve, reject) => {
      const params = {
        protocol: 'wss',
        host: config.iotEndpoint,
      };
      
      const url = iotClient.getSignedUrl('Connect', params);
      resolve(url);
    });
  } catch (error) {
    console.error('獲取簽名 URL 失敗:', error);
    throw error;
  }
};

// 連接 IoT 並訂閱主題
export const connectIoT = async (sessionId, handlers) => {
  try {
    // 獲取簽名的 WebSocket URL
    const signedUrl = await getSignedUrl();
    
    // 創建 MQTT 客戶端
    const client = mqtt.connect(signedUrl);
    
    return new Promise((resolve, reject) => {
      client.on('connect', () => {
        console.log('已連接到 AWS IoT');
        
        // 訂閱狀態主題
        client.subscribe(`face-analysis/${sessionId}/status`, (err) => {
          if (err) {
            console.error('訂閱狀態主題失敗:', err);
          } else {
            console.log(`已訂閱狀態主題 face-analysis/${sessionId}/status`);
          }
        });
        
        // 訂閱各階段結果主題
        const stages = ['faceShape', 'features', 'overall'];
        stages.forEach(stage => {
          client.subscribe(`face-analysis/${sessionId}/result/${stage}`, (err) => {
            if (err) {
              console.error(`訂閱 ${stage} 結果主題失敗:`, err);
            } else {
              console.log(`已訂閱結果主題 face-analysis/${sessionId}/result/${stage}`);
            }
          });
        });
        
        // 訂閱錯誤主題
        client.subscribe(`face-analysis/${sessionId}/error`, (err) => {
          if (err) {
            console.error('訂閱錯誤主題失敗:', err);
          } else {
            console.log(`已訂閱錯誤主題 face-analysis/${sessionId}/error`);
          }
        });
        
        // 訂閱完成主題
        client.subscribe(`face-analysis/${sessionId}/completed`, (err) => {
          if (err) {
            console.error('訂閱完成主題失敗:', err);
          } else {
            console.log(`已訂閱完成主題 face-analysis/${sessionId}/completed`);
          }
        });
        
        // 設置消息處理
        client.on('message', (topic, message) => {
          try {
            const data = JSON.parse(message.toString());
            console.log(`收到主題 ${topic} 的消息:`, data);
            
            if (topic === `face-analysis/${sessionId}/status`) {
              handlers.onStatus && handlers.onStatus(data);
            } else if (topic.includes('/result/')) {
              const stage = topic.split('/').pop();
              handlers.onStageResult && handlers.onStageResult(stage, data);
            } else if (topic === `face-analysis/${sessionId}/error`) {
              handlers.onError && handlers.onError(data);
            } else if (topic === `face-analysis/${sessionId}/completed`) {
              handlers.onComplete && handlers.onComplete(data);
            }
          } catch (error) {
            console.error('處理收到的消息時出錯:', error);
          }
        });
        
        client.on('error', (err) => {
          console.error('MQTT 客戶端錯誤:', err);
          handlers.onConnectionError && handlers.onConnectionError(err);
        });
        
        // 返回客戶端和斷開連接的方法
        resolve({
          disconnect: () => {
            try {
              client.end();
              console.log('已斷開 IoT 連接');
            } catch (e) {
              console.warn('斷開連接時出錯:', e);
            }
          }
        });
      });
      
      client.on('error', (err) => {
        console.error('連接到 IoT 失敗:', err);
        reject(err);
      });
    });
  } catch (error) {
    console.error('IoT 服務初始化失敗:', error);
    throw error;
  }
};