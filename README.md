# 🏋️ AI Physique Analyzer

A cutting-edge web application that uses **TensorFlow.js** and **computer vision** to analyze physique photos and provide detailed muscle group ratings. Get instant feedback on your fitness progress with AI-powered pose detection and body measurement analysis.

![Physique Analyzer Demo](https://img.shields.io/badge/Demo-Live-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-Latest-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-cyan)

## ✨ Features

### 🤖 **AI-Powered Analysis**
- **Real-time pose detection** using MoveNet SinglePose.Thunder
- **17 body keypoint detection** for accurate measurements
- **Browser-based processing** - your data stays private
- **Confidence-based scoring** with intelligent fallbacks

### 📊 **Comprehensive Scoring**
- **Biceps**: Upper arm development analysis
- **Shoulders**: Width and symmetry assessment  
- **Chest**: Upper body proportions
- **Back**: Posture and shoulder development
- **Legs**: Thigh and calf measurements
- **Core**: Waist-to-shoulder ratio analysis
- **Overall Score**: Weighted average of all muscle groups

### 🎨 **Modern UI/UX**
- **Drag & drop photo upload** with instant preview
- **Animated progress indicators** during AI processing
- **Circular progress bars** with color-coded ratings
- **Responsive design** for all devices
- **Real-time step-by-step feedback** during analysis

### ⚡ **Performance Optimized**
- **Lazy loading** - AI models load only when needed
- **Client-side processing** - no server uploads required
- **Optimized TensorFlow.js** backends for maximum speed
- **Efficient state management** with React hooks

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** or **yarn**
- Modern web browser with WebGL support

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/physique-analyzer.git
cd physique-analyzer

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📖 How to Use

1. **Open the application** in your web browser
2. **Upload a photo** by dragging & dropping or clicking to browse
   - Best results with **front-facing full body shots**
   - Ensure good lighting and clear visibility
   - Single person in frame works best
3. **Wait for AI analysis** - models load automatically on first use
4. **View your results** with detailed muscle group ratings
5. **Try another photo** or download your report

### 📷 **Photo Guidelines**
- **Pose**: Stand straight, arms at sides or flexed
- **Distance**: 2-4 meters from camera for full body shots
- **Lighting**: Well-lit, avoid harsh shadows
- **Background**: Plain background works best
- **Clothing**: Fitted clothing for better body outline detection

## 🔧 Technical Architecture

### **Frontend Stack**
```
Next.js 15 (React 19)
├── TypeScript - Type safety
├── Tailwind CSS 4 - Styling
└── Components
    ├── PhysiqueAnalyzer - Main container
    ├── PhotoUpload - File handling & preview
    ├── RatingsDisplay - Results visualization
    └── Header - App branding
```

### **AI/ML Stack**
```
TensorFlow.js
├── @tensorflow/tfjs - Core library
├── @tensorflow-models/pose-detection - Pose estimation
├── MoveNet SinglePose.Thunder - High accuracy model
└── WebGL/CPU backends - Hardware acceleration
```

### **Key Components**

#### `PhysiqueAnalyzerService`
The core AI service that handles:
- Model initialization and caching
- Pose detection from images
- Feature extraction from keypoints
- Scoring algorithm implementation

#### `PhotoUpload`
Handles user interaction:
- Drag & drop file upload
- Image preview and validation
- Progress feedback during processing
- Error state management

#### `RatingsDisplay`
Visualizes results:
- Animated circular progress bars
- Color-coded rating categories
- Responsive grid layout
- Export functionality

## 🧮 Scoring Algorithm

### **Feature Extraction**
The AI analyzes pose keypoints to extract:

```typescript
{
  shoulderWidth: number,        // Broader = better score
  bicepThickness: number,       // Arm development
  chestToHipRatio: number,     // Upper body proportions  
  torsoLength: number,         // Body proportions
  legProportions: number,      // Thigh/calf development
  posture: number,             // Spine alignment
  symmetry: number             // Left/right balance
}
```

### **Scoring Formula**
```typescript
// Convert raw measurements to 1-10 scale
score = normalize(measurement, minVal, maxVal)
score = applyCurve(score, steepness)
score = applyConfidence(score, poseConfidence)
score = applySymmetry(score, symmetryBonus)
score = clamp(score, 1, 10)
```

### **Rating Categories**
- **9.0-10.0**: Excellent 🟢
- **7.0-8.9**: Good 🔵  
- **5.0-6.9**: Average 🟡
- **3.0-4.9**: Below Average 🟠
- **1.0-2.9**: Needs Work 🔴

## 📁 Project Structure

```
physique-analyzer/
├── app/
│   ├── components/
│   │   ├── PhysiqueAnalyzer.tsx    # Main container
│   │   ├── PhotoUpload.tsx         # File upload & preview
│   │   ├── RatingsDisplay.tsx      # Results visualization
│   │   └── Header.tsx              # App header
│   ├── services/
│   │   └── physiqueAnalyzer.ts     # AI/ML service
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Home page
├── public/                         # Static assets
├── package.json                    # Dependencies
├── tailwind.config.ts             # Tailwind configuration
├── tsconfig.json                  # TypeScript config
└── next.config.ts                 # Next.js config
```

## 🔬 Development

### **Available Scripts**
```bash
npm run dev      # Start development server
npm run build    # Build for production  
npm run start    # Start production server
npm run lint     # Run ESLint
```

### **Key Development Notes**

#### Model Loading Strategy
- **Lazy Loading**: Models load only when user uploads image
- **Caching**: Models persist between analyses in same session
- **Error Handling**: Graceful fallbacks for model loading failures

#### Performance Considerations
- TensorFlow.js models are ~10-20MB total
- First analysis takes 3-5 seconds (model loading)
- Subsequent analyses take 1-2 seconds
- WebGL acceleration provides 2-3x speed improvement

#### Browser Compatibility
- **Chrome/Edge**: Full WebGL support ✅
- **Firefox**: Full support ✅  
- **Safari**: Full support ✅
- **Mobile browsers**: Optimized for performance ✅

## 🚧 Future Enhancements

### **Planned Features**
- [ ] **Body segmentation** for muscle definition analysis
- [ ] **Multi-pose support** for before/after comparisons
- [ ] **Progress tracking** with photo history
- [ ] **Custom scoring profiles** for different fitness goals
- [ ] **3D pose estimation** for depth analysis
- [ ] **Workout recommendations** based on weak areas

### **Technical Improvements**
- [ ] **WebWorker integration** for background processing
- [ ] **Progressive Web App** features
- [ ] **Offline support** with cached models
- [ ] **Advanced pose visualization** overlays
- [ ] **Batch processing** for multiple photos
## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**Made with ❤️ and 🤖 AI**

*Transform your fitness journey with the power of computer vision and machine learning!*
