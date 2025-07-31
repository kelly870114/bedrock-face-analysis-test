> <div style="color: #007EB9;">
> 
> ## README created by Amazon Q Developer
> </div>
> For more Amazon Q Developer's new feature: https://aws.amazon.com/blogs/aws/new-amazon-q-developer-agent-capabilities-include-generating-documentation-code-reviews-and-unit-tests/
&nbsp;

# Amazon Bedrock AI Analysis Web Application

A multi-language web application that leverages Amazon Bedrock for AI-powered face analysis and fortune telling services. The application provides both physiognomy analysis and traditional Chinese fortune telling experiences through an intuitive mobile-first interface.

## 🌟 Features

- **Face Reading Master (面相大師)**: AI-powered facial feature analysis and fortune prediction
- **Fortune Telling Master (解籤大師)**: Traditional Chinese fortune telling with personalized interpretations
- **Multi-language Support**: English, Traditional Chinese, and Simplified Chinese
- **Real-time Analysis**: Live progress tracking with WebSocket connections
- **Mobile-Optimized**: Camera integration and responsive design
- **QR Code Integration**: Seamless desktop-to-mobile workflow

## 🏗️ Architecture

The application uses a serverless architecture powered by AWS services:

- **Frontend**: React.js with styled-components
- **Backend**: AWS Lambda + API Gateway
- **AI Engine**: Amazon Bedrock for analysis
- **Real-time Updates**: AWS IoT Core for WebSocket communication
- **Authentication**: AWS Cognito Identity Pool
- **Hosting**: AWS Amplify

## 📁 Project Structure

```
frontend/
├── public/                     # Static assets
│   ├── jenn-ai/               # AI-generated face analysis images
│   ├── app_title_*.png        # Application titles in different languages
│   ├── face_*.png             # Face analysis UI assets
│   └── architecture.png       # System architecture diagram
├── src/
│   ├── components/
│   │   ├── common/            # Shared components
│   │   │   ├── Camera/        # Camera capture functionality
│   │   │   ├── DesktopView/   # Desktop entry point
│   │   │   └── LanguageSwitcher.jsx
│   │   ├── face/              # Face analysis components
│   │   │   ├── MobileView.jsx
│   │   │   ├── AnalysisResult.jsx
│   │   │   └── AnimatedProgressIndicator.jsx
│   │   ├── fortune/           # Fortune telling components
│   │   │   ├── FortuneMobileView.jsx
│   │   │   ├── FortuneInterpret.jsx
│   │   │   └── FortuneNumber.jsx
│   │   └── utils/             # Utility services
│   │       ├── amplifyConfig.js
│   │       ├── iotService.js
│   │       └── pubSubService.js
│   ├── config/                # Configuration files
│   ├── i18n/                  # Internationalization
│   │   ├── translations/      # Language files (en, zh, zhcn)
│   │   └── config.js
│   └── App.jsx                # Main application router
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

### Face Reading Master
1. **Mobile Setup**: Scan QR code, grant camera permissions
2. **Photo Capture**: Take clear face photo
3. **AI Analysis**: Real-time progress tracking through 3 stages:
   - Face shape analysis
   - Facial features analysis  
   - Overall fortune prediction
4. **Results**: View detailed analysis with downloadable report

### Fortune Telling Master
1. **Personal Info**: Enter name and select category (love, career, wealth, etc.)
2. **Fortune Selection**: Choose fortune number (1-24) or get random
3. **AI Interpretation**: Personalized fortune reading with suggestions
4. **Results**: Download fortune poem and interpretation

## 🌐 Multi-language Support

The application supports three languages with automatic routing:

- **English**: `/en/`
- **Traditional Chinese**: `/zh/`
- **Simplified Chinese**: `/zhcn/`

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
- **Bedrock**: AI model integration
- **IoT Core**: Real-time progress updates
- **Cognito**: Identity management

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

## 🔍 Troubleshooting

### Common Issues

**Camera Access Denied**
- Ensure HTTPS connection
- Check browser permissions
- Verify camera hardware availability

**API Connection Errors**
- Verify API endpoint configuration
- Check AWS service status
- Validate event code

**Real-time Updates Not Working**
- Confirm IoT endpoint configuration
- Check WebSocket connection
- Verify Cognito credentials

**Language Display Issues**
- Clear browser cache
- Check language file imports
- Verify routing configuration

## 📊 Performance Optimization

- **Image Compression**: Automatic compression before upload
- **Lazy Loading**: Components loaded on demand
- **Caching**: Static assets cached for performance
- **WebSocket Management**: Efficient connection handling
- **IoT Core**

---

**Powered by Amazon Bedrock** 🚀