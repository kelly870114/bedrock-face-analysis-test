import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Camera as CameraIcon } from "lucide-react";
import { config } from "../../config";
import {
  Container,
  Content,
  MessageBox,
  CameraButtonContainer,
  CameraButton,
  ImageContainer,
  BackgroundImage,
  ImageOverlay
} from "./styles";
import Camera from "./Camera";
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

  // check if event id exists
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
            message: data.message
          });
          setIsLoading(false);
          return;
        }

        setEventInfo({
          name: data.eventName,
          message: data.message
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

  // handle capture face
  const handleCapture = async (blob) => {
    try {
      setIsAnalyzing(true);
      setError(null);
      setShowCamera(false);

      const imageUrl = URL.createObjectURL(blob);
      setCapturedImage(imageUrl);
      setAnalysisResult({ analysis: "分析中..." });

      const base64Image = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.readAsDataURL(blob);
      });

      console.log("Sending request to:", `${config.apiEndpoint}/analyze`);

      const response = await fetch(`${config.apiEndpoint}/analyze`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64Image,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data:", data);

      const analysisResult =
        typeof data.body === "string" ? JSON.parse(data.body) : data;
      console.log("Analysis result:", analysisResult);

      setAnalysisResult(analysisResult);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "分析失敗");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // handle retake photo
  const handleRetake = () => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
    }
    setCapturedImage(null);
    setAnalysisResult(null);
    setError(null);
    setShowCamera(true);
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
    <Container>
      {!isAnalyzing && !analysisResult && <BackgroundImage />}
      <Content>
        {isAnalyzing ? (
          <ImageContainer>
            <img src={capturedImage} alt="captured" />
            <ImageOverlay>分析中...</ImageOverlay>
          </ImageContainer>
        ) : error ? (
          <MessageBox>
            <h2>發生錯誤</h2>
            <p>{error}</p>
          </MessageBox>
        ) : analysisResult ? (
          <AnalysisResult
            result={analysisResult}
            imageUrl={capturedImage}
            onRetake={handleRetake}
          />
        ) : null}
      </Content>

      {!analysisResult && !isAnalyzing && (
        <CameraButtonContainer>
          <CameraButton
            onClick={() => setShowCamera(true)}
            disabled={isAnalyzing}
          >
            <CameraIcon size={24} color="white" />
            開始分析
          </CameraButton>
        </CameraButtonContainer>
      )}

      {showCamera && (
        <Camera
          onCapture={handleCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </Container>
  );
};

export default MobileView;