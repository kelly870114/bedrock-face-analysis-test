import React, { useState } from "react";
import { Camera as CameraIcon } from "lucide-react";
import { config } from "../../config"; // 引入設定
import {
  Container,
  Header,
  Content,
  MessageBox,
  CameraButtonContainer,
  CameraButton,
  ImageContainer,
  CatDiagram
} from "./styles";
import Camera from "./Camera";
import AnalysisResult from "./AnalysisResult";

const MobileView = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const handleCapture = async (blob) => {
    try {
      setIsAnalyzing(true);
      setError(null);
      // 先關閉相機
      setShowCamera(false);

      // 儲存照片的 URL
      const imageUrl = URL.createObjectURL(blob);
      setCapturedImage(imageUrl);

      setAnalysisResult({ analysis: "分析中..." });

      const base64Image = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.readAsDataURL(blob);
      });

      const response = await fetch(`${config.apiEndpoint}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64Image,
        }),
      });

      const data = await response.json();
      const analysisResult = JSON.parse(data.body);

      if (!response.ok) {
        throw new Error(data.error || "分析失敗");
      }

      setAnalysisResult(analysisResult);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRetake = () => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
    }
    setCapturedImage(null);
    setAnalysisResult(null);
    setError(null);
    setShowCamera(true);
  };

  return (
    <Container>
      <Header>
        <h1>AI 面相分析</h1>
      </Header>

      <Content>
        {isAnalyzing ? (
          <>
            <ImageContainer>
              <img src={capturedImage} alt="captured" />
            </ImageContainer>
            <MessageBox>
              <h2>分析中</h2>
              <p>正在進行面相分析，請稍候...</p>
            </MessageBox>
          </>
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
        ) : (
          <>
            <ImageContainer>
              <img src="/brain-icon.png" alt="AI Brain" />
            </ImageContainer>
            <h2>
              Amazon Bedrock
              <br />
              AI 面相大師
            </h2>
            <CatDiagram>
              <img src="/cat-diagram.png" alt="Face Analysis Diagram" />
            </CatDiagram>
            <CameraButton onClick={() => setShowCamera(true)}>
              <CameraIcon size={24} />
              開始分析
            </CameraButton>
          </>
        )}
      </Content>

      {!analysisResult && !isAnalyzing && (
        <CameraButtonContainer>
          <CameraButton
            onClick={() => setShowCamera(true)}
            disabled={isAnalyzing}
          >
            <CameraIcon size={32} color="white" />
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
