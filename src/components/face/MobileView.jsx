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
  ProgressContainer,
  ProgressItem,
  RetakeButton,
  ErrorMessage,
  AnalysisBlock,
  IconImage,
  BlockTitle,
  ContentItem,
  ItemTitle,
  ItemContent,
  Summary,
} from "./styles-mobile";

// 從 AnalysisResult 導入下載相關樣式
import {
  DownloadButton,
  ModalOverlay,
  ModalContent,
  ModalTitle,
  ModalCloseButton,
  QRCodeContainer,
  ModalText,
} from "./styles-result";

import { X } from "lucide-react";

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

const MobileView = () => {
  const [searchParams] = useSearchParams();
  const { t, language } = useTranslation();
  const [showCamera, setShowCamera] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [eventInfo, setEventInfo] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [eventId, setEventId] = useState(null);

  // 從 AnalysisResult 組件添加的狀態
  const [showQRCode, setShowQRCode] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const resultRef = useRef(null);

  // 階段狀態
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
        setError(t("desktop.systemError"));
        setIsLoading(false);
      }
    };

    checkEventAccess();
  }, [searchParams, t]);

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

  // 處理狀態更新
  const handleStatusUpdate = (data) => {
    console.log("狀態更新:", data);
    const { stage, status } = data;
    if (stage && status) {
      setStageStatus((prev) => ({
        ...prev,
        [stage]: { ...prev[stage], status },
      }));
    }
  };

  // 處理階段結果
  const handleStageResult = (stage, data) => {
    console.log(`接收到 ${stage} 階段結果:`, data);
    if (data.result) {
      setStageStatus((prev) => ({
        ...prev,
        [stage]: {
          ...prev[stage],
          status: "completed",
          result: data.result,
          summary: data.summary || prev[stage].summary,
        },
      }));
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
  };

  // 處理分析完成
  const handleAnalysisComplete = (data) => {
    console.log("分析完成:", data);

    // 組合完整結果
    const fullResult = {
      faceShape: stageStatus.faceShape.result,
      features: stageStatus.features.result,
      overall: stageStatus.overall.result,
      summary: stageStatus.overall.summary,
    };

    setAnalysisResult(fullResult);

    // 重要修改：不再設置 setIsAnalyzing(false)，保持現有視圖
    // setIsAnalyzing(false);
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
          const base64data = reader.result.split(",")[1];
          resolve(base64data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const base64data = await base64Promise;

      // 重置階段狀態
      setStageStatus({
        faceShape: { status: "pending", result: null },
        features: { status: "pending", result: null },
        overall: { status: "pending", result: null, summary: null },
      });

      // 發送到後端
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
      faceShape: { status: "pending", result: null },
      features: { status: "pending", result: null },
      overall: { status: "pending", result: null, summary: null },
    });

    // 打開相機
    setShowCamera(true);
  };

  // 下載分析結果的處理函數 - 從 AnalysisResult 組件移植
  const handleDownload = async () => {
    try {
      setIsUploading(true);

      // 取得目標元素
      const element = resultRef.current;

      // 獲取元素的實際尺寸
      const originalWidth = element.offsetWidth;
      const originalHeight = element.offsetHeight;

      // 創建一個新的容器來保持原始佈局
      const container = document.createElement("div");
      container.style.width = `${originalWidth}px`;
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "-9999px";

      // 克隆目標元素到新容器
      const clone = element.cloneNode(true);
      container.appendChild(clone);
      document.body.appendChild(container);

      // 設置 html2canvas 選項
      const canvas = await html2canvas(clone, {
        backgroundColor: "#FDF6E9",
        scale: 2, // 提高輸出質量
        useCORS: true,
        logging: false,
        width: originalWidth,
        height: originalHeight,
        onclone: (clonedDoc) => {
          // 確保克隆的元素有正確的樣式
          const clonedElement = clonedDoc.body.querySelector(
            '[class*="ResultContainer"]'
          );
          if (clonedElement) {
            clonedElement.style.width = `${originalWidth}px`;
            clonedElement.style.height = `${originalHeight}px`;
          }
        },
      });

      // 清理臨時元素
      document.body.removeChild(container);

      // 生成檔名
      const timestamp = new Date().getTime();
      const random = Math.floor(Math.random() * 1000);
      const filename = `analysis-${timestamp}-${random}.png`;

      // 獲取上傳 URL
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

      // 轉換 canvas 為二進制數據
      const base64Data = canvas.toDataURL("image/png").split(",")[1];
      const binaryData = atob(base64Data);
      const arrayBuffer = new ArrayBuffer(binaryData.length);
      const uint8Array = new Uint8Array(arrayBuffer);

      for (let i = 0; i < binaryData.length; i++) {
        uint8Array[i] = binaryData.charCodeAt(i);
      }

      // 上傳圖片
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

      // 設置下載 URL 並顯示 QR code
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

  // 渲染分析進度
  const renderAnalysisProgress = () => {
    return (
      <ProgressContainer>
        {Object.entries(stageStatus).map(([stage, { status }]) => {
          const stageNameMap = {
            faceShape: t("faceAnalysis.stages.faceShape"),
            features: t("faceAnalysis.stages.features"),
            overall: t("faceAnalysis.stages.overall"),
          };
          const stageName = stageNameMap[stage];

          const statusTextMap = {
            pending: t("faceAnalysis.status.pending"),
            processing: t("faceAnalysis.status.processing"),
            completed: t("faceAnalysis.status.completed"),
            failed: t("faceAnalysis.status.failed"),
          };
          const statusText = statusTextMap[status];

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

  // loading
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
          {/* 語言切換器 - 確保傳遞 eventId 參數 */}
          <LanguageSwitcher
            currentPath="/face/mobile"
            queryParams={{ event: eventId }}
          />
          {!isAnalyzing && !analysisResult && (
            <>
              <TitleContainer>
                <img src="/app_title.png" alt={t("faceAnalysis.title")} />
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
                    <ImageOverlay>{t("faceAnalysis.analyzing")}</ImageOverlay>
                  )}
                </div>
              </ImageContainer>

              {renderAnalysisProgress()}
              {renderStageResults()}

              {error && (
                <ErrorMessage>
                  <p>{error}</p>
                  <RetakeButton onClick={handleRetake}>
                    {t("faceAnalysis.retakePhoto")}
                  </RetakeButton>
                </ErrorMessage>
              )}

              {/* 新增: 當分析完成 (overall階段結果存在) 顯示下載和重拍按鈕 */}
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

          {/* 保留 QR Code Modal */}
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
