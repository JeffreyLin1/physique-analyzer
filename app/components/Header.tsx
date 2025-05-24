export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Physique Analyzer
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              AI-powered physique assessment and rating system
            </p>
          </div>
        </div>
      </div>
    </header>
  )
} 