# 🌍 Yuva Yatra - From Inputs to Itineraries

![Yuva Yatra Logo](frontend/public/logo.png)

An AI-powered travel planning website that helps young travelers plan their dream vacations in minutes. Simply enter your starting location, destination, budget, and trip duration – and get a complete travel itinerary!

## ✨ Features

- 🤖 **AI-Powered Planning** - Uses Google Gemini AI to generate personalized travel itineraries
- ✈️ **Flight Recommendations** - Links to popular booking platforms (MakeMyTrip, Skyscanner, Cleartrip)
- 🏨 **Hotel Suggestions** - Budget-friendly accommodation options (Booking.com, OYO, Goibibo)
- 📅 **Day-by-Day Itinerary** - Detailed daily plans with activities, restaurants, and attractions
- 🧭 **Local Guides** - Contact information for tour operators and guides
- 🎨 **Modern UI** - Beautiful glassmorphism design with smooth animations
- 📱 **Responsive** - Works perfectly on all devices

## 🚀 Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **AI**: Google Gemini API
- **Styling**: Pure CSS with CSS Variables

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Syedx/yuva-yatra.git
   cd yuva-yatra
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=4000
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

5. **Start the servers**
   
   Backend (in root folder):
   ```bash
   node server.js
   ```
   
   Frontend (in frontend folder):
   ```bash
   cd frontend
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎮 Demo Mode

If you don't have a Gemini API key or hit rate limits, the app automatically falls back to Demo Mode with pre-built itineraries for 10+ popular Indian destinations:

- Goa, Manali, Jaipur, Kerala, Ladakh
- Rishikesh, Mumbai, Udaipur, Varanasi, Andaman

## 📸 Screenshots

*Coming soon!*

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Syed Owais Ahmed**
- GitHub: [@Syedx](https://github.com/Syedx)

---

Made with ❤️ for young travelers
