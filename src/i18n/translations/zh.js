export default {
  // 通用文本
  common: {
    loading: "載入中...",
    error: "發生錯誤",
    retry: "重試",
    submit: "提交",
    cancel: "取消",
    back: "返回",
    close: "關閉",
    save: "儲存",
    processing: "處理中...", // 新增
    decoration: "裝飾", // 新增
    copyright:
      "© 2024 Amazon Web Services Solutions Architect. All rights reserved.",
  },

  // 桌面視圖
  desktop: {
    title: "🔮 體驗 Amazon Bedrock 🔮",
    description: "請輸入活動代碼，選擇想要體驗的服務",
    eventCodePlaceholder: "請輸入活動代碼",
    loading: "載入中...",
    faceAnalysis: "🌝 面相大師",
    fortuneTelling: "🎋 解籤大師",
    qrCodeDescription: "請使用手機掃描下方 QR Code 開始分析",
    invalidEventCode: "無效的活動代碼",
    eventNotAvailable: "活動未開放",
    systemError: "系統發生錯誤，請稍後再試",
    instructions: {
      scanQRCode: "請使用手機相機掃描 QR Code",
      enterFaceAnalysis: "掃描後會進入面相大師分析您的面相及運勢",
      bedrockAnalysis: "拍攝完成後，會由Amazon Bedrock進行分析",
    },
  },

  // 面相分析
  faceAnalysis: {
    title: "面相大師",
    startAnalysis: "開始分析",
    analyzing: "分析中...",
    retakePhoto: "重新拍照",
    downloadResult: "下載分析結果",
    processing: "處理中...",
    scanToDownload: "掃描 QR Code 下載分析結果",
    downloadExpiration: "請在 10 分鐘內完成下載",
    capturedImage: "拍攝的照片", // 新增
    waiting: "等待中", // 新增
    preparing: "準備中...", // 新增
    analyzingFaceShape: "臉型比例分析中...", // 新增
    faceShapeCompleted: "臉型分析完成！正在分析五官...", // 新增
    featuresCompleted: "五官分析完成！正在進行綜合分析...", // 新增
    analysisCompleted: "分析完成！", // 新增
    waitingToStart: "等待開始", // 新增
    connectionFailed: "連接失敗", // 新增
    connectionLost: "連接中斷", // 新增
    analysisError: "分析出現錯誤", // 新增
    analysisFailed: "分析失敗", // 新增
    missingSessionId: "缺少會話ID", // 新增
    cannotGetUploadUrl: "無法獲取上傳網址", // 新增
    imageUploadFailed: "圖片上傳失敗", // 新增
    processingFailed: "圖片處理失敗，請稍後再試", // 新增
    faceShapeStages: {
      pending: "臉型比例分析等待中",
      processing: "臉型比例分析中...",
      completed: "臉型比例分析完成",
      failed: "臉型比例分析失敗",
    },
    featureAnalysisStages: {
      pending: "五官特徵分析等待中",
      processing: "五官特徵分析中...",
      completed: "五官特徵分析完成",
      failed: "五官特徵分析失敗",
    },
    overallAnalysisStages: {
      pending: "運勢整體分析等待中",
      processing: "運勢整體分析中...",
      completed: "運勢整體分析完成",
      failed: "運勢整體分析失敗",
    },
    faceShapeAnalysis: "臉型比例分析",
    featureAnalysis: "五官特徵分析",
    overallAnalysis: "運勢發展評析",
    summary: "整體評析",
  },

  // 解籤分析
  fortuneTelling: {
    title: "解籤大師",
    enterName: "請輸入姓名",
    category: {
      love: "愛情",
      career: "事業",
      wealth: "財運",
      family: "家庭",
      study: "學業",
      travel: "旅遊",
    },
    startFortuneTelling: "開始抽籤",
    hasFortuneNumber: "已有籤號",
    chooseFortuneNumber: "選擇籤號",
    fortuneNumberPlaceholder: "1-24",
    confirm: "確定",
    noNameError: "請輸入姓名",
    noCategoryError: "請選擇一個類別",
    interpreting: "解籤中...",
    startInterpreting: "開始解籤",
    retryFortune: "重新抽籤",
    downloadResult: "下載解籤結果",
    fortuneInterpretation: "的解籤",
    suggestion: "建議",
    awsReminder: "AWS 小提醒",
    combineWithFace: "結合面相獲取建議",
    nameAnalysis: "結合姓名學分析",
    personalFortune: "的專屬籤詩",
    generatingPoem: "籤詩生成中...",
    printFortune: "列印籤詩",
    printDevMode: "列印開發者模式",
    printing: "列印中...",
  },
};