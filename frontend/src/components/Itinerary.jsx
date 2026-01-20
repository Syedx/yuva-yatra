import { jsPDF } from 'jspdf'

function Itinerary({ itinerary, tripData, onBack }) {
  const { flights, hotels, dailyPlan, guides } = itinerary

  // Generate and download PDF
  const downloadPDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    let yPos = 20
    const leftMargin = 20
    const rightMargin = pageWidth - 20
    const lineHeight = 7
    const sectionGap = 15

    // Helper function to add new page if needed
    const checkPageBreak = (requiredSpace = 30) => {
      if (yPos + requiredSpace > pageHeight - 20) {
        doc.addPage()
        yPos = 20
        return true
      }
      return false
    }

    // Helper to clean emoji from text for PDF
    const cleanText = (text) => {
      return text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]/gu, '').trim()
    }

    // ===== HEADER =====
    doc.setFillColor(26, 58, 92) // Navy blue
    doc.rect(0, 0, pageWidth, 45, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('YUVA YATRA', pageWidth / 2, 18, { align: 'center' })
    
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('From Inputs to Itineraries', pageWidth / 2, 26, { align: 'center' })
    
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(`Your Trip to ${tripData?.destination}`, pageWidth / 2, 38, { align: 'center' })
    
    yPos = 55

    // ===== TRIP SUMMARY =====
    doc.setTextColor(26, 58, 92)
    doc.setFillColor(245, 166, 35) // Orange accent
    doc.roundedRect(leftMargin, yPos - 5, pageWidth - 40, 25, 3, 3, 'F')
    
    doc.setTextColor(26, 58, 92)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    
    const summaryY = yPos + 5
    doc.text(`From: ${tripData?.startLocation}`, leftMargin + 10, summaryY)
    doc.text(`Budget: Rs. ${parseInt(tripData?.budget).toLocaleString('en-IN')}`, pageWidth / 2 - 20, summaryY)
    doc.text(`Duration: ${tripData?.days} Days`, pageWidth - 60, summaryY)
    
    yPos += 30

    // ===== FLIGHTS SECTION =====
    doc.setTextColor(26, 58, 92)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('FLIGHT OPTIONS', leftMargin, yPos)
    yPos += lineHeight

    doc.setDrawColor(245, 166, 35)
    doc.setLineWidth(0.5)
    doc.line(leftMargin, yPos, rightMargin, yPos)
    yPos += 8

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(60, 60, 60)
    
    flights?.forEach((flight) => {
      checkPageBreak(15)
      doc.setFont('helvetica', 'bold')
      doc.text(`• ${flight.platform}`, leftMargin, yPos)
      yPos += lineHeight - 2
      doc.setFont('helvetica', 'normal')
      const desc = doc.splitTextToSize(cleanText(flight.description), pageWidth - 50)
      doc.text(desc, leftMargin + 5, yPos)
      yPos += desc.length * (lineHeight - 2) + 3
    })

    yPos += sectionGap - 5

    // ===== HOTELS SECTION =====
    checkPageBreak(40)
    doc.setTextColor(26, 58, 92)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('ACCOMMODATION OPTIONS', leftMargin, yPos)
    yPos += lineHeight

    doc.setDrawColor(245, 166, 35)
    doc.line(leftMargin, yPos, rightMargin, yPos)
    yPos += 8

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(60, 60, 60)
    
    hotels?.forEach((hotel) => {
      checkPageBreak(15)
      doc.setFont('helvetica', 'bold')
      doc.text(`• ${hotel.platform}`, leftMargin, yPos)
      yPos += lineHeight - 2
      doc.setFont('helvetica', 'normal')
      const desc = doc.splitTextToSize(cleanText(hotel.description), pageWidth - 50)
      doc.text(desc, leftMargin + 5, yPos)
      yPos += desc.length * (lineHeight - 2) + 3
    })

    yPos += sectionGap

    // ===== DAY-BY-DAY ITINERARY =====
    checkPageBreak(30)
    doc.setTextColor(26, 58, 92)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('DAY-BY-DAY ITINERARY', leftMargin, yPos)
    yPos += lineHeight

    doc.setDrawColor(245, 166, 35)
    doc.line(leftMargin, yPos, rightMargin, yPos)
    yPos += 10

    dailyPlan?.forEach((day, index) => {
      checkPageBreak(50)
      
      // Day header with colored background
      doc.setFillColor(26, 58, 92)
      doc.roundedRect(leftMargin, yPos - 5, pageWidth - 40, 10, 2, 2, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text(`Day ${index + 1}: ${cleanText(day.title).replace(/Day \d+ - /, '')}`, leftMargin + 5, yPos + 2)
      yPos += 12

      // Activities
      doc.setTextColor(60, 60, 60)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      
      day.activities?.forEach((activity) => {
        checkPageBreak(10)
        const cleanActivity = cleanText(activity)
        const lines = doc.splitTextToSize(`→ ${cleanActivity}`, pageWidth - 50)
        doc.text(lines, leftMargin + 5, yPos)
        yPos += lines.length * (lineHeight - 1)
      })
      
      yPos += 8
    })

    // ===== LOCAL GUIDES SECTION =====
    checkPageBreak(40)
    yPos += 5
    doc.setTextColor(26, 58, 92)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('LOCAL GUIDES & TOUR ORGANIZATIONS', leftMargin, yPos)
    yPos += lineHeight

    doc.setDrawColor(245, 166, 35)
    doc.line(leftMargin, yPos, rightMargin, yPos)
    yPos += 8

    doc.setFontSize(10)
    doc.setTextColor(60, 60, 60)
    
    guides?.forEach((guide) => {
      checkPageBreak(20)
      doc.setFont('helvetica', 'bold')
      doc.text(`• ${guide.name}`, leftMargin, yPos)
      yPos += lineHeight - 2
      doc.setFont('helvetica', 'normal')
      doc.text(`  ${guide.specialty}`, leftMargin, yPos)
      yPos += lineHeight - 2
      if (guide.phone) {
        doc.text(`  Phone: ${guide.phone}`, leftMargin, yPos)
        yPos += lineHeight - 2
      }
      if (guide.website) {
        doc.setTextColor(26, 58, 92)
        doc.text(`  Website: ${guide.website}`, leftMargin, yPos)
        doc.setTextColor(60, 60, 60)
        yPos += lineHeight - 2
      }
      yPos += 3
    })

    // ===== FOOTER =====
    const totalPages = doc.internal.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      doc.setFillColor(26, 58, 92)
      doc.rect(0, pageHeight - 15, pageWidth, 15, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(8)
      doc.text('Generated by Yuva Yatra | www.yuvayatra.com', pageWidth / 2, pageHeight - 7, { align: 'center' })
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - 25, pageHeight - 7)
    }

    // Save the PDF
    const fileName = `YuvaYatra_${tripData?.destination?.replace(/\s+/g, '_')}_Itinerary.pdf`
    doc.save(fileName)
  }

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

          {/* Download PDF Button */}
          <button 
            className="btn btn-download" 
            onClick={downloadPDF}
            style={{ marginTop: '1.5rem' }}
          >
            📥 Download PDF Itinerary
          </button>
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
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-download" 
              onClick={downloadPDF}
            >
              📥 Download PDF
            </button>
            <button 
              className="btn btn-primary" 
              onClick={onBack}
            >
              Plan Another Trip
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Itinerary
