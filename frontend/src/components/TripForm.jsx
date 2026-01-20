import { useState } from 'react'

function TripForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    startLocation: '',
    destination: '',
    budget: '',
    days: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.startLocation || !formData.destination || !formData.budget || !formData.days) {
      return
    }
    
    setIsSubmitting(true)
    await onSubmit(formData)
    setIsSubmitting(false)
  }

  return (
    <div className="container" style={{ marginTop: '-4rem', paddingBottom: '4rem' }}>
      <form className="trip-form glass-card" onSubmit={handleSubmit}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.5rem' }}>
          <span className="text-gradient">Plan Your Trip</span>
        </h2>
        
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">📍 Starting From</label>
            <input
              type="text"
              name="startLocation"
              className="form-input"
              placeholder="e.g., Delhi, Mumbai"
              value={formData.startLocation}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">🎯 Destination</label>
            <input
              type="text"
              name="destination"
              className="form-input"
              placeholder="e.g., Goa, Manali"
              value={formData.destination}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">💰 Budget (₹)</label>
            <input
              type="number"
              name="budget"
              className="form-input"
              placeholder="e.g., 30000"
              min="1000"
              value={formData.budget}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">📅 Number of Days</label>
            <input
              type="number"
              name="days"
              className="form-input"
              placeholder="e.g., 5"
              min="1"
              max="30"
              value={formData.days}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary btn-lg btn-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </>
          ) : (
            <>
              ✨ Generate My Travel Plan
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default TripForm
