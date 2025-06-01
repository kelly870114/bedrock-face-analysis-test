import { PubSub } from '@aws-amplify/pubsub';

class PubSubService {
  constructor() {
    this.subscriptions = {};
    this.isConnected = false;
  }

  /**
   * 訂閱指定的主題
   * @param {string} sessionId - 會話ID
   * @param {object} callbacks - 回調函數對象
   */
  connect(sessionId, callbacks) {
    try {
      console.log(`準備訂閱主題: face-analysis/${sessionId}/+`);
      this.sessionId = sessionId;
      
      // 臉型分析
      this.subscriptions.faceShape = PubSub.subscribe(`face-analysis/${sessionId}/result/faceShape`).subscribe({
        next: data => {
          console.log('收到臉型分析結果:', data.value);
          if (callbacks.onFaceShapeUpdate) callbacks.onFaceShapeUpdate(data.value);
        },
        error: error => this.handleError(error, callbacks.onError)
      });
      
      // 五官分析
      this.subscriptions.features = PubSub.subscribe(`face-analysis/${sessionId}/result/features`).subscribe({
        next: data => {
          console.log('收到五官分析結果:', data.value);
          if (callbacks.onFeaturesUpdate) callbacks.onFeaturesUpdate(data.value);
        },
        error: error => this.handleError(error, callbacks.onError)
      });
      
      // 綜合分析
      this.subscriptions.overall = PubSub.subscribe(`face-analysis/${sessionId}/result/overall`).subscribe({
        next: data => {
          console.log('收到綜合分析結果:', data.value);
          if (callbacks.onOverallUpdate) callbacks.onOverallUpdate(data.value);
        },
        error: error => this.handleError(error, callbacks.onError)
      });
      
      // 【優化】狀態更新 - 更詳細的狀態處理
      this.subscriptions.status = PubSub.subscribe(`face-analysis/${sessionId}/status`).subscribe({
        next: data => {
          console.log('收到狀態更新:', data.value);
          const statusData = data.value;
          
          // 根據不同階段提供更具體的狀態更新
          if (statusData.stage && statusData.status) {
            console.log(`階段 ${statusData.stage} 狀態更新為: ${statusData.status}`);
          }
          
          if (callbacks.onStatusUpdate) callbacks.onStatusUpdate(statusData);
        },
        error: error => this.handleError(error, callbacks.onError)
      });
      
      // 錯誤訊息
      this.subscriptions.error = PubSub.subscribe(`face-analysis/${sessionId}/error`).subscribe({
        next: data => {
          console.log('收到錯誤訊息:', data.value);
          const errorData = data.value;
          
          // 【優化】更詳細的錯誤處理
          let errorMessage = '分析過程中發生錯誤';
          if (errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData.stage) {
            errorMessage = `${errorData.stage} 階段分析失敗`;
          }
          
          if (callbacks.onError) callbacks.onError(errorMessage);
        },
        error: error => this.handleError(error, callbacks.onError)
      });
      
      // 分析完成
      this.subscriptions.completed = PubSub.subscribe(`face-analysis/${sessionId}/completed`).subscribe({
        next: data => {
          console.log('收到分析完成訊息:', data.value);
          if (callbacks.onCompleted) callbacks.onCompleted(data.value);
        },
        error: error => this.handleError(error, callbacks.onError)
      });
      
      console.log('成功訂閱所有主題');
      this.isConnected = true;
      return true;
    } catch (error) {
      console.error('訂閱主題時發生錯誤:', error);
      if (callbacks.onError) callbacks.onError('無法建立即時連線，請重新嘗試');
      return false;
    }
  }
  
  /**
   * 統一錯誤處理
   */
  handleError(error, callback) {
    console.error('PubSub錯誤:', error);
    
    // 更友善的錯誤訊息
    let friendlyMessage = '連線發生問題，請重新嘗試';
    
    if (error.message) {
      if (error.message.includes('Connection')) {
        friendlyMessage = '網路連線中斷，請檢查網路後重試';
      } else if (error.message.includes('Auth')) {
        friendlyMessage = '認證失敗，請重新整理頁面';
      } else if (error.message.includes('Permission')) {
        friendlyMessage = '權限不足，請聯絡管理員';
      }
    }
    
    if (callback) callback(friendlyMessage);
  }

  /**
   * 檢查連線狀態
   */
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      sessionId: this.sessionId,
      activeSubscriptions: Object.keys(this.subscriptions).length
    };
  }

  /**
   * 重新連線功能
   */
  reconnect(callbacks) {
    console.log('嘗試重新連線...');
    this.disconnect();
    
    if (this.sessionId) {
      return this.connect(this.sessionId, callbacks);
    }
    
    console.warn('無法重新連線：缺少 sessionId');
    return false;
  }

  /**
   * 斷開連接並取消所有訂閱
   */
  disconnect() {
    if (!this.isConnected) return true;
    
    console.log('斷開PubSub連接');
    try {
      Object.keys(this.subscriptions).forEach(key => {
        console.log(`取消訂閱: ${key}`);
        if (this.subscriptions[key]) {
          this.subscriptions[key].unsubscribe();
        }
      });
      
      this.subscriptions = {};
      this.isConnected = false;
      this.sessionId = null; // 清除 sessionId
      console.log('成功取消所有訂閱');
      return true;
    } catch (error) {
      console.error('取消訂閱時發生錯誤:', error);
      return false;
    }
  }
}

// 創建單例，以便在整個應用中共享
const pubSubService = new PubSubService();
export default pubSubService;