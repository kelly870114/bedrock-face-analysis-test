import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Camera as CameraIcon } from "lucide-react";
import { config } from "../../config";
import pubSubService from "../utils/pubSubService";
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
} from "./styles-mobile";
import Camera from "../common/Camera/Camera";
import AnalysisResult from "./AnalysisResult";

const MobileView = () => {
  const [searchParams] = useSearchParams();
  const [showCamera, setShowCamera] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [faceShapeResult, setFaceShapeResult] = useState(null);
  const [featuresResult, setFeaturesResult] = useState(null);
  const [overallResult, setOverallResult] = useState(null);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [eventInfo, setEventInfo] = useState(null);
  const [analysisId, setAnalysisId] = useState(null);
  const [analysisStatus, setAnalysisStatus] = useState("等待開始");

  // 檢查活動代碼
  useEffect(() => {
    const checkEventAccess = async () => {
      try {
        const eventId = searchParams.get("event");

        if (!eventId) {
          setError("無效的活動代碼");
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          `${config.apiEndpoint}/checkEvent?event=${eventId}`,
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

  // 清理 PubSub 連接
  useEffect(() => {
    return () => {
      pubSubService.disconnect();
    };
  }, []);

  // 更新分析結果
  const updateAnalysisResult = () => {
    if (faceShapeResult && featuresResult && overallResult) {
      const completeResult = {
        faceShape: faceShapeResult,
        features: featuresResult,
        overall: overallResult,
        summary: summary,
      };
      setAnalysisResult(completeResult);
      setIsAnalyzing(false);
    }
  };

  const handleCapture = async (blob) => {
    try {
      setIsAnalyzing(true);
      setError(null);
      setShowCamera(false);
      setAnalysisStatus("準備中...");

      // 重置所有結果
      setFaceShapeResult(null);
      setFeaturesResult(null);
      setOverallResult(null);
      setSummary("");
      setAnalysisResult(null);

      const imageUrl = URL.createObjectURL(blob);
      setCapturedImage(imageUrl);

      // 先訂閱 IoT 主題，確保不會漏掉任何消息
      const callbacks = {
        onFaceShapeUpdate: (data) => {
          console.log("收到臉型分析結果:", data);
          setFaceShapeResult(data.result);
          setAnalysisStatus("臉型分析完成！正在分析五官...");
          updateAnalysisResult();
        },
        onFeaturesUpdate: (data) => {
          console.log("收到五官分析結果:", data);
          setFeaturesResult(data.result);
          setAnalysisStatus("五官分析完成！正在進行綜合分析...");
          updateAnalysisResult();
        },
        onOverallUpdate: (data) => {
          console.log("收到綜合分析結果:", data);
          setOverallResult(data.result);
          setSummary(data.summary);
          setAnalysisStatus("分析完成！");
          updateAnalysisResult();
        },
        onStatusUpdate: (data) => {
          console.log("狀態更新:", data);
          // 可以根據狀態更新來更新UI
        },
        onError: (err) => {
          console.error("分析錯誤:", err);
          setError(err || "分析失敗");
          setIsAnalyzing(false);
        },
        onCompleted: (data) => {
          console.log("分析流程完成:", data);
          // 可以在這裡處理完成後的邏輯
        }
      };

      // 轉換為 base64
      const reader = new FileReader();
      const base64Promise = new Promise((resolve, reject) => {
        reader.onloadend = () => {
          // 取得 base64 字串部分（去掉 data:image/jpeg;base64, 前綴）
          const base64data = reader.result.split(",")[1];
          resolve(base64data);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(blob);

      const base64data = await base64Promise;

      // 發送到後端
      const response = await fetch(`${config.apiEndpoint}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64data,
          event_id: searchParams.get("event") || "default",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data:", data);

      setAnalysisId(data.session_id);
      setAnalysisStatus("臉型分析中...");
      
      // 訂閱 PubSub 主題
      const connected = pubSubService.connect(data.session_id, callbacks);

      if (!connected) {
        throw new Error("無法連接到 IoT 服務");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "分析失敗");
      setIsAnalyzing(false);
    }
  };

  // 重新拍照
  const handleRetake = () => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
    }
    
    // 斷開現有的PubSub連接
    pubSubService.disconnect();
    
    setCapturedImage(null);
    setAnalysisResult(null);
    setFaceShapeResult(null);
    setFeaturesResult(null);
    setOverallResult(null);
    setSummary("");
    setError(null);
    setAnalysisId(null);
    setAnalysisStatus("等待開始");
    setShowCamera(true);
  };

  // 載入中
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

  // 錯誤（包括活動未開放）
  if (error) {
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
            <ImageContainer>
              <div className="image-wrapper">
                <img src={capturedImage} alt="captured" />
                <ImageOverlay>
                  {analysisStatus}
                </ImageOverlay>
              </div>
            </ImageContainer>
          )}

          {analysisResult && (
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