'use client'

import { useCallback, useState, useEffect } from 'react'
import Image from 'next/image'
import { AnalysisStatus } from './PhysiqueAnalyzer'

interface PhotoUploadProps {
  onImageUpload: (imageUrl: string) => void
  status?: AnalysisStatus
  uploadedImage?: string | null
  onReset: () => void
}

export default function PhotoUpload({ onImageUpload, status = 'idle', uploadedImage, onReset }: PhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const analysisSteps = [
    'Loading image...',
    'Initializing AI models...',
    'Detecting muscle groups...',
    'Analyzing proportions...',
    'Computing ratings...',
    'Finalizing assessment...'
  ]

  // Handle analysis steps animation
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
      setCurrentStep(analysisSteps.length)
    } else {
      setCurrentStep(0)
    }
  }, [status, analysisSteps.length])

  const handleFile = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      onImageUpload(url)
    }
  }, [onImageUpload])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (status === 'idle') {
      setIsDragging(true)
    }
  }, [status])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (status === 'idle') {
      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        handleFile(files[0])
      }
    }
  }, [handleFile, status])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }, [handleFile])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Upload Photo
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Upload your physique photo for AI analysis
        </p>
      </div>

      {status === 'idle' ? (
        <div
          className={`
            relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300
            ${isDragging 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="space-y-3">
            <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <svg 
                className="w-6 h-6 text-blue-600 dark:text-blue-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                />
              </svg>
            </div>
            
            <div>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Drop photo here
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                or click to browse
              </p>
            </div>
            
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Choose Photo
            </button>
          </div>
        </div>
      ) : status === 'analyzing' ? (
        // Full image with analysis overlay
        <div className="relative border-2 border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden h-64">
          {/* Background Image */}
          {uploadedImage && (
            <Image
              src={uploadedImage}
              alt="Uploaded physique photo"
              fill
              className="object-cover opacity-40"
            />
          )}
          
          {/* Analysis Overlay - Single Step Display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-5 h-5">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-blue-500"></div>
              </div>
              <span className="text-white font-medium text-sm whitespace-nowrap drop-shadow-lg">
                {analysisSteps[currentStep]}
              </span>
            </div>
          </div>
        </div>
      ) : (
        // Completed state - Just show the image
        <div className="flex justify-center">
          {uploadedImage && (
            <div className="relative rounded-xl overflow-hidden shadow-lg max-w-sm">
              <Image
                src={uploadedImage}
                alt="Uploaded physique photo"
                width={300}
                height={300}
                className="w-full h-48 object-cover"
              />
            </div>
          )}
        </div>
      )}

      {/* Reset button for completed state */}
      {status === 'completed' && (
        <div className="mt-4 text-center">
          <button
            onClick={onReset}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200 text-sm"
          >
            Upload New Photo
          </button>
        </div>
      )}
    </div>
  )
} 