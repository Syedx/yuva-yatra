function Itinerary({ itinerary, tripData, onBack }) {
  const { flights, hotels, dailyPlan, guides } = itinerary

  return (
    <div className="page itinerary-page">
      <div className="container">
        {/* Back Button */}
        <div className="back-btn" onClick={onBack}>
          ← Back to Home
        </div>

        {/* Header */}
        <header className="itinerary-header">
          <h1>Your Trip to {tripData?.destination}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Here's your AI-powered personalized travel plan
          </p>
          
          <div className="trip-summary">
            <div className="trip-tag">
              <span>📍</span> From {tripData?.startLocation}
            </div>
            <div className="trip-tag">
              <span>💰</span> Budget: ₹{parseInt(tripData?.budget).toLocaleString('en-IN')}
            </div>
            <div className="trip-tag">
              <span>📅</span> {tripData?.days} Days
            </div>
          </div>
        </header>

        {/* Flights Section */}
        <section className="itinerary-section">
          <h2 className="section-title">
            <span>✈️</span> Flight Options
          </h2>
          <div className="booking-cards">
            {flights?.map((flight, index) => (
              <div key={index} className="booking-card">
                <div className="booking-card-header">
                  <div className="booking-logo">✈️</div>
                  <div>
                    <div className="booking-name">{flight.platform}</div>
                    <div className="booking-type">Flight Booking</div>
                  </div>
                </div>
                <p className="booking-details">{flight.description}</p>
                <a 
                  href={flight.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="booking-link"
                >
                  Book Now →
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Hotels Section */}
        <section className="itinerary-section">
          <h2 className="section-title">
            <span>🏨</span> Stay Options
          </h2>
          <div className="booking-cards">
            {hotels?.map((hotel, index) => (
              <div key={index} className="booking-card">
                <div className="booking-card-header">
                  <div className="booking-logo">🏨</div>
                  <div>
                    <div className="booking-name">{hotel.platform}</div>
                    <div className="booking-type">Accommodation</div>
                  </div>
                </div>
                <p className="booking-details">{hotel.description}</p>
                <a 
                  href={hotel.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="booking-link"
                >
                  View Hotels →
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Daily Itinerary */}
        <section className="itinerary-section">
          <h2 className="section-title">
            <span>🗓️</span> Day-by-Day Plan
          </h2>
          <div className="day-cards">
            {dailyPlan?.map((day, index) => (
              <div key={index} className="day-card">
                <div className="day-header">
                  <div className="day-number">{index + 1}</div>
                  <h3 className="day-title">{day.title}</h3>
                </div>
                <div className="day-activities">
                  <ul>
                    {day.activities?.map((activity, actIndex) => (
                      <li key={actIndex}>{activity}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Local Guides Section */}
        <section className="itinerary-section">
          <h2 className="section-title">
            <span>🧭</span> Local Guides & Tour Organizations
          </h2>
          <div className="booking-cards">
            {guides?.map((guide, index) => (
              <div key={index} className="guide-card">
                <div className="guide-avatar">🧑‍🦱</div>
                <div className="guide-info">
                  <div className="guide-name">{guide.name}</div>
                  <div className="guide-specialty">{guide.specialty}</div>
                  <div className="guide-contact">
                    {guide.phone && (
                      <span className="contact-item">
                        <span>📞</span> {guide.phone}
                      </span>
                    )}
                    {guide.email && (
                      <span className="contact-item">
                        <span>✉️</span> {guide.email}
                      </span>
                    )}
                    {guide.website && (
                      <a 
                        href={guide.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="contact-item"
                        style={{ color: 'var(--primary)' }}
                      >
                        <span>🌐</span> Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
          <p>Made with ❤️ by Yuva Yatra • AI-Powered Travel Planning</p>
          <button 
            className="btn btn-primary" 
            onClick={onBack}
            style={{ marginTop: '1.5rem' }}
          >
            Plan Another Trip
          </button>
        </footer>
      </div>
    </div>
  )
}

export default Itinerary
