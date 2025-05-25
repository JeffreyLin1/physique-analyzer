'use client'

import { useState, useEffect } from 'react'
import Header from './Header'
import PhotoUpload from './PhotoUpload'
import RatingsDisplay from './RatingsDisplay'
import { physiqueAnalyzer, PhysiqueMetrics, AnalysisStep } from '../services/physiqueAnalyzer'

export type AnalysisStatus = 'idle' | 'analyzing' | 'completed' | 'error' | 'initializing'

export interface PhysiqueRatings {
  biceps: number
  shoulders: number
  chest: number
  back: number
  legs: number
  core: number
  overall: number
}

export default function PhysiqueAnalyzer() {
  const [status, setStatus] = useState<AnalysisStatus>('idle')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [ratings, setRatings] = useState<PhysiqueRatings>({
    biceps: 0,
    shoulders: 0,
    chest: 0,
    back: 0,
    legs: 0,
    core: 0,
    overall: 0
  })

  const handleImageUpload = async (imageUrl: string, imageElement: HTMLImageElement) => {
    setUploadedImage(imageUrl)
    setStatus('initializing')
    setError(null)
    
    try {
      // Initialize AI models when user uploads image
      await physiqueAnalyzer.initialize((step: AnalysisStep) => {
        setCurrentStep(step.step)
      })
      
      // Now analyze the image
      setStatus('analyzing')
      const metrics: PhysiqueMetrics = await physiqueAnalyzer.analyzePhysique(
        imageElement,
        (step: AnalysisStep) => {
          setCurrentStep(step.step)
        }
      )
      
      setRatings(metrics)
      setStatus('completed')
      setCurrentStep('')
    } catch (error) {
      console.error('Analysis failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed'
      setError(errorMessage)
      setStatus('error')
      setCurrentStep('')
    }
  }

  const handleReset = () => {
    setStatus('idle')
    setUploadedImage(null)
    setError(null)
    setCurrentStep('')
    setRatings({
      biceps: 0,
      shoulders: 0,
      chest: 0,
      back: 0,
      legs: 0,
      core: 0,
      overall: 0
    })
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Analysis Error
                  </h3>
                  <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                    {error}
                  </p>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    onClick={handleReset}
                    className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Initialization Status */}
          {status === 'initializing' && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
                Initializing AI Models
              </h3>
              <p className="text-blue-700 dark:text-blue-300">
                {currentStep || 'Loading...'}
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                Loading models for the first time...
              </p>
            </div>
          )}

          {/* Upload Section - Top */}
          <PhotoUpload 
            onImageUpload={handleImageUpload} 
            status={status}
            uploadedImage={uploadedImage}
            currentStep={currentStep}
            onReset={handleReset}
          />

          {/* Ratings Section - Bottom */}
          <RatingsDisplay 
            ratings={ratings}
            status={status}
            onReset={handleReset}
          />

        </div>
      </main>
    </div>
  )
} 