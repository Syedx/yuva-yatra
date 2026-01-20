import { useState } from 'react'
import Hero from './components/Hero'
import TripForm from './components/TripForm'
import LoadingAnimation from './components/LoadingAnimation'
import Itinerary from './components/Itinerary'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [tripData, setTripData] = useState(null)
  const [itinerary, setItinerary] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (formData) => {
    setTripData(formData)
    setIsLoading(true)
    setCurrentPage('loading')
    setError(null)

    try {
      const response = await fetch('/api/plan-trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to generate itinerary')
      }

      const data = await response.json()
      setItinerary(data)
      setCurrentPage('results')
    } catch (err) {
      console.error('Error:', err)
      setError(err.message)
      setCurrentPage('error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    setCurrentPage('home')
    setItinerary(null)
    setError(null)
  }

  const handleRetry = () => {
    if (tripData) {
      handleSubmit(tripData)
    } else {
      handleBack()
    }
  }

  return (
    <>
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* Main Content */}
      {currentPage === 'home' && (
        <div className="page">
          <Hero />
          <TripForm onSubmit={handleSubmit} />
        </div>
      )}

      {currentPage === 'loading' && (
        <LoadingAnimation destination={tripData?.destination} />
      )}

      {currentPage === 'results' && itinerary && (
        <Itinerary 
          itinerary={itinerary} 
          tripData={tripData}
          onBack={handleBack} 
        />
      )}

      {currentPage === 'error' && (
        <div className="error-container">
          <div className="error-icon">😞</div>
          <h2 className="error-title">Oops! Something went wrong</h2>
          <p className="error-message">
            {error || "We couldn't generate your travel plan. Please try again."}
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={handleRetry}>
              Try Again
            </button>
            <button className="btn btn-primary" onClick={handleBack} style={{ background: 'var(--bg-glass)' }}>
              Go Back
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default App
