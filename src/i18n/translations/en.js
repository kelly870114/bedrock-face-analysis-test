export default {
    // Common text
    common: {
      loading: "Loading...",
      error: "An error occurred",
      retry: "Retry",
      submit: "Submit",
      cancel: "Cancel",
      back: "Back",
      close: "Close",
      save: "Save",
      copyright: "© 2024 Amazon Web Services Solutions Architect. All rights reserved.",
    },
  
    // Desktop view
    desktop: {
      title: "🔮 Experience Amazon Bedrock 🔮",
      description: "Please enter the event code and choose a service to experience",
      eventCodePlaceholder: "Please enter event code",
      loading: "Loading...",
      faceAnalysis: "🌝 Face Reading",
      fortuneTelling: "🎋 Fortune Telling",
      qrCodeDescription: "Please scan the QR Code below to start analysis",
      invalidEventCode: "Invalid event code",
      eventNotAvailable: "Event is not available",
      systemError: "System error, please try again later",
      instructions: {
        scanQRCode: "Please use your phone camera to scan the QR Code",
        enterFaceAnalysis: "After scanning, the Face Reading system will analyze your facial features and fortune",
        bedrockAnalysis: "After taking a photo, Amazon Bedrock will analyze your results",
      },
    },
  
    // Face analysis
    faceAnalysis: {
      title: "Face Reading",
      startAnalysis: "Start Analysis",
      analyzing: "Analyzing...",
      retakePhoto: "Retake Photo",
      downloadResult: "Download Results",
      processing: "Processing...",
      scanToDownload: "Scan QR Code to download results",
      downloadExpiration: "Please download within 10 minutes",
      stages: {
        faceShape: "Face Shape Analysis",
        features: "Facial Features Analysis",
        overall: "Fortune Analysis",
      },
      status: {
        pending: "Waiting",
        processing: "Analyzing...",
        completed: "✓ Completed",
        failed: "× Failed",
      },
      
      faceShapeAnalysis: "Face Shape Analysis",
      featureAnalysis: "Facial Features Analysis",
      overallAnalysis: "Fortune Analysis",
      summary: "Overall Analysis",
    },
  
    // Fortune telling
    fortuneTelling: {
      title: "Fortune Telling",
      enterName: "Please enter your name",
      category: {
        love: "Love",
        career: "Career",
        wealth: "Wealth",
        family: "Family",
        study: "Study",
        travel: "Travel",
      },
      startFortuneTelling: "Start Fortune Telling",
      hasFortuneNumber: "I have a fortune number",
      chooseFortuneNumber: "Choose Fortune Number",
      fortuneNumberPlaceholder: "1-24",
      confirm: "Confirm",
      noNameError: "Please enter your name",
      noCategoryError: "Please select a category",
      interpreting: "Interpreting...",
      startInterpreting: "Start Interpretation",
      retryFortune: "Try Again",
      downloadResult: "Download Results",
      fortuneInterpretation: "'s Fortune",
      suggestion: "Suggestions",
      awsReminder: "AWS Reminder",
      combineWithFace: "Combine with Face Reading",
      nameAnalysis: "Include Name Analysis",
      personalFortune: "'s Personal Fortune Poem",
      generatingPoem: "Generating poem...",
      printFortune: "Print Your Poem",
      printDevMode: "Printing Dev Mode",
      printing: "Printing..."
    },
  };