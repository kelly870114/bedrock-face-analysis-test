import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from "../../i18n";
import {
  ProgressContainer,
  ProgressStage,
  FaceShapeContainer,
  RotatingCircle,
  FaceIcon,
  FeatureContainer,
  FeatureIcon,
  OverallContainer,
  OverallIcon,
  ProgressText
} from './styles-mobile';

const AnimatedProgressIndicator = ({ 
  faceShapeResult, 
  featuresResult, 
  overallResult,
  analysisStatus 
}) => {
  const { t } = useTranslation();
  
  // 🔥 修復1：將 featureImages 移到組件外面，避免無限重渲染
  const featureImages = useMemo(() => [
    '/feature-1.png',
    '/feature-2.png', 
    '/feature-3.png'
  ], []); // 空依賴陣列，只計算一次

  // 第二階段輪播狀態
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const [finalFeatureIndex, setFinalFeatureIndex] = useState(null);

  // 第二階段輪播邏輯
  useEffect(() => {
    let interval;
    
    // 檢查是否應該輪播：第一階段完成 且 第二階段未完成
    const shouldCarousel = faceShapeResult && !featuresResult;
    
    if (shouldCarousel) {
      interval = setInterval(() => {
        setCurrentFeatureIndex((prev) => (prev + 1) % featureImages.length);
      }, 800);
    } else if (featuresResult && finalFeatureIndex === null) {
      // 第二階段完成，停止輪播並隨機選擇
      const randomIndex = Math.floor(Math.random() * featureImages.length);
      setFinalFeatureIndex(randomIndex);
      setCurrentFeatureIndex(randomIndex);
    }

    // 清理函數
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [faceShapeResult, featuresResult, finalFeatureIndex, featureImages]);

  // 判斷各階段狀態
  const getStageStatus = (stage) => {
    switch (stage) {
      case 'faceShape':
        return {
          isPending: false,
          isProcessing: !faceShapeResult,
          isCompleted: !!faceShapeResult,
          text: faceShapeResult ? 
            t("faceAnalysis.faceShapeStages.completed") : 
            t("faceAnalysis.faceShapeStages.processing")
        };
      case 'features':
        return {
          isPending: !faceShapeResult,
          isProcessing: faceShapeResult && !featuresResult,
          isCompleted: !!featuresResult,
          text: featuresResult ? 
            t("faceAnalysis.featureAnalysisStages.completed") : 
            (faceShapeResult ? 
              t("faceAnalysis.featureAnalysisStages.processing") :
              t("faceAnalysis.featureAnalysisStages.pending"))
        };
      case 'overall':
        return {
          isPending: !featuresResult,
          isProcessing: featuresResult && !overallResult,
          isCompleted: !!overallResult,
          text: overallResult ? 
            t("faceAnalysis.overallAnalysisStages.completed") : 
            (featuresResult ? 
              t("faceAnalysis.overallAnalysisStages.processing") :
              t("faceAnalysis.overallAnalysisStages.pending"))
        };
      default:
        return {
          isPending: true,
          isProcessing: false,
          isCompleted: false,
          text: t("faceAnalysis.waiting")
        };
    }
  };

  const faceShapeStatus = getStageStatus('faceShape');
  const featuresStatus = getStageStatus('features');
  const overallStatus = getStageStatus('overall');

  // 🔥 修復2：簡化圖片選擇邏輯，移除 useMemo 避免無限重渲染
  const getCurrentFeatureImage = () => {
    // 直接回傳當前索引的圖片，不管是什麼狀態
    return featureImages[currentFeatureIndex];
  };

  return (
    <ProgressContainer>
      {/* 第一階段 - 臉型比例分析 */}
      <ProgressStage isActive={true}>
        <FaceShapeContainer>
          <RotatingCircle 
            isProcessing={faceShapeStatus.isProcessing} 
            isActive={true}
          />
          <FaceIcon 
            src="/face-4.png"
            alt="臉型分析"
            isActive={true}
            isProcessing={faceShapeStatus.isProcessing}
            isCompleted={faceShapeStatus.isCompleted}
          />
        </FaceShapeContainer>
        <ProgressText 
          completed={faceShapeStatus.isCompleted}
          isActive={faceShapeStatus.isProcessing}
        >
          {faceShapeStatus.text}
        </ProgressText>
      </ProgressStage>

      {/* 第二階段 - 五官特徵分析 */}
      <ProgressStage isActive={featuresStatus.isProcessing || featuresStatus.isCompleted}>
        <FeatureContainer
          isProcessing={featuresStatus.isProcessing}
          isCompleted={featuresStatus.isCompleted}
        >
          <FeatureIcon 
            src={getCurrentFeatureImage()} // 🔥 修復3：直接使用函數，不用 useMemo
            alt="五官分析"
            isPending={featuresStatus.isPending}
            isProcessing={featuresStatus.isProcessing}
            isCompleted={featuresStatus.isCompleted}
            // 🔥 修復核心：只有 Pending 才是灰色，Processing 和 Completed 都是彩色
            isActive={!featuresStatus.isPending} // 非 Pending 就是 Active (彩色)
            key={currentFeatureIndex} // 🔥 修復4：強制重新渲染
          />
        </FeatureContainer>
        <ProgressText 
          completed={featuresStatus.isCompleted}
          isActive={featuresStatus.isProcessing}
        >
          {featuresStatus.text}
        </ProgressText>
      </ProgressStage>

      {/* 第三階段 - 運勢分析 */}
      <ProgressStage isActive={overallStatus.isProcessing || overallStatus.isCompleted}>
        <OverallContainer>
          <OverallIcon 
            src="/overall.png"
            alt="運勢分析"
            isPending={overallStatus.isPending}
            isProcessing={overallStatus.isProcessing}
            isCompleted={overallStatus.isCompleted}
            // 🔥 修復核心：只有 Pending 才是灰色，Processing 和 Completed 都是彩色
            isActive={!overallStatus.isPending} // 非 Pending 就是 Active (彩色)
          />
        </OverallContainer>
        <ProgressText 
          completed={overallStatus.isCompleted}
          isActive={overallStatus.isProcessing}
        >
          {overallStatus.text}
        </ProgressText>
      </ProgressStage>
    </ProgressContainer>
  );
};

export default AnimatedProgressIndicator;