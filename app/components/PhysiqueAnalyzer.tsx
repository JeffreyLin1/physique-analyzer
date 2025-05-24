'use client'

import { useState } from 'react'
import Header from './Header'
import PhotoUpload from './PhotoUpload'
import RatingsDisplay from './RatingsDisplay'

export type AnalysisStatus = 'idle' | 'analyzing' | 'completed'

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
  const [ratings, setRatings] = useState<PhysiqueRatings>({
    biceps: 0,
    shoulders: 0,
    chest: 0,
    back: 0,
    legs: 0,
    core: 0,
    overall: 0
  })

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl)
    setStatus('analyzing')
    
    // Mock analysis delay - in real implementation this would call TensorFlow analysis
    setTimeout(() => {
      // Mock ratings for demonstration
      const mockRatings: PhysiqueRatings = {
        biceps: Math.floor(Math.random() * 10) + 1,
        shoulders: Math.floor(Math.random() * 10) + 1,
        chest: Math.floor(Math.random() * 10) + 1,
        back: Math.floor(Math.random() * 10) + 1,
        legs: Math.floor(Math.random() * 10) + 1,
        core: Math.floor(Math.random() * 10) + 1,
        overall: 0
      }
      
      // Calculate overall as average
      const total = mockRatings.biceps + mockRatings.shoulders + mockRatings.chest + 
                   mockRatings.back + mockRatings.legs + mockRatings.core
      mockRatings.overall = Math.round((total / 6) * 10) / 10
      
      setRatings(mockRatings)
      setStatus('completed')
    }, 3000)
  }

  const handleReset = () => {
    setStatus('idle')
    setUploadedImage(null)
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
          
          {/* Upload Section - Top */}
          <PhotoUpload 
            onImageUpload={handleImageUpload} 
            status={status}
            uploadedImage={uploadedImage}
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