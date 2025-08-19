import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { X } from "lucide-react";
import { config } from "../../config";
import {
  PageWrapper,
  ChineseContainer,
  BorderContainer,
  Corner,
  ContentWrapper,
  TitleContainer,
  LogoContainer,
  FormContainer,
  InputContainer,
  Input,
  ButtonGroup,
  CategoryButton,
  StartButton,
  ModalOverlay,
  ModalContent,
  ModalTitle,
  ModalCloseButton,
  NumberInput,
  NumberButtonGrid,
  NumberButton,
} from "./styles-fortune-mobile";
import FortuneResult from "./FortuneNumber";
import LanguageSwitcher from "../common/LanguageSwitcher";
import { useTranslation, translateError } from "../../i18n";

const FortuneMobileView = ({ lang }) => {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation(lang);

  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showNumberModal, setShowNumberModal] = useState(false);
  const [fortuneNumber, setFortuneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(true); // 改為 true，因為需要先檢查 event
  const [existingNumber, setExistingNumber] = useState(null);
  const [instanceKey, setInstanceKey] = useState(Date.now());
  const [error, setError] = useState("");
  
  // 新增 event 相關狀態
  const [eventInfo, setEventInfo] = useState(null);
  const [eventId, setEventId] = useState(null);
  const [eventAccessible, setEventAccessible] = useState(false);

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
          setEventAccessible(false);
          setIsLoading(false);
          return;
        }

        setEventInfo({
          name: data.eventName,
          message: data.message,
        });
        setEventAccessible(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError(t("desktop.systemError"));
        setIsLoading(false);
      }
    };

    checkEventAccess();
  }, [searchParams, t]);

  // 從 URL 參數讀取重置信息
  useEffect(() => {
    // 檢查是否是重置操作
    const resetParam = searchParams.get("reset");
    if (resetParam) {
      // 重置所有狀態
      setName("");
      setSelectedCategory(null);
      setShowResult(false);
      setExistingNumber(null);
      setFortuneNumber("");
      setError("");

      // 更新URL，移除reset參數
      const url = new URL(window.location.href);
      url.searchParams.delete("reset");
      window.history.replaceState({}, "", url);
    }
  }, [searchParams]);

  const handleStartFortune = () => {
    // 檢查 event 是否可存取
    if (!eventAccessible) {
      setError(t("desktop.eventNotAvailable"));
      return;
    }

    // 檢查是否選擇了類別
    if (!selectedCategory) {
      setError(t("fortuneTelling.noCategoryError"));
      return;
    }

    if (!name.trim()) {
      setError(t("fortuneTelling.noNameError", { defaultValue: "請輸入姓名" }));
      return;
    }

    setIsLoading(true);
    setError("");

    // 清空既有籤號
    setExistingNumber(null);

    // 生成新的instanceKey，確保FortuneResult組件完全重新渲染
    setInstanceKey(Date.now());

    // 使用延時確保狀態更新完成後再顯示結果
    setTimeout(() => {
      setShowResult(true);
      setIsLoading(false);
    }, 50);
  };

  const handleExistingNumber = () => {
    // 檢查 event 是否可存取
    if (!eventAccessible) {
      setError(t("desktop.eventNotAvailable"));
      return;
    }

    const number = parseInt(fortuneNumber);
    if (number >= 1 && number <= 24) {
      if (!name.trim()) {
        setError(
          t("fortuneTelling.noNameError", { defaultValue: "請輸入姓名" })
        );
        return;
      }

      setIsLoading(true);
      setError("");

      // 設置已有籤號
      setExistingNumber(number);

      // 關閉模態框
      setShowNumberModal(false);

      // 生成新的instanceKey
      setInstanceKey(Date.now());

      // 延時顯示結果
      setTimeout(() => {
        setShowResult(true);
        setIsLoading(false);
      }, 50);
    } else {
      setError(
        t("fortuneTelling.invalidFortuneNumber", {
          defaultValue: "請輸入 1-24 之間的籤號",
        })
      );
    }
  };

  const handleRetry = () => {
    setName("");
    setSelectedCategory(null);
    setShowResult(false);
    setFortuneNumber("");
    setExistingNumber(null);
    setError("");
  };

  // Loading 狀態
  if (isLoading && !showResult) {
    return (
      <PageWrapper>
        <ChineseContainer>
          <BorderContainer />
          <Corner className="top-left" />
          <Corner className="top-right" />
          <Corner className="bottom-left" />
          <Corner className="bottom-right" />
          <ContentWrapper>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#C84B31',
              fontSize: '20px',
              fontFamily: 'Noto Serif TC, serif'
            }}>
              {t("common.loading")}
            </div>
          </ContentWrapper>
        </ChineseContainer>
      </PageWrapper>
    );
  }

  // 錯誤狀態（包括活動未開放）
  if (error && !eventAccessible && !showResult) {
    return (
      <PageWrapper>
        <ChineseContainer>
          <BorderContainer />
          <Corner className="top-left" />
          <Corner className="top-right" />
          <Corner className="bottom-left" />
          <Corner className="bottom-right" />
          <ContentWrapper>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              padding: '20px',
              textAlign: 'center'
            }}>
              <h2 style={{
                color: '#C84B31',
                fontFamily: 'Noto Serif TC, serif',
                marginBottom: '20px'
              }}>
                {eventInfo?.name || t("fortuneTelling.title")}
              </h2>
              <p style={{
                color: '#666',
                fontFamily: 'Noto Serif TC, serif',
                lineHeight: 1.5
              }}>
                {error}
              </p>
            </div>
          </ContentWrapper>
        </ChineseContainer>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <ChineseContainer>
        <BorderContainer />
        <Corner className="top-left" />
        <Corner className="top-right" />
        <Corner className="bottom-left" />
        <Corner className="bottom-right" />

        <ContentWrapper>
          {/* 語言切換器 - 只在初始選擇頁面顯示 */}
          {!showResult && <LanguageSwitcher />}

          {!showResult ? (
            <>
              <TitleContainer>
                <img
                  src={`/app_title_fortune_${lang}.png`}
                  alt={t("fortuneTelling.title")}
                  onError={(e) => {
                    e.target.src = "/app_title_fortune.png"; // 回退到預設圖片
                  }}
                />
              </TitleContainer>

              <LogoContainer>
                <img
                  src="/mobile_logo_fortune_nova.png"
                  alt={t("fortuneTelling.title")}
                />
              </LogoContainer>

              <FormContainer>
                <InputContainer>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("fortuneTelling.enterName")}
                    maxLength={20}
                    disabled={!eventAccessible}
                  />
                </InputContainer>

                <ButtonGroup>
                  <CategoryButton
                    selected={selectedCategory === "love"}
                    onClick={() => setSelectedCategory("love")}
                    disabled={!eventAccessible}
                  >
                    {t("fortuneTelling.category.love")}
                  </CategoryButton>
                  <CategoryButton
                    selected={selectedCategory === "career"}
                    onClick={() => setSelectedCategory("career")}
                    disabled={!eventAccessible}
                  >
                    {t("fortuneTelling.category.career")}
                  </CategoryButton>
                  <CategoryButton
                    selected={selectedCategory === "wealth"}
                    onClick={() => setSelectedCategory("wealth")}
                    disabled={!eventAccessible}
                  >
                    {t("fortuneTelling.category.wealth")}
                  </CategoryButton>
                  <CategoryButton
                    selected={selectedCategory === "family"}
                    onClick={() => setSelectedCategory("family")}
                    disabled={!eventAccessible}
                  >
                    {t("fortuneTelling.category.family")}
                  </CategoryButton>
                  <CategoryButton
                    selected={selectedCategory === "study"}
                    onClick={() => setSelectedCategory("study")}
                    disabled={!eventAccessible}
                  >
                    {t("fortuneTelling.category.study")}
                  </CategoryButton>
                  <CategoryButton
                    selected={selectedCategory === "travel"}
                    onClick={() => setSelectedCategory("travel")}
                    disabled={!eventAccessible}
                  >
                    {t("fortuneTelling.category.travel")}
                  </CategoryButton>
                </ButtonGroup>

                {error && (
                  <div
                    style={{
                      color: "red",
                      backgroundColor: "#fee",
                      padding: "10px",
                      margin: "10px 0",
                      borderRadius: "5px",
                      textAlign: "center",
                      width: "90%",
                      maxWidth: "400px",
                    }}
                  >
                    {error}
                  </div>
                )}

                {/* hide for event */}
                {/* <StartButton
                  disabled={!selectedCategory || isLoading || !name.trim() || !eventAccessible}
                  onClick={handleStartFortune}
                >
                  {isLoading
                    ? t("common.loading")
                    : t("fortuneTelling.startFortuneTelling")}
                </StartButton> */}

                <StartButton
                  disabled={!selectedCategory || isLoading || !name.trim() || !eventAccessible}
                  onClick={() => setShowNumberModal(true)}
                  style={{
                    backgroundColor: "transparent",
                    color: "#C84B31",
                    border: "2px solid #C84B31",
                    marginTop: "10px",
                  }}
                >
                  {t("fortuneTelling.hasFortuneNumber")}
                </StartButton>
              </FormContainer>
            </>
          ) : (
            <FortuneResult
              key={instanceKey} // 使用key強制重新渲染
              user_name={name}
              category={selectedCategory}
              existingNumber={existingNumber}
              eventId={eventId} // 傳遞 eventId 給 FortuneResult
              lang={lang} // 傳遞語言設定
            />
          )}
        </ContentWrapper>
      </ChineseContainer>

      {showNumberModal && (
        <ModalOverlay onClick={() => setShowNumberModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalCloseButton onClick={() => setShowNumberModal(false)}>
              <X size={20} />
            </ModalCloseButton>
            <ModalTitle>{t("fortuneTelling.chooseFortuneNumber")}</ModalTitle>
            <NumberInput
              type="number"
              min="1"
              max="24"
              value={fortuneNumber}
              onChange={(e) => setFortuneNumber(e.target.value)}
              placeholder={t("fortuneTelling.fortuneNumberPlaceholder")}
              disabled={!eventAccessible}
            />

            {/* 數字按鈕 */}
            <NumberButtonGrid>
              {Array.from({ length: 24 }, (_, i) => i + 1).map((num) => (
                <NumberButton
                  key={num}
                  selected={parseInt(fortuneNumber) === num}
                  onClick={() => setFortuneNumber(num.toString())}
                  disabled={!eventAccessible}
                >
                  {num}
                </NumberButton>
              ))}
            </NumberButtonGrid>

            {error && (
              <div
                style={{
                  color: "red",
                  backgroundColor: "#fee",
                  padding: "10px",
                  margin: "10px 0",
                  borderRadius: "5px",
                  textAlign: "center",
                }}
              >
                {error}
              </div>
            )}

            <StartButton
              onClick={handleExistingNumber}
              disabled={
                isLoading ||
                !fortuneNumber ||
                parseInt(fortuneNumber) < 1 ||
                parseInt(fortuneNumber) > 24 ||
                !eventAccessible
              }
            >
              {isLoading ? t("common.loading") : t("fortuneTelling.confirm")}
            </StartButton>
          </ModalContent>
        </ModalOverlay>
      )}

      {isLoading && showResult && (
        <ModalOverlay>
          <div
            style={{
              color: "white",
              fontSize: "20px",
              fontFamily: "Noto Serif TC, serif",
            }}
          >
            {t("common.loading")}
          </div>
        </ModalOverlay>
      )}
    </PageWrapper>
  );
};

export default FortuneMobileView;