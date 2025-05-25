'use client'

import { useCallback, useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { AnalysisStatus } from './PhysiqueAnalyzer'

interface PhotoUploadProps {
  onImageUpload: (imageUrl: string, imageElement: HTMLImageElement) => void
  status?: AnalysisStatus
  uploadedImage?: string | null
  currentStep?: string
  onReset: () => void
}

export default function PhotoUpload({ onImageUpload, status = 'idle', uploadedImage, currentStep, onReset }: PhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)

  const handleFile = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      
      // Create an image element to pass to the analysis function
      const img = new (window as any).Image() as HTMLImageElement
      img.onload = () => {
        onImageUpload(url, img)
      }
      img.onerror = () => {
        console.error('Failed to load image')
        // Still call onImageUpload with a placeholder element if image fails to load
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (ctx) {
          canvas.width = 300
          canvas.height = 300
          ctx.fillStyle = '#f0f0f0'
          ctx.fillRect(0, 0, 300, 300)
          ctx.fillStyle = '#888'
          ctx.font = '16px Arial'
          ctx.textAlign = 'center'
          ctx.fillText('Image Load Error', 150, 150)
        }
        const placeholderImg = new (window as any).Image() as HTMLImageElement
        placeholderImg.src = canvas.toDataURL()
        onImageUpload(url, placeholderImg)
      }
      img.crossOrigin = 'anonymous'
      img.src = url
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
              ref={imageRef}
              src={uploadedImage}
              alt="Uploaded physique photo"
              fill
              className="object-cover opacity-40"
            />
          )}
          
          {/* Analysis Overlay - Show current step from AI service */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-5 h-5">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-blue-500"></div>
              </div>
              <span className="text-white font-medium text-sm whitespace-nowrap drop-shadow-lg">
                {currentStep || 'Processing...'}
              </span>
            </div>
          </div>
        </div>
      ) : status === 'error' ? (
        // Error state - show image with error overlay
        <div className="relative border-2 border-red-300 dark:border-red-600 rounded-xl overflow-hidden h-64">
          {uploadedImage && (
            <Image
              src={uploadedImage}
              alt="Uploaded physique photo"
              fill
              className="object-cover opacity-30"
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-red-600 dark:text-red-400 text-center">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.855-.833-2.625 0L4.188 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="font-medium">Analysis Failed</p>
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

      {/* Reset button for completed/error state */}
      {(status === 'completed' || status === 'error') && (
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