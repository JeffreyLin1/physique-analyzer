'use client'

import { useEffect, useState } from 'react'
import { PhysiqueRatings, AnalysisStatus } from './PhysiqueAnalyzer'

interface RatingsDisplayProps {
  ratings: PhysiqueRatings
  status: AnalysisStatus
  onReset: () => void
}

interface MuscleGroupInfo {
  name: string
  key: keyof PhysiqueRatings
  color: string
  icon: string
}

export default function RatingsDisplay({ ratings, status, onReset }: RatingsDisplayProps) {
  const [displayRatings, setDisplayRatings] = useState<PhysiqueRatings>({
    biceps: 0,
    shoulders: 0,
    chest: 0,
    back: 0,
    legs: 0,
    core: 0,
    overall: 0
  })

  const muscleGroups: MuscleGroupInfo[] = [
    { name: 'Biceps', key: 'biceps', color: 'from-purple-500 to-purple-600', icon: '💪' },
    { name: 'Shoulders', key: 'shoulders', color: 'from-green-500 to-green-600', icon: '🏔️' },
    { name: 'Chest', key: 'chest', color: 'from-red-500 to-red-600', icon: '🎯' },
    { name: 'Back', key: 'back', color: 'from-orange-500 to-orange-600', icon: '🗻' },
    { name: 'Legs', key: 'legs', color: 'from-yellow-500 to-yellow-600', icon: '🦵' },
    { name: 'Core', key: 'core', color: 'from-pink-500 to-pink-600', icon: '⚡' }
  ]

  // Animate ratings when status changes to completed
  useEffect(() => {
    if (status === 'completed') {
      const duration = 2000 // 2 seconds
      const steps = 60 // 60 frames
      const stepDuration = duration / steps

      let currentStep = 0
      const interval = setInterval(() => {
        currentStep++
        const progress = currentStep / steps

        setDisplayRatings({
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
          setDisplayRatings(ratings)
        }
      }, stepDuration)

      return () => clearInterval(interval)
    } else {
      // Reset to 0 when not completed
      setDisplayRatings({
        biceps: 0,
        shoulders: 0,
        chest: 0,
        back: 0,
        legs: 0,
        core: 0,
        overall: 0
      })
    }
  }, [ratings, status])

  const getRatingText = (rating: number, currentStatus: AnalysisStatus) => {
    if (currentStatus !== 'completed') return 'Awaiting Analysis'
    if (rating >= 9) return 'Excellent'
    if (rating >= 7) return 'Good'
    if (rating >= 5) return 'Average'
    if (rating >= 3) return 'Below Average'
    return 'Needs Work'
  }

  const getRatingColor = (rating: number, currentStatus: AnalysisStatus) => {
    if (currentStatus !== 'completed') return 'text-gray-500 dark:text-gray-400'
    if (rating >= 9) return 'text-green-600 dark:text-green-400'
    if (rating >= 7) return 'text-blue-600 dark:text-blue-400'
    if (rating >= 5) return 'text-yellow-600 dark:text-yellow-400'
    if (rating >= 3) return 'text-orange-600 dark:text-orange-400'
    return 'text-red-600 dark:text-red-400'
  }

  const formatRating = (rating: number, currentStatus: AnalysisStatus) => {
    if (currentStatus !== 'completed') return '-'
    return rating.toFixed(1)
  }

  return (
    <div className="space-y-6">
      {/* Combined Ratings - Overall Score + Detailed Ratings */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        {/* Overall Score Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 text-center">
            Overall Score
          </h2>
          <div className="flex items-center justify-center mb-4">
            {/* Overall Score Circular Progress */}
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - (status === 'completed' ? displayRatings.overall / 10 : 0))}`}
                  className="text-blue-500 transition-all duration-2000 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatRating(displayRatings.overall, status)}
                  </div>
                  <div className="text-sm text-gray-400">/10</div>
                </div>
              </div>
            </div>
          </div>
          <p className={`text-lg font-medium text-center ${getRatingColor(displayRatings.overall, status)}`}>
            {getRatingText(displayRatings.overall, status)}
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {muscleGroups.map((group) => {
            const rating = displayRatings[group.key]
            const progressPercentage = status === 'completed' ? (rating / 10) * 100 : 0
            
            return (
              <div key={group.key} className="text-center">
                <div className="flex flex-col items-center space-y-2">
                  {/* Circular Progress Bar */}
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-200 dark:text-gray-600"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 35}`}
                        strokeDashoffset={`${2 * Math.PI * 35 * (1 - progressPercentage / 100)}`}
                        className={`bg-gradient-to-r ${group.color} transition-all duration-2000 ease-out`}
                        strokeLinecap="round"
                        style={{
                          stroke: progressPercentage > 0 ? (
                            rating >= 9 ? '#10b981' :
                            rating >= 7 ? '#3b82f6' :
                            rating >= 5 ? '#f59e0b' :
                            rating >= 3 ? '#f97316' : '#ef4444'
                          ) : 'currentColor'
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl">{group.icon}</span>
                    </div>
                  </div>
                  
                  {/* Label and Score */}
                  <div className="text-center">
                    <h4 className="font-medium text-gray-900 dark:text-white text-lg mb-1">
                      {group.name}
                    </h4>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatRating(rating, status)}<span className="text-lg text-gray-500 dark:text-gray-400">/10</span>
                    </div>
                    <p className={`text-base font-medium ${getRatingColor(rating, status)}`}>
                      {getRatingText(rating, status)}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Action Buttons - Only show when completed */}
      {status === 'completed' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onReset}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm"
            >
              Analyze Another Photo
            </button>
            
            <button
              onClick={() => {
                console.log('Download report clicked')
              }}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-sm"
            >
              Download Report
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 