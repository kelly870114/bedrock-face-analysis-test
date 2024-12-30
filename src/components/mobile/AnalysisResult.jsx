import React from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 5%;
  background-color: white;
  margin: 2% auto;
  width: 90%;
  max-width: 400px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0; 
    background-image: repeating-linear-gradient(
      45deg,
      black,
      black 2rem,
      #F39518 2rem,
      #F39518 3rem
    );
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor; 
    mask-composite: exclude;
    padding: 0.8rem;
    border-radius: 1.25rem;
    pointer-events: none;
    z-index: 1;
  }
`;

const Title = styled.h2`
  color: #000000;
  font-size: 24px;
  margin-bottom: 16px;
  text-align: center;
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

const Content = styled.div`
  position: relative;
  z-index: 2;
  white-space: pre-line;
  line-height: 1.6;
  color: #333;
  font-size: 16px;
`;

const RetakeButton = styled.button`
  background-color: #000000;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  margin-top: 20px;
  cursor: pointer;
  width: 100%;

  &:hover {
    background-color: #414141;
  }
`;

const AnalysisBlock = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 2rem 0.5rem 0.5rem;
  margin-bottom: 2.5rem; 
  margin-top: 2rem;
  width: 100%;
  box-sizing: border-box;
  border: 3px solid black;
  border-radius: 20px;
  position: relative;
  z-index: 2;
`;


const BlockTitle = styled.h3`
  color: #000000;
  font-size: 20px;
  margin-bottom: 16px;
  text-align: center;
  font-weight: 600;
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
`;

const ItemContent = styled.p`
  color: #414141;
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
  text-align: center;
`;

const Summary = styled.div`
  background: white;
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
  width: 60px;
  height: 60px;
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50%;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  z-index: 3;
`;

const AnalysisResult = ({ result, imageUrl, onRetake }) => {
    // const analysisData = result?.result;
    const getIconForBlock = (blockIndex) => {
        return `/face_${blockIndex}.png`;
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
            <BlockTitle>{result.faceShape.title}</BlockTitle>
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
            <BlockTitle>{result.features.title}</BlockTitle>
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
            <BlockTitle>{result.overall.title}</BlockTitle>
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
            <BlockTitle>整體評析</BlockTitle>
            <p>{result.summary}</p>
          </Summary>
        )}
  
        <RetakeButton onClick={onRetake}>
          重新拍照
        </RetakeButton>
      </Container>
    );
  };

export default AnalysisResult;
