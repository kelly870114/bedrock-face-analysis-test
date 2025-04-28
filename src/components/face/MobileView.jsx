import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Camera as CameraIcon } from "lucide-react";
import { config } from "../../config";
import { connectIoT } from "../utils/iotService";
import Camera from "../common/Camera/Camera";
import {
  PageWrapper,
  ChineseContainer,
  BorderContainer,
  Corner,
  TitleContainer,
  LogoContainer,
  Container,
  Content,
  MessageBox,
  ContentWrapper,
  CameraButton,
  ImageContainer,
  ImageOverlay,
  ProgressContainer,
  ProgressItem,
  RetakeButton,
  ErrorMessage,
  //
  AnalysisBlock,
  IconImage,
  BlockTitle,
  ContentItem,
  ItemTitle,
  ItemContent,
  Summary

} from "./styles-mobile";
import AnalysisResult from "./AnalysisResult";

const MobileView = () => {
  const [searchParams] = useSearchParams();
  const [showCamera, setShowCamera] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [eventInfo, setEventInfo] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [eventId, setEventId] = useState(null);
  
  // 階段狀態
  const [stageStatus, setStageStatus] = useState({
    faceShape: { status: 'pending', result: null },
    features: { status: 'pending', result: null },
    overall: { status: 'pending', result: null, summary: null }
  });
  
  // IoT 連接引用
  const iotClientRef = useRef(null);
  
  // 檢查活動存在性和訪問權限
  useEffect(() => {
    const checkEventAccess = async () => {
      try {
        const eventIdFromParams = searchParams.get("event");

        if (!eventIdFromParams) {
          setError("無效的活動代碼");
          setIsLoading(false);
          return;
        }

        setEventId(eventIdFromParams);

        const response = await fetch(
          `${config.apiEndpoint}/checkEvent?event=${eventIdFromParams}`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!data.isAccessible) {
          setError(data.message || "活動未開放");
          setEventInfo({
            name: data.eventName,
            message: data.message,
          });
          setIsLoading(false);
          return;
        }

        setEventInfo({
          name: data.eventName,
          message: data.message,
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError("系統發生錯誤，請稍後再試");
        setIsLoading(false);
      }
    };

    checkEventAccess();
  }, [searchParams]);
  
  // 組件卸載時清理 IoT 連接
  useEffect(() => {
    return () => {
      if (iotClientRef.current) {
        iotClientRef.current.disconnect();
      }
    };
  }, []);
  
  // 設置 IoT 連接和訂閱
  const setupIoTConnection = async (newSessionId) => {
    try {
      // 先清理舊連接
      if (iotClientRef.current) {
        iotClientRef.current.disconnect();
      }
      
      // 創建新連接
      const iotClient = await connectIoT(newSessionId, {
        onStatus: handleStatusUpdate,
        onStageResult: handleStageResult,
        onError: handleIoTError,
        onComplete: handleAnalysisComplete,
        onConnectionError: handleConnectionError
      });
      
      iotClientRef.current = iotClient;
      console.log(`成功連接到 IoT 並訂閱 ${newSessionId} 相關主題`);
    } catch (error) {
      console.error("IoT 連接設置失敗:", error);
      setError("連接分析服務失敗，請重試");
      setIsAnalyzing(false);
    }
  };
  
  // 處理連接錯誤
  const handleConnectionError = (err) => {
    console.error("IoT 連接錯誤:", err);
    setError("分析服務連接中斷，請重試");
    setIsAnalyzing(false);
  };
  
  // 處理狀態更新
  const handleStatusUpdate = (data) => {
    console.log("狀態更新:", data);
    const { stage, status } = data;
    if (stage && status) {
      setStageStatus(prev => ({
        ...prev,
        [stage]: { ...prev[stage], status }
      }));
    }
  };
  
  // 處理階段結果
  const handleStageResult = (stage, data) => {
    console.log(`接收到 ${stage} 階段結果:`, data);
    if (data.result) {
      setStageStatus(prev => ({
        ...prev,
        [stage]: { 
          ...prev[stage], 
          status: 'completed', 
          result: data.result,
          summary: data.summary || prev[stage].summary
        }
      }));
    }
  };
  
  // 處理錯誤
  const handleIoTError = (data) => {
    console.error("分析錯誤:", data);
    const { stage, error: errorMsg } = data;
    if (stage) {
      setStageStatus(prev => ({
        ...prev,
        [stage]: { ...prev[stage], status: 'failed', error: errorMsg }
      }));
    }
    setError(errorMsg || "分析過程中出現錯誤");
  };
  
  // 處理分析完成
  const handleAnalysisComplete = (data) => {
    console.log("分析完成:", data);
    
    // 組合完整結果
    const fullResult = {
      faceShape: stageStatus.faceShape.result,
      features: stageStatus.features.result,
      overall: stageStatus.overall.result,
      summary: stageStatus.overall.summary
    };
    
    setAnalysisResult(fullResult);
    setIsAnalyzing(false);
  };

  // 處理照片拍攝
  const handleCapture = async (blob) => {
    try {
      setIsAnalyzing(true);
      setError(null);
      setShowCamera(false);

      const imageUrl = URL.createObjectURL(blob);
      setCapturedImage(imageUrl);

      // 轉換為 base64
      const reader = new FileReader();
      const base64Promise = new Promise((resolve, reject) => {
        reader.onloadend = () => {
          const base64data = reader.result.split(',')[1];
          resolve(base64data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const base64data = await base64Promise;

      // 重置階段狀態
      setStageStatus({
        faceShape: { status: 'pending', result: null },
        features: { status: 'pending', result: null },
        overall: { status: 'pending', result: null, summary: null }
      });

      // 發送到後端
      const response = await fetch(`${config.apiEndpoint}/faceAnalysis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64data,
          event_id: eventId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("分析請求回應:", data);
      
      if (data.session_id) {
        const newSessionId = data.session_id;
        setSessionId(newSessionId);
        
        // 設置 IoT 連接
        await setupIoTConnection(newSessionId);
      } else {
        throw new Error("回應中缺少 session_id");
      }
      
    } catch (error) {
      console.error("圖片處理或分析請求錯誤:", error);
      setError(error.message || "分析失敗");
      setIsAnalyzing(false);
    }
  };
  
  // 處理重拍
  const handleRetake = () => {
    // 清理舊資源
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
    }
    
    // 斷開 IoT 連接
    if (iotClientRef.current) {
      iotClientRef.current.disconnect();
      iotClientRef.current = null;
    }
    
    // 重置所有狀態
    setCapturedImage(null);
    setAnalysisResult(null);
    setError(null);
    setSessionId(null);
    setStageStatus({
      faceShape: { status: 'pending', result: null },
      features: { status: 'pending', result: null },
      overall: { status: 'pending', result: null, summary: null }
    });
    
    // 打開相機
    setShowCamera(true);
  };
  
  // 渲染分析進度
  const renderAnalysisProgress = () => {
    return (
      <ProgressContainer>
        {Object.entries(stageStatus).map(([stage, { status }]) => {
          const stageName = {
            faceShape: '臉型比例分析',
            features: '五官特徵分析',
            overall: '運勢發展評析'
          }[stage];
          
          const statusText = {
            pending: '等待中',
            processing: '分析中...',
            completed: '✓ 完成',
            failed: '× 失敗'
          }[status];
          
          return (
            <ProgressItem key={stage} status={status}>
              <div className="stage-name">{stageName}</div>
              <div className="stage-status">{statusText}</div>
            </ProgressItem>
          );
        })}
      </ProgressContainer>
    );
  };
  
  // 渲染階段結果
  const renderStageResults = () => {
    return (
      <div className="stage-results">
        {stageStatus.faceShape.status === 'completed' && stageStatus.faceShape.result && (
          <AnalysisBlock>
            <IconImage src="/face_1_white.png" />
            <BlockTitle>
              <img src="/chinese_tie.png" alt="裝飾" className="title-icon" />
              <span className="title-text">{stageStatus.faceShape.result.title}</span>
              <img src="/chinese_tie.png" alt="裝飾" className="title-icon" />
            </BlockTitle>
            {Object.entries(stageStatus.faceShape.result.content || {}).map(([key, value]) => (
              <ContentItem key={key}>
                <ItemTitle>{key}</ItemTitle>
                <ItemContent>{value}</ItemContent>
              </ContentItem>
            ))}
          </AnalysisBlock>
        )}
        
        {stageStatus.features.status === 'completed' && stageStatus.features.result && (
          <AnalysisBlock>
            <IconImage src="/face_2_white.png" />
            <BlockTitle>
              <img src="/chinese_tie.png" alt="裝飾" className="title-icon" />
              <span className="title-text">{stageStatus.features.result.title}</span>
              <img src="/chinese_tie.png" alt="裝飾" className="title-icon" />
            </BlockTitle>
            {Object.entries(stageStatus.features.result.content || {}).map(([key, value]) => (
              <ContentItem key={key}>
                <ItemTitle>{key}</ItemTitle>
                <ItemContent>{value}</ItemContent>
              </ContentItem>
            ))}
          </AnalysisBlock>
        )}
        
        {stageStatus.overall.status === 'completed' && stageStatus.overall.result && (
          <>
            <AnalysisBlock>
              <IconImage src="/face_3_white.png" />
              <BlockTitle>
                <img src="/chinese_tie.png" alt="裝飾" className="title-icon" />
                <span className="title-text">{stageStatus.overall.result.title}</span>
                <img src="/chinese_tie.png" alt="裝飾" className="title-icon" />
              </BlockTitle>
              {Object.entries(stageStatus.overall.result.content || {}).map(([key, value]) => (
                <ContentItem key={key}>
                  <ItemTitle>{key}</ItemTitle>
                  <ItemContent>{value}</ItemContent>
                </ContentItem>
              ))}
            </AnalysisBlock>
            
            {stageStatus.overall.summary && (
              <Summary>
                <BlockTitle>
                  <img src="/chinese_tie.png" alt="裝飾" className="title-icon" />
                  <span className="title-text">整體評析</span>
                  <img src="/chinese_tie.png" alt="裝飾" className="title-icon" />
                </BlockTitle>
                <p>{stageStatus.overall.summary}</p>
              </Summary>
            )}
          </>
        )}
      </div>
    );
  };

  // loading
  if (isLoading) {
    return (
      <Container>
        <Content>
          <MessageBox>
            <h2>載入中...</h2>
          </MessageBox>
        </Content>
      </Container>
    );
  }

  // Error (including event not opened)
  if (error && !isAnalyzing) {
    return (
      <Container>
        <Content>
          <MessageBox>
            <h2>{eventInfo?.name || "活動資訊"}</h2>
            <p>{error}</p>
          </MessageBox>
        </Content>
      </Container>
    );
  }

  return (
    <PageWrapper>
      <ChineseContainer isAnalyzing={isAnalyzing || analysisResult}>
        <BorderContainer />
        <Corner className="top-left" />
        <Corner className="top-right" />
        <Corner className="bottom-left" />
        <Corner className="bottom-right" />

        <ContentWrapper>
          {!isAnalyzing && !analysisResult && (
            <>
              <TitleContainer>
                <img src="/app_title.png" alt="面相大師" />
              </TitleContainer>

              <LogoContainer>
                <img src="/mobile_logo.png" alt="背景圖片" />
              </LogoContainer>

              <CameraButton
                onClick={() => setShowCamera(true)}
                disabled={isAnalyzing}
              >
                <CameraIcon size={24} color="white" />
                開始分析
              </CameraButton>
            </>
          )}

          {showCamera && (
            <Camera
              onCapture={handleCapture}
              onClose={() => setShowCamera(false)}
            />
          )}

          {isAnalyzing && (
            <div className="analysis-in-progress">
              <ImageContainer>
                <div className="image-wrapper">
                  <img src={capturedImage} alt="captured" />
                  {!stageStatus.overall.result && !error && (
                    <ImageOverlay>分析中...</ImageOverlay>
                  )}
                </div>
              </ImageContainer>
              
              {renderAnalysisProgress()}
              {renderStageResults()}
              
              {error && (
                <ErrorMessage>
                  <p>{error}</p>
                  <RetakeButton onClick={handleRetake}>重新拍照</RetakeButton>
                </ErrorMessage>
              )}
            </div>
          )}

          {analysisResult && !isAnalyzing && (
            <AnalysisResult
              result={analysisResult}
              imageUrl={capturedImage}
              onRetake={handleRetake}
            />
          )}
        </ContentWrapper>
      </ChineseContainer>
    </PageWrapper>
  );
};

export default MobileView;