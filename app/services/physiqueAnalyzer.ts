import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-backend-webgl'
import '@tensorflow/tfjs-backend-cpu'
import { PoseDetector, createDetector, SupportedModels as PoseSupportedModels } from '@tensorflow-models/pose-detection'

export interface PhysiqueMetrics {
  biceps: number
  shoulders: number
  chest: number
  back: number
  legs: number
  core: number
  overall: number
}

export interface AnalysisStep {
  step: string
  progress: number
}

export class PhysiqueAnalyzerService {
  private poseDetector: PoseDetector | null = null
  private isInitialized = false
  
  async initialize(onProgress?: (step: AnalysisStep) => void): Promise<void> {
    if (this.isInitialized) return

    try {
      onProgress?.({ step: 'Initializing TensorFlow.js...', progress: 10 })
      console.log('Starting TensorFlow.js initialization...')
      await tf.ready()
      console.log('TensorFlow.js ready')

      onProgress?.({ step: 'Loading pose detection model...', progress: 30 })
      console.log('Creating pose detector...')
      
      // Try to create the pose detector with error handling
      this.poseDetector = await createDetector(PoseSupportedModels.MoveNet, {
        modelType: 'SinglePose.Thunder'
      })
      console.log('Pose detector created successfully')

      onProgress?.({ step: 'Models loaded successfully!', progress: 100 })
      this.isInitialized = true
      console.log('Initialization completed successfully')
    } catch (error) {
      console.error('Detailed initialization error:', error)
      console.error('Error stack:', (error as Error).stack)
      this.isInitialized = false
      throw new Error(`Failed to initialize AI models: ${(error as Error).message}`)
    }
  }

  async analyzePhysique(
    imageElement: HTMLImageElement,
    onProgress?: (step: AnalysisStep) => void
  ): Promise<PhysiqueMetrics> {
    console.log('analyzePhysique called')
    console.log('isInitialized:', this.isInitialized)
    console.log('poseDetector:', this.poseDetector)
    
    if (!this.isInitialized || !this.poseDetector) {
      console.error('Analyzer not initialized - isInitialized:', this.isInitialized, 'poseDetector:', this.poseDetector)
      throw new Error('Analyzer not initialized')
    }

    try {
      onProgress?.({ step: 'Detecting pose keypoints...', progress: 20 })
      console.log('Starting pose estimation...')
      const poses = await this.poseDetector.estimatePoses(imageElement)
      console.log('Poses detected:', poses.length)
      
      if (poses.length === 0) {
        throw new Error('No person detected in the image')
      }

      onProgress?.({ step: 'Extracting measurements...', progress: 70 })
      const features = this.extractFeatures(poses[0], imageElement)

      onProgress?.({ step: 'Computing scores...', progress: 90 })
      const metrics = this.computeScores(features)

      onProgress?.({ step: 'Analysis complete!', progress: 100 })
      return metrics
    } catch (error) {
      console.error('Analysis failed:', error)
      throw new Error('Failed to analyze physique')
    }
  }

  private extractFeatures(pose: any, image: HTMLImageElement) {
    const keypoints = pose.keypoints
    const { width, height } = image

    // Helper function to get keypoint coordinates
    const getKeypoint = (name: string) => {
      const kp = keypoints.find((k: any) => k.name === name)
      return kp ? { x: kp.x / width, y: kp.y / height, confidence: kp.score } : null
    }

    // Extract key body landmarks
    const leftShoulder = getKeypoint('left_shoulder')
    const rightShoulder = getKeypoint('right_shoulder')
    const leftElbow = getKeypoint('left_elbow')
    const rightElbow = getKeypoint('right_elbow')
    const leftWrist = getKeypoint('left_wrist')
    const rightWrist = getKeypoint('right_wrist')
    const leftHip = getKeypoint('left_hip')
    const rightHip = getKeypoint('right_hip')
    const leftKnee = getKeypoint('left_knee')
    const rightKnee = getKeypoint('right_knee')
    const leftAnkle = getKeypoint('left_ankle')
    const rightAnkle = getKeypoint('right_ankle')
    const nose = getKeypoint('nose')

    // Calculate distances and ratios
    const features = {
      // Shoulder width (broader = better score)
      shoulderWidth: this.calculateDistance(leftShoulder, rightShoulder),
      
      // Bicep development (upper arm thickness estimation)
      leftArmThickness: this.calculateDistance(leftShoulder, leftElbow),
      rightArmThickness: this.calculateDistance(rightShoulder, rightElbow),
      
      // Chest development (shoulder to hip ratio)
      chestToHipRatio: this.calculateDistance(leftShoulder, rightShoulder) / 
                       this.calculateDistance(leftHip, rightHip),
      
      // Core/waist (hip width)
      hipWidth: this.calculateDistance(leftHip, rightHip),
      
      // Leg development
      leftThighLength: this.calculateDistance(leftHip, leftKnee),
      rightThighLength: this.calculateDistance(rightHip, rightKnee),
      leftCalfLength: this.calculateDistance(leftKnee, leftAnkle),
      rightCalfLength: this.calculateDistance(rightKnee, rightAnkle),
      
      // Body proportions
      torsoLength: this.calculateDistance(
        { 
          x: ((leftShoulder?.x || 0) + (rightShoulder?.x || 0)) / 2, 
          y: ((leftShoulder?.y || 0) + (rightShoulder?.y || 0)) / 2 
        },
        { 
          x: ((leftHip?.x || 0) + (rightHip?.x || 0)) / 2, 
          y: ((leftHip?.y || 0) + (rightHip?.y || 0)) / 2 
        }
      ),
      
      // Symmetry measures
      shoulderSymmetry: 1 - Math.abs((leftShoulder?.y || 0) - (rightShoulder?.y || 0)),
      hipSymmetry: 1 - Math.abs((leftHip?.y || 0) - (rightHip?.y || 0)),
      
      // Posture
      posture: this.calculatePosture(nose, leftShoulder, rightShoulder, leftHip, rightHip),
      
      // Confidence scores
      averageConfidence: keypoints.reduce((sum: number, kp: any) => sum + kp.score, 0) / keypoints.length
    }

    return features
  }

  private calculateDistance(point1: any, point2: any): number {
    if (!point1 || !point2) return 0
    const dx = point1.x - point2.x
    const dy = point1.y - point2.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  private calculatePosture(nose: any, leftShoulder: any, rightShoulder: any, leftHip: any, rightHip: any): number {
    if (!nose || !leftShoulder || !rightShoulder || !leftHip || !rightHip) return 0.5

    // Calculate if shoulders are level
    const shoulderLevel = 1 - Math.abs(leftShoulder.y - rightShoulder.y)
    
    // Calculate if hips are level
    const hipLevel = 1 - Math.abs(leftHip.y - rightHip.y)
    
    // Calculate spine alignment (nose to center of hips)
    const shoulderCenter = { x: (leftShoulder.x + rightShoulder.x) / 2, y: (leftShoulder.y + rightShoulder.y) / 2 }
    const hipCenter = { x: (leftHip.x + rightHip.x) / 2, y: (leftHip.y + rightHip.y) / 2 }
    const spineAlignment = 1 - Math.abs(nose.x - hipCenter.x)

    return (shoulderLevel + hipLevel + spineAlignment) / 3
  }

  private computeScores(features: any): PhysiqueMetrics {
    // Scoring functions that convert raw measurements to 1-10 scale
    // These are simplified heuristics - in a real app you'd use training data
    
    const bicepsScore = this.scoreFeature(
      (features.leftArmThickness + features.rightArmThickness) / 2,
      0.1, 0.3, // min/max expected values
      1.5 // curve steepness
    )

    const shouldersScore = this.scoreFeature(
      features.shoulderWidth,
      0.15, 0.4,
      1.2
    )

    const chestScore = this.scoreFeature(
      features.chestToHipRatio,
      1.1, 1.6,
      1.3
    )

    // Back score based on posture and shoulder development
    const backScore = (this.scoreFeature(features.posture, 0.5, 1.0, 2.0) + shouldersScore) / 2

    const legsScore = this.scoreFeature(
      (features.leftThighLength + features.rightThighLength + features.leftCalfLength + features.rightCalfLength) / 4,
      0.2, 0.5,
      1.4
    )

    // Core score based on waist to shoulder ratio (smaller waist = better)
    const coreScore = this.scoreFeature(
      1 / (features.hipWidth / features.shoulderWidth), // Inverted for smaller waist
      1.1, 2.0,
      1.3
    )

    // Apply confidence and symmetry modifiers
    const confidenceMultiplier = Math.max(0.7, features.averageConfidence)
    const symmetryBonus = (features.shoulderSymmetry + features.hipSymmetry) / 2

    const scores = {
      biceps: Math.max(1, Math.min(10, bicepsScore * confidenceMultiplier * (0.8 + symmetryBonus * 0.2))),
      shoulders: Math.max(1, Math.min(10, shouldersScore * confidenceMultiplier * (0.8 + symmetryBonus * 0.2))),
      chest: Math.max(1, Math.min(10, chestScore * confidenceMultiplier)),
      back: Math.max(1, Math.min(10, backScore * confidenceMultiplier)),
      legs: Math.max(1, Math.min(10, legsScore * confidenceMultiplier)),
      core: Math.max(1, Math.min(10, coreScore * confidenceMultiplier))
    }

    const overall = (scores.biceps + scores.shoulders + scores.chest + scores.back + scores.legs + scores.core) / 6

    return {
      ...scores,
      overall: Math.max(1, Math.min(10, overall))
    }
  }

  private scoreFeature(value: number, minVal: number, maxVal: number, curveSteepness: number = 1): number {
    // Normalize to 0-1 range
    const normalized = Math.max(0, Math.min(1, (value - minVal) / (maxVal - minVal)))
    
    // Apply curve for more realistic scoring (S-curve)
    const curved = Math.pow(normalized, curveSteepness)
    
    // Convert to 1-10 scale
    return 1 + (curved * 9)
  }
}

// Singleton instance
export const physiqueAnalyzer = new PhysiqueAnalyzerService() 