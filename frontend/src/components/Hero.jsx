function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        {/* Logo */}
        <div className="hero-logo">
          <img src="/logo.png" alt="Yuva Yatra Logo" />
        </div>
        
        <div className="hero-badge">
          <span>✨</span>
          AI-Powered Travel Planning
        </div>
        
        <h1>Your Adventure Awaits</h1>
        
        <p className="hero-subtitle">
          From Inputs to Itineraries — Plan your dream vacation in minutes. 
          Tell us where you want to go, your budget, and how long you want to explore!
        </p>
      </div>
    </section>
  )
}

export default Hero
