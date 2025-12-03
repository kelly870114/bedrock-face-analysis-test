import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Camera as CameraIcon } from "lucide-react";
import { config } from "../../config";
import { useTranslation, translateError } from "../../i18n";
import LanguageSwitcher from "../common/LanguageSwitcher";
import Camera from "../common/Camera/Camera";
import html2canvas from "html2canvas";
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
  ErrorMessage,
} from "./styles-mobile";

// 從 AnalysisResult 導入下載相關樣式和共用組件
import {
  RetakeButton,
  AnalysisBlock,
  IconImage,
  BlockTitle,
  ContentItem,
  ItemTitle,
  ItemContent,
  Summary,
  DownloadButton,
  ModalOverlay,
  ModalContent,
  ModalTitle,
  ModalCloseButton,
  QRCodeContainer,
  ModalText,
} from "./styles-result";

import { X } from "lucide-react";
import AnimatedProgressIndicator from "./AnimatedProgressIndicator";

// 導入IoT服務
import { connectIoT } from "../utils/iotService";

// QR Code Modal 組件
const QRCodeModal = ({ url, isOpen, onClose }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={() => onClose()}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalCloseButton onClick={onClose}>
          <X size={20} />
        </ModalCloseButton>
        <ModalTitle>{t("faceAnalysis.scanToDownload")}</ModalTitle>
        <QRCodeContainer>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            dangerouslySetInnerHTML={{
              __html: `
                <rect width="100" height="100" fill="white"/>
                <image href="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  url
                )}" width="100" height="100" />
              `,
            }}
          />
        </QRCodeContainer>
        <ModalText>{t("faceAnalysis.downloadExpiration")}</ModalText>
      </ModalContent>
    </ModalOverlay>
  );
};

const MobileView = ({ lang }) => {
  const [searchParams] = useSearchParams();
  const { t, language } = useTranslation(lang);
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
  const [sessionId, setSessionId] = useState(null);
  const [eventId, setEventId] = useState(null);
  const [analysisStatus, setAnalysisStatus] = useState("等待開始");
  const [supportedLanguages, setSupportedLanguages] = useState(null); // 活動支援的語言
  const [featureAllowed, setFeatureAllowed] = useState(true); // 功能是否被允許

  // 下載相關狀態
  const [showQRCode, setShowQRCode] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const resultRef = useRef(null);

  // 階段狀態 - 更精確的狀態追蹤
  const [stageStatus, setStageStatus] = useState({
    faceShape: { status: "pending", result: null },
    features: { status: "pending", result: null },
    overall: { status: "pending", result: null, summary: null },
  });

  // IoT 連接引用
  const iotClientRef = useRef(null);

  // 檢查活動存在性和訪問權限
  useEffect(() => {
    const checkEventAccess = async () => {
      try {
        const eventIdFromParams = searchParams.get("event");

        if (!eventIdFromParams) {
          setError(t("desktop.invalidEventCode"));
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
          setError(data.message || t("desktop.eventNotAvailable"));
          setEventInfo({
            name: data.eventName,
            message: data.message,
          });
          // 即使活動未開放，也要設定支援的語言
          if (data.supported_languages) {
            setSupportedLanguages(data.supported_languages);
          }
          setIsLoading(false);
          return;
        }

        setEventInfo({
          name: data.eventName,
          message: data.message,
        });
        
        // 儲存活動支援的語言
        if (data.supported_languages) {
          setSupportedLanguages(data.supported_languages);
        }
        
        // 檢查此功能是否被允許（面相功能需要 tw_face）
        const faceTypes = ['tw_face'];
        const cultureTypes = data.culture_types || [];
        const hasFaceFeature = cultureTypes.some(type => faceTypes.includes(type));
        
        if (!hasFaceFeature) {
          setFeatureAllowed(false);
          setError(t("faceAnalysis.featureNotAllowed", { defaultValue: "此活動未開放面相功能" }));
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError(t("desktop.systemError"));
        setIsLoading(false);
      }
    };

    checkEventAccess();
  }, [searchParams, t]);

  // 處理重置參數
  useEffect(() => {
    const resetParam = searchParams.get("reset");
    if (resetParam) {
      // 重置所有狀態到初始狀態
      setIsAnalyzing(false);
      setAnalysisResult(null);
      setCapturedImage(null);
      setFaceShapeResult(null);
      setFeaturesResult(null);
      setOverallResult(null);
      setSummary("");
      setError(null);
      setSessionId(null);
      setAnalysisStatus("等待開始");
      setStageStatus({
        faceShape: { status: "pending", result: null },
        features: { status: "pending", result: null },
        overall: { status: "pending", result: null, summary: null },
      });

      // 清理 IoT 連接
      if (iotClientRef.current) {
        iotClientRef.current.disconnect();
        iotClientRef.current = null;
      }

      // 移除 URL 中的 reset 參數
      const url = new URL(window.location.href);
      url.searchParams.delete("reset");
      window.history.replaceState({}, "", url);
      
      // 🔥 強制重新設定載入狀態為 false，確保回到首頁
      setIsLoading(false);
    }
  }, [searchParams]);

  // 組件卸載時清理 IoT 連接
  useEffect(() => {
    return () => {
      if (iotClientRef.current) {
        iotClientRef.current.disconnect();
      }
    };
  }, []);

  // 狀態文字生成
  const getSmartAnalysisStatus = () => {
    const { faceShape, features, overall } = stageStatus;

    // 如果還沒開始或初始化階段
    if (faceShape.status === "pending" && features.status === "pending") {
      return t("faceAnalysis.analyzing");
    }

    // 如果兩個階段都在處理中（並行）
    if (faceShape.status === "processing" && features.status === "processing") {
      return t("faceAnalysis.analyzingBothStages");
    }

    // 如果只有一個階段在處理
    if (faceShape.status === "processing") {
      return t("faceAnalysis.analyzingFaceShape");
    }
    if (features.status === "processing") {
      return t("faceAnalysis.analyzingFeatures");
    }

    // 如果兩個階段都完成，第三階段在處理
    if (faceShape.status === "completed" && features.status === "completed") {
      if (overall.status === "processing") {
        return t("faceAnalysis.analyzingOverall");
      } else if (overall.status === "completed") {
        return t("faceAnalysis.analysisCompleted");
      } else {
        return t("faceAnalysis.preparingOverall");
      }
    }

    // 如果其中一個階段完成
    const completedStages = [];
    if (faceShape.status === "completed")
      completedStages.push(t("faceAnalysis.faceShape"));
    if (features.status === "completed")
      completedStages.push(t("faceAnalysis.features"));

    if (completedStages.length > 0) {
      // 使用模板字符串替換，需要手動處理
      const stagesText = completedStages.join(t("common.and"));
      return `${stagesText}${t("faceAnalysis.stageCompleted")}`;
    }

    return analysisStatus;
  };

  // 設置 IoT 連接和訂閱
  const setupIoTConnection = async (newSessionId) => {
    try {
      console.log(`正在設置IoT連接，session_id: ${newSessionId}`);

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
        onConnectionError: handleConnectionError,
      });

      iotClientRef.current = iotClient;
      console.log(`成功連接到 IoT 並訂閱 ${newSessionId} 相關主題`);
    } catch (error) {
      console.error("IoT 連接設置失敗:", error);
      setError(t("faceAnalysis.connectionFailed"));
      setIsAnalyzing(false);
    }
  };

  // 處理連接錯誤
  const handleConnectionError = (err) => {
    console.error("IoT 連接錯誤:", err);
    setError(t("faceAnalysis.connectionLost"));
    setIsAnalyzing(false);
  };

  // 處理狀態更新 - 更精確的狀態追蹤
  const handleStatusUpdate = (data) => {
    console.log("狀態更新:", data);
    const { stage, status } = data;

    if (stage && status) {
      setStageStatus((prev) => ({
        ...prev,
        [stage]: { ...prev[stage], status },
      }));

      // 根據狀態更新顯示文字
      if (status === "processing") {
        if (stage === "faceShape") {
          setAnalysisStatus(t("faceAnalysis.faceShapeStages.processing"));
        } else if (stage === "features") {
          setAnalysisStatus(t("faceAnalysis.featureAnalysisStages.processing"));
        } else if (stage === "overall") {
          setAnalysisStatus(t("faceAnalysis.overallAnalysisStages.processing"));
        }
      }
    }
  };

  // 處理階段結果 - 改進結果更新邏輯
  const handleStageResult = (stage, data) => {
    console.log(`接收到 ${stage} 階段結果:`, data);

    if (stage === "faceShape" && data.result) {
      setFaceShapeResult(data.result);
      setStageStatus((prev) => ({
        ...prev,
        faceShape: {
          ...prev.faceShape,
          status: "completed",
          result: data.result,
        },
      }));
      setAnalysisStatus(t("faceAnalysis.faceShapeStages.completed"));
    } else if (stage === "features" && data.result) {
      setFeaturesResult(data.result);
      setStageStatus((prev) => ({
        ...prev,
        features: {
          ...prev.features,
          status: "completed",
          result: data.result,
        },
      }));
      setAnalysisStatus(t("faceAnalysis.featureAnalysisStages.completed"));
    } else if (stage === "overall" && data.result) {
      setOverallResult(data.result);
      setSummary(data.summary || "");
      setStageStatus((prev) => ({
        ...prev,
        overall: {
          ...prev.overall,
          status: "completed",
          result: data.result,
          summary: data.summary,
        },
      }));
      setAnalysisStatus(t("faceAnalysis.overallAnalysisStages.completed"));
    }

    checkIfAnalysisComplete();
  };

  // 檢查分析是否完成
  const checkIfAnalysisComplete = () => {
    // 使用最新的狀態檢查
    if (faceShapeResult && featuresResult && overallResult) {
      const completeResult = {
        faceShape: faceShapeResult,
        features: featuresResult,
        overall: overallResult,
        summary: summary,
      };
      setAnalysisResult(completeResult);
      setIsAnalyzing(false);
      setAnalysisStatus(t("faceAnalysis.analysisCompleted"));
    }
  };

  // 處理錯誤
  const handleIoTError = (data) => {
    console.error("分析錯誤:", data);
    const { stage, error: errorMsg } = data;

    if (stage) {
      setStageStatus((prev) => ({
        ...prev,
        [stage]: { ...prev[stage], status: "failed", error: errorMsg },
      }));
    }

    setError(
      translateError(errorMsg, language) || t("faceAnalysis.analysisError")
    );
    setIsAnalyzing(false);
  };

  // 處理分析完成
  const handleAnalysisComplete = (data) => {
    console.log("分析完成:", data);
    checkIfAnalysisComplete();
  };

  // 處理照片拍攝
  const handleCapture = async (blob) => {
    try {
      setIsAnalyzing(true);
      setError(null);
      setShowCamera(false);
      setAnalysisStatus(t("faceAnalysis.preparing"));

      // 重置所有結果
      setFaceShapeResult(null);
      setFeaturesResult(null);
      setOverallResult(null);
      setSummary("");
      setAnalysisResult(null);

      const imageUrl = URL.createObjectURL(blob);
      setCapturedImage(imageUrl);

      // 轉換為 base64
      const reader = new FileReader();
      const base64Promise = new Promise((resolve, reject) => {
        reader.onloadend = () => {
          const base64data = reader.result.split(",")[1];
          resolve(base64data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const base64data = await base64Promise;

      // 【修改】重置階段狀態 - 準備並行處理
      setStageStatus({
        faceShape: { status: "pending", result: null },
        features: { status: "pending", result: null },
        overall: { status: "pending", result: null, summary: null },
      });

      // 發送到後端（保持原有的 API endpoint）
      console.log("發送分析請求...");
      const response = await fetch(`${config.apiEndpoint}/faceAnalysis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64data,
          event_id: eventId,
          lang: language,
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
        setAnalysisStatus(t("faceAnalysis.analyzing"));

        // 設置 IoT 連接
        await setupIoTConnection(newSessionId);
      } else {
        throw new Error(t("faceAnalysis.missingSessionId"));
      }
    } catch (error) {
      console.error("圖片處理或分析請求錯誤:", error);
      setError(
        translateError(error.message, language) ||
          t("faceAnalysis.analysisFailed")
      );
      setIsAnalyzing(false);
    }
  };

  // 處理重拍 - 回到首頁
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
    setFaceShapeResult(null);
    setFeaturesResult(null);
    setOverallResult(null);
    setSummary("");
    setError(null);
    setSessionId(null);
    setAnalysisStatus(t("faceAnalysis.waitingToStart"));
    setStageStatus({
      faceShape: { status: "pending", result: null },
      features: { status: "pending", result: null },
      overall: { status: "pending", result: null, summary: null },
    });

    // 回到首頁，不要打開相機
    setIsAnalyzing(false);
  };

  // 下載分析結果的處理函數
  const handleDownload = async () => {
    try {
      setIsUploading(true);

      const element = resultRef.current;
      const originalWidth = element.offsetWidth;
      const originalHeight = element.offsetHeight;

      const container = document.createElement("div");
      container.style.width = `${originalWidth}px`;
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "-9999px";

      const clone = element.cloneNode(true);
      container.appendChild(clone);
      document.body.appendChild(container);

      const canvas = await html2canvas(clone, {
        backgroundColor: "#FDF6E9",
        scale: 2,
        useCORS: true,
        logging: false,
        width: originalWidth,
        height: originalHeight,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.body.querySelector(
            '[class*="ResultContainer"]'
          );
          if (clonedElement) {
            clonedElement.style.width = `${originalWidth}px`;
            clonedElement.style.height = `${originalHeight}px`;
          }
        },
      });

      document.body.removeChild(container);

      const timestamp = new Date().getTime();
      const random = Math.floor(Math.random() * 1000);
      const filename = `analysis-${timestamp}-${random}.png`;

      const urlResponse = await fetch(`${config.apiEndpoint}/uploadImage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: filename,
        }),
      });

      if (!urlResponse.ok) {
        throw new Error(t("faceAnalysis.cannotGetUploadUrl"));
      }

      const { uploadUrl } = await urlResponse.json();

      const base64Data = canvas.toDataURL("image/png").split(",")[1];
      const binaryData = atob(base64Data);
      const arrayBuffer = new ArrayBuffer(binaryData.length);
      const uint8Array = new Uint8Array(arrayBuffer);

      for (let i = 0; i < binaryData.length; i++) {
        uint8Array[i] = binaryData.charCodeAt(i);
      }

      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: uint8Array,
        headers: {
          "Content-Type": "image/png",
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(t("faceAnalysis.imageUploadFailed"));
      }

      const downloadUrl = `${config.apiEndpoint}/uploadImage?filename=${filename}`;
      setDownloadUrl(downloadUrl);
      setShowQRCode(true);
    } catch (error) {
      console.error("處理失敗:", error);
      alert(t("faceAnalysis.processingFailed"));
    } finally {
      setIsUploading(false);
    }
  };

  // 渲染階段結果
  const renderStageResults = () => {
    return (
      <div className="stage-results" ref={resultRef}>
        {stageStatus.faceShape.status === "completed" &&
          stageStatus.faceShape.result && (
            <AnalysisBlock>
              <IconImage src="/face_1_white.png" />
              <BlockTitle>
                <img
                  src="/chinese_tie.png"
                  alt={t("common.decoration")}
                  className="title-icon"
                />
                <span className="title-text">
                  {stageStatus.faceShape.result.title}
                </span>
                <img
                  src="/chinese_tie.png"
                  alt={t("common.decoration")}
                  className="title-icon"
                />
              </BlockTitle>
              {Object.entries(stageStatus.faceShape.result.content || {}).map(
                ([key, value]) => (
                  <ContentItem key={key}>
                    <ItemTitle>{key}</ItemTitle>
                    <ItemContent>{value}</ItemContent>
                  </ContentItem>
                )
              )}
            </AnalysisBlock>
          )}

        {stageStatus.features.status === "completed" &&
          stageStatus.features.result && (
            <AnalysisBlock>
              <IconImage src="/face_2_white.png" />
              <BlockTitle>
                <img
                  src="/chinese_tie.png"
                  alt={t("common.decoration")}
                  className="title-icon"
                />
                <span className="title-text">
                  {stageStatus.features.result.title}
                </span>
                <img
                  src="/chinese_tie.png"
                  alt={t("common.decoration")}
                  className="title-icon"
                />
              </BlockTitle>
              {Object.entries(stageStatus.features.result.content || {}).map(
                ([key, value]) => (
                  <ContentItem key={key}>
                    <ItemTitle>{key}</ItemTitle>
                    <ItemContent>{value}</ItemContent>
                  </ContentItem>
                )
              )}
            </AnalysisBlock>
          )}

        {stageStatus.overall.status === "completed" &&
          stageStatus.overall.result && (
            <>
              <AnalysisBlock>
                <IconImage src="/face_3_white.png" />
                <BlockTitle>
                  <img
                    src="/chinese_tie.png"
                    alt={t("common.decoration")}
                    className="title-icon"
                  />
                  <span className="title-text">
                    {stageStatus.overall.result.title}
                  </span>
                  <img
                    src="/chinese_tie.png"
                    alt={t("common.decoration")}
                    className="title-icon"
                  />
                </BlockTitle>
                {Object.entries(stageStatus.overall.result.content || {}).map(
                  ([key, value]) => (
                    <ContentItem key={key}>
                      <ItemTitle>{key}</ItemTitle>
                      <ItemContent>{value}</ItemContent>
                    </ContentItem>
                  )
                )}
              </AnalysisBlock>

              {stageStatus.overall.summary && (
                <Summary>
                  <BlockTitle>
                    <img
                      src="/chinese_tie.png"
                      alt={t("common.decoration")}
                      className="title-icon"
                    />
                    <span className="title-text">
                      {t("faceAnalysis.overallAnalysis")}
                    </span>
                    <img
                      src="/chinese_tie.png"
                      alt={t("common.decoration")}
                      className="title-icon"
                    />
                  </BlockTitle>
                  <p>{stageStatus.overall.summary}</p>
                </Summary>
              )}
            </>
          )}
      </div>
    );
  };

  // Loading
  if (isLoading) {
    return (
      <Container>
        <Content>
          <MessageBox>
            <h2>{t("common.loading")}</h2>
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
            <h2>{eventInfo?.name || t("faceAnalysis.title")}</h2>
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
          {/* 語言切換器 - 根據活動配置動態顯示語言 */}
          <LanguageSwitcher
            supportedLanguages={supportedLanguages}
            queryParams={{ event: eventId }}
          />

          {!isAnalyzing && !analysisResult && (
            <>
              <TitleContainer>
                {/* <img src="/app_title_face.png" alt={t("faceAnalysis.title")} /> */}
                <img
                  src={`/app_title_face_${lang}.png`}
                  alt={t("faceAnalyzer.title")}
                  onError={(e) => {
                    e.target.src = "/app_title_face.png"; // 回退到預設圖片
                  }}
                />
              </TitleContainer>

              <LogoContainer>
                <img src="/mobile_logo.png" alt={t("faceAnalysis.title")} />
              </LogoContainer>

              <CameraButton
                onClick={() => setShowCamera(true)}
                disabled={isAnalyzing}
              >
                <CameraIcon size={24} color="white" />
                {t("faceAnalysis.startAnalysis")}
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
                  <img
                    src={capturedImage}
                    alt={t("faceAnalysis.capturedImage")}
                  />
                  {!stageStatus.overall.result && !error && (
                    <ImageOverlay>{getSmartAnalysisStatus()}</ImageOverlay>
                  )}
                </div>
              </ImageContainer>

              {/* 使用動畫進度組件 */}
              <AnimatedProgressIndicator
                faceShapeResult={faceShapeResult}
                featuresResult={featuresResult}
                overallResult={overallResult}
                analysisStatus={getSmartAnalysisStatus()}
              />

              {renderStageResults()}

              {error && (
                <ErrorMessage>
                  <p>{error}</p>
                  <RetakeButton onClick={handleRetake}>
                    {t("faceAnalysis.retakePhoto")}
                  </RetakeButton>
                </ErrorMessage>
              )}

              {/* 當分析完成顯示下載和重拍按鈕 */}
              {stageStatus.overall.status === "completed" &&
                stageStatus.overall.result && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      marginTop: "20px",
                    }}
                  >
                    <DownloadButton
                      onClick={handleDownload}
                      disabled={isUploading}
                    >
                      {isUploading
                        ? t("common.processing")
                        : t("faceAnalysis.downloadResult")}
                    </DownloadButton>
                    <RetakeButton onClick={handleRetake}>
                      {t("faceAnalysis.retakePhoto")}
                    </RetakeButton>
                  </div>
                )}
            </div>
          )}

          <QRCodeModal
            url={downloadUrl}
            isOpen={showQRCode}
            onClose={() => setShowQRCode(false)}
          />
        </ContentWrapper>
      </ChineseContainer>
    </PageWrapper>
  );
};

export default MobileView;