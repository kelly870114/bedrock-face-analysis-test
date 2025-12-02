> ## README created by Kiro

# Amazon Bedrock AI Analysis Web Application

A multi-language web application that leverages Amazon Bedrock for AI-powered face analysis and fortune telling services. The application provides both physiognomy analysis and traditional Chinese fortune telling experiences through an intuitive mobile-first interface.

## 🌟 Features

- **Face Reading Master (面相大師)**: AI-powered facial feature analysis and fortune prediction
- **Fortune Telling Master (解籤大師)**: Traditional Chinese fortune telling with personalized interpretations
- **Multi-language Support**: English, Traditional Chinese, and Simplified Chinese
- **Real-time Analysis**: Live progress tracking with WebSocket connections via AWS IoT Core
- **Mobile-Optimized**: Camera integration and responsive design
- **QR Code Integration**: Seamless desktop-to-mobile workflow

## 🏗️ Architecture

The application uses a serverless architecture powered by AWS services:

- **Frontend**: React 18 with styled-components
- **Backend**: AWS Lambda + API Gateway
- **AI Engine**: Amazon Bedrock for analysis
- **Real-time Updates**: AWS IoT Core for WebSocket communication
- **Authentication**: AWS Cognito Identity Pool
- **Hosting**: AWS Amplify

## 📁 Project Structure

```
frontend/
├── public/                          # Static assets
│   ├── jenn-ai/                     # AI-generated face analysis images
│   ├── app_title_*.png              # Application titles in different languages
│   ├── face_*.png                   # Face analysis UI assets
│   ├── mobile_*.png                 # Mobile UI assets
│   ├── fortune-lot.png              # Fortune telling assets
│   └── architecture.png             # System architecture diagram
├── src/
│   ├── components/
│   │   ├── common/                  # Shared components
│   │   │   ├── Camera/              # Camera capture functionality
│   │   │   ├── DesktopView/         # Desktop entry point with QR code
│   │   │   └── LanguageSwitcher.jsx # Language toggle component
│   │   ├── face/                    # Face analysis components
│   │   │   ├── MobileView.jsx       # Mobile camera & upload interface
│   │   │   ├── AnalysisResult.jsx   # Analysis results display
│   │   │   ├── AnimatedProgressIndicator.jsx
│   │   │   ├── styles-mobile.js     # Mobile view styles
│   │   │   └── styles-result.js     # Result view styles
│   │   ├── fortune/                 # Fortune telling components
│   │   │   ├── FortuneMobileView.jsx    # Fortune main interface
│   │   │   ├── FortuneInterpret.jsx     # Fortune interpretation display
│   │   │   ├── FortuneNumber.jsx        # Fortune number selection
│   │   │   ├── styles-fortune-mobile.js
│   │   │   └── styles-fortune-interpret.js
│   │   └── utils/                   # Utility services
│   │       ├── amplifyConfig.js     # AWS Amplify configuration
│   │       ├── iotService.js        # AWS IoT Core service
│   │       └── pubSubService.js     # Pub/Sub messaging service
│   ├── config/                      # Configuration files
│   ├── i18n/                        # Internationalization
│   │   ├── translations/            # Language files
│   │   │   ├── en.js                # English
│   │   │   ├── zh.js                # Traditional Chinese
│   │   │   └── zhcn.js              # Simplified Chinese
│   │   ├── config.js                # i18n configuration
│   │   ├── errorMessages.js         # Localized error messages
│   │   ├── index.js                 # i18n exports
│   │   └── useTranslation.js        # Translation hook
│   ├── App.jsx                      # Main application router
│   ├── App.css                      # Global styles
│   └── index.js                     # Application entry point
└── package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- AWS account with Bedrock access
- Valid event code from organizer

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd frontend
npm install
```

2. **Configure environment:**
```bash
# Set your API endpoint in src/config/index.js
export const config = {
  apiEndpoint: 'your-api-gateway-endpoint',
  cognitoIdentityPoolId: 'your-cognito-pool-id',
  iotEndpoint: 'your-iot-endpoint'
};
```

3. **Start development server:**
```bash
npm start
```

4. **Access the application:**
   - Desktop: `http://localhost:3000`
   - Mobile: Scan QR code from desktop view

## 📱 Usage Guide

### Desktop Flow
1. Enter valid event code
2. Choose service: Face Reading or Fortune Telling
3. QR code appears for mobile access

### Face Reading Master (面相大師)
1. **Mobile Setup**: Scan QR code, grant camera permissions
2. **Photo Capture**: Take clear face photo
3. **AI Analysis**: Real-time progress tracking through 3 stages:
   - Face shape analysis (臉型分析)
   - Facial features analysis (五官分析)
   - Overall fortune prediction (整體運勢)
4. **Results**: View detailed analysis with downloadable report

### Fortune Telling Master (解籤大師)
1. **Personal Info**: Enter name and select category (love, career, wealth, etc.)
2. **Fortune Selection**: Choose fortune number (1-24) or get random
3. **AI Interpretation**: Personalized fortune reading with suggestions
4. **Results**: Download fortune poem and interpretation

## 🌐 Multi-language Support

The application supports three languages with automatic routing:

| Language | Route | File |
|----------|-------|------|
| Traditional Chinese | `/zh/` | `translations/zh.js` |
| Simplified Chinese | `/zhcn/` | `translations/zhcn.js` |
| English | `/en/` | `translations/en.js` |

Language files are located in `src/i18n/translations/`.

## 🔧 Configuration

### Environment Variables
```javascript
// src/config/index.js
export const config = {
  apiEndpoint: process.env.REACT_APP_API_ENDPOINT || 'default-endpoint',
  cognitoIdentityPoolId: 'your-cognito-pool-id',
  iotEndpoint: 'your-iot-endpoint'
};
```

### AWS Services Setup
- **API Gateway**: RESTful endpoints for analysis requests
- **Lambda Functions**: Backend processing logic
- **Bedrock**: AI model integration (Claude)
- **IoT Core**: Real-time progress updates via MQTT
- **Cognito**: Identity management for IoT authentication

## 🧪 Testing

```bash
# Run test suite
npm test

# Run specific tests
npm test -- --testNamePattern="Component"
```

## 🚀 Deployment

```bash
# Build for production
npm run build

# Deploy to AWS Amplify
# Configure Amplify with your repository and build settings
```

## 📦 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.3.1 | UI framework |
| react-router-dom | ^6.28.0 | Client-side routing |
| styled-components | ^6.1.13 | CSS-in-JS styling |
| aws-amplify | ^5.3.27 | AWS service integration |
| mqtt | ^5.11.1 | IoT Core communication |
| qrcode.react | ^4.1.0 | QR code generation |
| html2canvas | ^1.4.1 | Screenshot/download feature |
| lucide-react | ^0.292.0 | Icon library |

## 🔍 Troubleshooting

### Common Issues

**Camera Access Denied**
- Ensure HTTPS connection (required for camera API)
- Check browser permissions
- Verify camera hardware availability

**API Connection Errors**
- Verify API endpoint configuration
- Check AWS service status
- Validate event code

**Real-time Updates Not Working**
- Confirm IoT endpoint configuration
- Check WebSocket connection status
- Verify Cognito credentials

**Language Display Issues**
- Clear browser cache
- Check language file imports
- Verify routing configuration

## 📊 Performance Optimization

- **Image Compression**: Automatic compression before upload
- **Lazy Loading**: Components loaded on demand
- **Caching**: Static assets cached for performance
- **WebSocket Management**: Efficient IoT Core connection handling

---

**Powered by Amazon Bedrock** 🚀
