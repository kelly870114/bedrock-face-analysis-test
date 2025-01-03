import React from "react";
import styled from "styled-components";

const MAIN_COLOR = "#C84B31";

export const Container = styled.div`
  padding: 5%;
  margin: 2% auto;
  width: 90%;
  max-width: 400px;
`;

const ImageContainer = styled.div`
  width: 100%;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;

  img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }
`;

export const RetakeButton = styled.button`
  background-color: ${MAIN_COLOR};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  margin-top: 20px;
  cursor: pointer;
  width: 100%;
  font-family: "Noto Serif TC", serif;
  font-size: 16px;

  &:hover {
    background-color: #b85c38;
  }
`;

export const AnalysisBlock = styled.div`
  background: #fff0d9;
  padding: 2rem 1rem 1rem;
  margin-bottom: 2.5rem;
  margin-top: 2rem;
  width: 100%;
  box-sizing: border-box;
  border: 2px solid ${MAIN_COLOR};
  border-radius: 12px;
  position: relative;
`;

export const BlockTitle = styled.div`
  position: center;
  margin: 0 auto 20px;
  background: #fff7e6;
  padding: 5px 20px;
  border: 2px solid ${MAIN_COLOR};
  border-radius: 20px;
  color: #000000;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  font-family: "Noto Serif TC", serif;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: fit-content;
  min-width: 200px;
  max-width: 80%;

  .title-icon {
    width: 18px;
    height: 18px;
  }

  .title-text {
    flex: 1;
    text-align: center;
  }
`;

const ContentItem = styled.div`
  margin-bottom: 12px;
  text-align: center;
`;

const ItemTitle = styled.h4`
  color: #000000;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
  text-align: center;
  font-family: "Noto Serif TC", serif;
`;

const ItemContent = styled.p`
  color: #414141;
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
  text-align: center;
  font-family: "Noto Serif TC", serif;
`;

const Summary = styled.div`
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;

  p {
    color: #666;
    line-height: 1.8;
    margin: 0;
  }
`;
const IconImage = styled.div`
  width: 50px;
  height: 50px;
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50%;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
  z-index: 3;
`;

const AnalysisResult = ({ result, imageUrl, onRetake }) => {
  // const analysisData = result?.result;
  const getIconForBlock = (blockIndex) => {
    return `/face_${blockIndex}_white.png`;
  };

  return (
    <Container>
      {imageUrl && (
        <ImageContainer>
          <img src={imageUrl} alt="captured" />
        </ImageContainer>
      )}

      {result.faceShape && (
        <AnalysisBlock>
          <IconImage src={getIconForBlock(1)} />
          <BlockTitle>
            <img src="/chinese_tie.png" alt="裝飾" className="title-icon" />
            <span className="title-text">{result.faceShape.title}</span>
            <img src="/chinese_tie.png" alt="裝飾" className="title-icon" />
          </BlockTitle>
          {Object.entries(result.faceShape.content).map(([key, value]) => (
            <ContentItem key={key}>
              <ItemTitle>{key}</ItemTitle>
              <ItemContent>{value}</ItemContent>
            </ContentItem>
          ))}
        </AnalysisBlock>
      )}

      {result.features && (
        <AnalysisBlock>
          <IconImage src={getIconForBlock(2)} />
          <BlockTitle>
            <img src="/chinese_tie.png" alt="裝飾" className="title-icon" />
            <span className="title-text">{result.features.title}</span>
            <img src="/chinese_tie.png" alt="裝飾" className="title-icon" />
          </BlockTitle>
          {Object.entries(result.features.content).map(([key, value]) => (
            <ContentItem key={key}>
              <ItemTitle>{key}</ItemTitle>
              <ItemContent>{value}</ItemContent>
            </ContentItem>
          ))}
        </AnalysisBlock>
      )}

      {result.overall && (
        <AnalysisBlock>
          <IconImage src={getIconForBlock(3)} />
          <BlockTitle>
            <img src="/chinese_tie.png" alt="裝飾" className="title-icon" />
            <span className="title-text">{result.overall.title}</span>
            <img src="/chinese_tie.png" alt="裝飾" className="title-icon" />
          </BlockTitle>
          {Object.entries(result.overall.content).map(([key, value]) => (
            <ContentItem key={key}>
              <ItemTitle>{key}</ItemTitle>
              <ItemContent>{value}</ItemContent>
            </ContentItem>
          ))}
        </AnalysisBlock>
      )}

      {result.summary && (
        <Summary>
          <BlockTitle>
            <img src="/chinese_tie.png" alt="裝飾" className="title-icon" />
            <span className="title-text">整體評析</span>
            <img src="/chinese_tie.png" alt="裝飾" className="title-icon" />
          </BlockTitle>
          <p>{result.summary}</p>
        </Summary>
      )}

      <RetakeButton onClick={onRetake}>重新拍照</RetakeButton>
    </Container>
  );
};

export default AnalysisResult;
