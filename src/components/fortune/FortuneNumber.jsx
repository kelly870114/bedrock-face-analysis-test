import React, { useState } from "react";
import styled from "styled-components";
import { config } from "../../config";
import FortuneInterpret from "./FortuneInterpret";
import { useTranslation, translateError } from "../../i18n";
import { LoadingContainer, FortuneIcon } from "./styles-fortune-mobile";

const MAIN_COLOR = "#C84B31";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 40px 20px;
  box-sizing: border-box;
`;

const FortuneImageContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  width: 90vw;
  max-width: min(400px, 90%);
`;

const FortuneImage = styled.div`
  width: 50%;
  margin: auto;

  img {
    width: 100%;
    height: auto;
    object-fit: contain;
  }
`;

const ButtonContainer = styled.div`
  width: 90vw;
  max-width: min(400px, 90%);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 0 20px;
  box-sizing: border-box;
`;

const InterpretButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 32px;
  border-radius: 16px;
  border: none;
  background-color: ${MAIN_COLOR};
  color: white;
  font-size: 18px;
  font-weight: 800;
  font-family: "Noto Serif TC", serif;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(184, 92, 56, 0.3);
  width: 200px;

  &:hover {
    transform: translateY(-2px);
    background-color: #b85c38;
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
`;

const FortuneNumber = ({ user_name, category, existingNumber = null, eventId, lang }) => {
  const { t } = useTranslation(lang); // 使用翻譯 Hook
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [interpretation, setInterpretation] = useState(null);
  const [localFortuneNumber] = useState(() => {
    // 如果有existingNumber就使用它，否則隨機生成
    if (existingNumber && existingNumber >= 1 && existingNumber <= 24) {
      return existingNumber;
    }
    return Math.floor(Math.random() * 24) + 1;
  });

  const handleInterpret = async () => {
    try {
      setIsInterpreting(true);

      if (!user_name || !category || !localFortuneNumber) {
        throw new Error(t("fortuneTelling.missingParams"));
      }

      // 檢查是否有 eventId
      if (!eventId) {
        throw new Error(t("desktop.invalidEventCode"));
      }

      const response = await fetch(`${config.apiEndpoint}/interpretFortune`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name: user_name,
          fortune_category: category,
          fortune_number: localFortuneNumber,
          event_id: eventId, // 加入 event_id 參數
          lang: lang
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t("fortuneTelling.interpretError"));
      }

      const result = await response.json();
      setInterpretation(result);
    } catch (error) {
      console.error("Error:", error);
      // 使用翻譯的錯誤訊息
      const errorMessage = translateError(error.message, lang) || t("fortuneTelling.interpretError");
      alert(errorMessage);
    } finally {
      setIsInterpreting(false);
    }
  };

  if (interpretation) {
    return (
      <FortuneInterpret
        name={user_name}
        category={category}
        fortuneNumber={localFortuneNumber}
        interpretation={interpretation}
        eventId={eventId} // 傳遞 eventId 給 FortuneInterpret
        lang={lang}  // 加入語言參數傳遞給子組件
      />
    );
  }

  // 確保籤號是兩位數的字串格式
  const formattedNumber = String(localFortuneNumber).padStart(2, "0");

  return (
    <Container>
      <FortuneImageContainer>
        <FortuneImage>
          <img
            src={`/jenn-ai/${formattedNumber}.png`}
            alt={t("fortuneTelling.fortuneImage", {
              number: localFortuneNumber,
            })}
          />
        </FortuneImage>
      </FortuneImageContainer>

      <ButtonContainer>
        <InterpretButton onClick={handleInterpret} disabled={isInterpreting}>
          {isInterpreting
            ? t("fortuneTelling.interpreting")
            : t("fortuneTelling.startInterpreting")}
        </InterpretButton>
        <InterpretButton
          onClick={() => window.location.reload()}
          disabled={isInterpreting}
          style={{
            backgroundColor: "transparent",
            color: MAIN_COLOR,
            border: `2px solid ${MAIN_COLOR}`,
          }}
        >
          {t("fortuneTelling.retryFortune")}
        </InterpretButton>
      </ButtonContainer>

      {isInterpreting && (
        <LoadingOverlay>
          <LoadingContainer>
            <FortuneIcon 
              src="/fortune-lot.png" 
              alt="Fortune Lot"
            />
            {t("fortuneTelling.interpreting")}
          </LoadingContainer>
        </LoadingOverlay>
      )}
    </Container>
  );
};

export default FortuneNumber;