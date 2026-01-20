function LoadingAnimation({ destination }) {
  const tips = [
    "Finding the best flight deals...",
    "Searching for cozy accommodations...",
    "Discovering hidden gems...",
    "Planning exciting activities...",
    "Connecting you with local guides..."
  ]

  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      
      <h2 className="loading-text">
        Planning your trip to {destination || 'paradise'}
      </h2>
      
      <p className="loading-subtext">
        Our AI is crafting the perfect itinerary for you
        <span className="loading-dots" style={{ marginLeft: '8px' }}>
          <span></span>
          <span></span>
          <span></span>
        </span>
      </p>
      
      <div style={{ 
        marginTop: '3rem', 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'center',
        gap: '1rem',
        maxWidth: '500px'
      }}>
        {['✈️', '🏨', '🗺️', '🎒', '📸'].map((emoji, index) => (
          <span
            key={index}
            style={{
              fontSize: '2rem',
              animation: `bounce 2s ease-in-out infinite`,
              animationDelay: `${index * 0.2}s`
            }}
          >
            {emoji}
          </span>
        ))}
      </div>
    </div>
  )
}

export default LoadingAnimation
