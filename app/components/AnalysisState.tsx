'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { AnalysisStatus } from './PhysiqueAnalyzer'

interface AnalysisStateProps {
  uploadedImage: string | null
  status: AnalysisStatus
}

export default function AnalysisState({ uploadedImage, status }: AnalysisStateProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const analysisSteps = [
    'Loading image...',
    'Initializing AI models...',
    'Detecting muscle groups...',
    'Analyzing proportions...',
    'Computing ratings...',
    'Finalizing assessment...'
  ]

  useEffect(() => {
    if (status === 'analyzing') {
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < analysisSteps.length - 1) {
            return prev + 1
          }
          return 0 // Reset to create continuous cycle
        })
      }, 500)

      return () => clearInterval(interval)
    } else if (status === 'completed') {
      // Set all steps as completed
      setCurrentStep(analysisSteps.length)
    }
  }, [analysisSteps.length, status])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          {status === 'analyzing' ? 'Analyzing Your Physique' : 'Analysis Complete'}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {status === 'analyzing' 
            ? 'Please wait while our AI analyzes your photo...' 
            : 'Analysis completed successfully!'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Uploaded Image Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Uploaded Photo
          </h3>
          {uploadedImage && (
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              <Image
                src={uploadedImage}
                alt="Uploaded physique photo"
                width={400}
                height={500}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                <div className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Analysis Progress */}
        <div className="space-y-4">
          {status === 'analyzing' && (
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                    AI
                  </div>
                </div>
              </div>
            </div>
          )}

          {status === 'completed' && (
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="rounded-full h-16 w-16 border-4 border-green-500 bg-green-500 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Progress Steps */}
          <div className="space-y-2">
            {analysisSteps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-300 ${
                  status === 'completed' || index === currentStep
                    ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700'
                    : index < currentStep
                    ? 'bg-green-50 dark:bg-green-900/30'
                    : 'bg-gray-50 dark:bg-gray-700'
                }`}
              >
                <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                  status === 'completed' || index < currentStep
                    ? 'bg-green-500'
                    : index === currentStep && status === 'analyzing'
                    ? 'bg-blue-500 animate-pulse'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  {status === 'completed' || index < currentStep ? (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : index === currentStep && status === 'analyzing' ? (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  ) : (
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                )}
                </div>
                <span className={`text-sm font-medium ${
                  status === 'completed' || index === currentStep
                    ? 'text-blue-700 dark:text-blue-300'
                    : index < currentStep
                    ? 'text-green-700 dark:text-green-300'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {step}
                </span>
              </div>
            ))}
          </div>

          {/* Estimated Time - only show when analyzing */}
          {status === 'analyzing' && (
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Estimated time:</span> 2-3 seconds
              </p>
            </div>
          )}

          {/* Completion message */}
          {status === 'completed' && (
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700">
              <p className="text-sm text-green-700 dark:text-green-300">
                <span className="font-medium">✅ Analysis completed!</span> Check your results below.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 