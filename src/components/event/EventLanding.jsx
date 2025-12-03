import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { config } from "../../config";

const MAIN_COLOR = "#C84B31";

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #FDF6E9 0%, #F5E6D3 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
`;

const Container = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  position: relative;
`;

const EventName = styled.h1`
  color: ${MAIN_COLOR};
  font-size: 28px;
  font-family: 'Noto Serif TC', serif;
  margin: 0 0 10px 0;
`;

const EventMessage = styled.p`
  color: #666;
  font-size: 16px;
  margin: 0 0 30px 0;
`;

const FeatureGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FeatureButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px 30px;
  border-radius: 16px;
  border: 2px solid ${MAIN_COLOR};
  background: white;
  color: ${MAIN_COLOR};
  font-size: 20px;
  font-weight: 600;
  font-family: 'Noto Serif TC', serif;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${MAIN_COLOR};
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(200, 75, 49, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const FeatureIcon = styled.span`
  font-size: 28px;
`;

const LoadingText = styled.div`
  color: ${MAIN_COLOR};
  font-size: 20px;
  font-family: 'Noto Serif TC', serif;
`;

const ErrorText = styled.div`
  color: #D32F2F;
  font-size: 16px;
  padding: 20px;
  background: #FFEBEE;
  border-radius: 10px;
`;

// 文化類型對應的功能（多語言）
const CULTURE_CONFIG = {
  tw_fortune: {
    icon: "🏮",
    labels: { zh: "籤詩算命", zhcn: "签诗算命", en: "Fortune Sticks" },
    route: "fortune",
  },
  tw_face: {
    icon: "👤",
    labels: { zh: "面相分析", zhcn: "面相分析", en: "Face Reading" },
    route: "face",
  },
  jp_omikuji: {
    icon: "⛩️",
    labels: { zh: "御神籤", zhcn: "御神签", en: "Omikuji" },
    route: "fortune",
  },
  western_tarot: {
    icon: "🔮",
    labels: { zh: "塔羅占卜", zhcn: "塔罗占卜", en: "Tarot Reading" },
    route: "fortune",
  },
};

// 頁面文字（多語言）
const PAGE_TEXT = {
  loading: { zh: "載入中...", zhcn: "加载中...", en: "Loading..." },
  selectFeature: { zh: "請選擇要體驗的功能", zhcn: "请选择要体验的功能", en: "Select a feature to experience" },
  noFeatures: { zh: "此活動尚未設定功能", zhcn: "此活动尚未设定功能", en: "No features configured for this event" },
  eventNotAvailable: { zh: "活動未開放", zhcn: "活动未开放", en: "Event not available" },
  systemError: { zh: "系統錯誤", zhcn: "系统错误", en: "System error" },
};

const EventLanding = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [eventInfo, setEventInfo] = useState(null);
  const [defaultLanguage, setDefaultLanguage] = useState("zh");
  const [cultureTypes, setCultureTypes] = useState([]);
  const [eventId, setEventId] = useState(null);

  useEffect(() => {
    const checkEventAccess = async () => {
      try {
        const eventIdFromParams = searchParams.get("event");

        if (!eventIdFromParams) {
          // 沒有 event 參數，導回首頁
          navigate("/");
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
          const lang = data.default_language || "zh";
          setError(data.message || PAGE_TEXT.eventNotAvailable[lang]);
          setEventInfo({
            name: data.eventName,
            message: data.message,
          });
        } else {
          setEventInfo({
            name: data.eventName,
            message: data.message,
          });
        }

        // 設定預設語言和文化類型
        if (data.default_language) {
          setDefaultLanguage(data.default_language);
        }
        if (data.culture_types) {
          setCultureTypes(data.culture_types);
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setError(PAGE_TEXT.systemError[defaultLanguage] || "System error");
        setIsLoading(false);
      }
    };

    checkEventAccess();
  }, [searchParams, navigate]);

  const handleFeatureClick = (cultureType) => {
    const featureConfig = CULTURE_CONFIG[cultureType];
    if (featureConfig) {
      navigate(`/${defaultLanguage}/${featureConfig.route}?event=${eventId}`);
    }
  };

  // 取得當前語言的文字
  const getText = (textObj) => textObj[defaultLanguage] || textObj.en || textObj.zh;

  if (isLoading) {
    return (
      <PageWrapper>
        <Container>
          <LoadingText>{getText(PAGE_TEXT.loading)}</LoadingText>
        </Container>
      </PageWrapper>
    );
  }

  if (error && !eventInfo) {
    return (
      <PageWrapper>
        <Container>
          <ErrorText>{error}</ErrorText>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container>
        <EventName>{eventInfo?.name || "AWS Event"}</EventName>
        <EventMessage>
          {error || getText(PAGE_TEXT.selectFeature)}
        </EventMessage>

        {!error && cultureTypes.length > 0 && (
          <FeatureGrid>
            {cultureTypes.map((cultureType) => {
              const featureConfig = CULTURE_CONFIG[cultureType];
              if (!featureConfig) return null;
              
              return (
                <FeatureButton
                  key={cultureType}
                  onClick={() => handleFeatureClick(cultureType)}
                >
                  <FeatureIcon>{featureConfig.icon}</FeatureIcon>
                  {getText(featureConfig.labels)}
                </FeatureButton>
              );
            })}
          </FeatureGrid>
        )}

        {!error && cultureTypes.length === 0 && (
          <ErrorText>{getText(PAGE_TEXT.noFeatures)}</ErrorText>
        )}
      </Container>
    </PageWrapper>
  );
};

export default EventLanding;
