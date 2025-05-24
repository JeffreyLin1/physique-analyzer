'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { PhysiqueRatings } from './PhysiqueAnalyzer'

interface ResultsDisplayProps {
  ratings: PhysiqueRatings
  uploadedImage: string | null
  onReset: () => void
  isCompact?: boolean
  showFullDetails?: boolean
}

interface MuscleGroupInfo {
  name: string
  key: keyof PhysiqueRatings
  color: string
  icon: string
}

export default function ResultsDisplay({ 
  ratings, 
  uploadedImage, 
  onReset, 
  isCompact = false,
  showFullDetails = false 
}: ResultsDisplayProps) {
  const [animatedRatings, setAnimatedRatings] = useState<PhysiqueRatings>({
    biceps: 0,
    shoulders: 0,
    chest: 0,
    back: 0,
    legs: 0,
    core: 0,
    overall: 0
  })

  const muscleGroups: MuscleGroupInfo[] = [
    { name: 'Biceps', key: 'biceps', color: 'bg-blue-500', icon: '💪' },
    { name: 'Shoulders', key: 'shoulders', color: 'bg-green-500', icon: '🏔️' },
    { name: 'Chest', key: 'chest', color: 'bg-purple-500', icon: '🎯' },
    { name: 'Back', key: 'back', color: 'bg-red-500', icon: '🗻' },
    { name: 'Legs', key: 'legs', color: 'bg-yellow-500', icon: '🦵' },
    { name: 'Core', key: 'core', color: 'bg-pink-500', icon: '⚡' }
  ]

  // Animate ratings on mount
  useEffect(() => {
    const duration = 2000 // 2 seconds
    const steps = 60 // 60 frames
    const stepDuration = duration / steps

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      setAnimatedRatings({
        biceps: Math.round(ratings.biceps * progress * 10) / 10,
        shoulders: Math.round(ratings.shoulders * progress * 10) / 10,
        chest: Math.round(ratings.chest * progress * 10) / 10,
        back: Math.round(ratings.back * progress * 10) / 10,
        legs: Math.round(ratings.legs * progress * 10) / 10,
        core: Math.round(ratings.core * progress * 10) / 10,
        overall: Math.round(ratings.overall * progress * 10) / 10
      })

      if (currentStep >= steps) {
        clearInterval(interval)
        setAnimatedRatings(ratings)
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [ratings])

  const getRatingText = (rating: number) => {
    if (rating >= 9) return 'Excellent'
    if (rating >= 7) return 'Good'
    if (rating >= 5) return 'Average'
    if (rating >= 3) return 'Below Average'
    return 'Needs Work'
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 9) return 'text-green-600 dark:text-green-400'
    if (rating >= 7) return 'text-blue-600 dark:text-blue-400'
    if (rating >= 5) return 'text-yellow-600 dark:text-yellow-400'
    if (rating >= 3) return 'text-orange-600 dark:text-orange-400'
    return 'text-red-600 dark:text-red-400'
  }

  // Compact view for side panel
  if (isCompact && !showFullDetails) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Quick Results
          </h3>
          
          {/* Overall Score */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700 mb-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Overall Score</p>
              <div className="flex items-center justify-center space-x-2">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {animatedRatings.overall.toFixed(1)}
                </div>
                <div className="text-lg text-gray-400">/</div>
                <div className="text-lg font-semibold text-gray-600 dark:text-gray-300">10</div>
              </div>
              <p className={`text-sm font-medium ${getRatingColor(animatedRatings.overall)}`}>
                {getRatingText(animatedRatings.overall)}
              </p>
            </div>
          </div>
        </div>

        {/* Compact Ratings */}
        <div className="space-y-3">
          {muscleGroups.slice(0, 3).map((group) => {
            const rating = animatedRatings[group.key]
            const percentage = (rating / 10) * 100

            return (
              <div key={group.key} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{group.icon}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {group.name}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {rating.toFixed(1)}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-1000 ease-out ${group.color}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            )
          })}
          
          <div className="text-center pt-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              + {muscleGroups.length - 3} more detailed ratings below
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Full details view - only show if showFullDetails is true
  if (!showFullDetails) {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Detailed Analysis Results
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Here's your comprehensive physique assessment
          </p>
        </div>

        {/* Overall Score */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Overall Score
            </h3>
            <div className="flex items-center justify-center space-x-4">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {animatedRatings.overall.toFixed(1)}
              </div>
              <div className="text-2xl text-gray-400">/</div>
              <div className="text-2xl font-semibold text-gray-600 dark:text-gray-300">10</div>
            </div>
            <p className={`text-lg font-medium mt-2 ${getRatingColor(animatedRatings.overall)}`}>
              {getRatingText(animatedRatings.overall)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Photo Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Analyzed Photo
          </h3>
          {uploadedImage && (
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              <Image
                src={uploadedImage}
                alt="Analyzed physique photo"
                width={400}
                height={500}
                className="w-full h-auto object-cover"
              />
            </div>
          )}
        </div>

        {/* Detailed Ratings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Muscle Group Ratings
          </h3>
          
          <div className="space-y-4">
            {muscleGroups.map((group) => {
              const rating = animatedRatings[group.key]
              const percentage = (rating / 10) * 100

              return (
                <div key={group.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{group.icon}</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {group.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-900 dark:text-white">
                        {rating.toFixed(1)}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">/10</span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-1000 ease-out ${group.color}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  
                  <p className={`text-sm font-medium ${getRatingColor(rating)}`}>
                    {getRatingText(rating)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onReset}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Analyze Another Photo
          </button>
          
          <button
            onClick={() => {
              // Mock download functionality - could implement PDF export
              console.log('Download report clicked')
            }}
            className="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Download Report
          </button>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Improvement Recommendations
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {muscleGroups
            .filter(group => animatedRatings[group.key] < 7)
            .slice(0, 4)
            .map((group) => (
              <div key={group.key} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl">{group.icon}</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {group.name}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Focus on targeted exercises to improve your {group.name.toLowerCase()} development.
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
} 