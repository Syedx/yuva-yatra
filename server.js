import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { destinationData, defaultData } from './destinations.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// DEMO MODE - Set to true to bypass API and use local generation
const DEMO_MODE = true;

// Middleware
app.use(cors());
app.use(express.json());

// ===============================
// SMART ITINERARY GENERATOR
// ===============================
function generateSmartItinerary(startLocation, destination, budget, days) {
  // Try to find destination in database (case insensitive, partial match)
  const destKey = destination.toLowerCase().replace(/\s+/g, '');
  let destInfo = destinationData[destKey] || null;
  
  // Try partial matching if exact match not found
  if (!destInfo) {
    const keys = Object.keys(destinationData);
    const partialMatch = keys.find(key => 
      key.includes(destKey) || destKey.includes(key) ||
      destinationData[key].name.toLowerCase().includes(destination.toLowerCase())
    );
    if (partialMatch) {
      destInfo = destinationData[partialMatch];
    }
  }
  
  const destName = destInfo ? destInfo.name : destination;
  const attractions = destInfo ? destInfo.attractions : defaultData.attractions;
  const restaurants = destInfo ? destInfo.restaurants : defaultData.restaurants;
  const activities = destInfo ? destInfo.activities : defaultData.activities;

  // Generate flights
  const flights = [
    {
      platform: "MakeMyTrip",
      description: `Compare flight prices from ${startLocation} to ${destName}. Budget airlines like IndiGo and SpiceJet offer great deals. Book early for best prices!`,
      link: `https://www.makemytrip.com/flights/`
    },
    {
      platform: "Skyscanner",
      description: "Find the cheapest flights across all airlines with flexible date search and price alerts.",
      link: `https://www.skyscanner.co.in/`
    },
    {
      platform: "Cleartrip",
      description: "Book flights with easy cancellation, modification options, and great cashback offers.",
      link: "https://www.cleartrip.com/flights"
    },
    {
      platform: "IRCTC (Trains)",
      description: `Consider trains for a scenic journey. Check availability at IRCTC for routes to ${destName}.`,
      link: "https://www.irctc.co.in/"
    }
  ];

  // Generate hotels based on budget
  const budgetNum = parseInt(budget);
  let hotelType = "budget-friendly";
  let hotelPrice = "₹500-1500/night";
  if (budgetNum > 100000) {
    hotelType = "luxury";
    hotelPrice = "₹5000+/night";
  } else if (budgetNum > 50000) {
    hotelType = "premium";
    hotelPrice = "₹3000-5000/night";
  } else if (budgetNum > 25000) {
    hotelType = "mid-range";
    hotelPrice = "₹1500-3000/night";
  }

  const hotels = [
    {
      platform: "Booking.com",
      description: `Wide range of ${hotelType} hotels and guesthouses in ${destName}. ${hotelPrice}`,
      link: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destName)}`
    },
    {
      platform: "OYO Rooms",
      description: "Affordable standardized rooms perfect for young travelers. Great for budget stays!",
      link: "https://www.oyorooms.com/"
    },
    {
      platform: "Goibibo",
      description: "Compare prices across hotels and get exclusive app-only discounts and cashbacks.",
      link: "https://www.goibibo.com/hotels/"
    },
    {
      platform: "Hostelworld",
      description: "Best hostels for backpackers and solo travelers. Great for meeting fellow travelers!",
      link: `https://www.hostelworld.com/`
    },
    {
      platform: "Airbnb",
      description: "Unique stays - apartments, villas, and local homes for authentic experience.",
      link: `https://www.airbnb.co.in/s/${encodeURIComponent(destName)}`
    }
  ];

  // Generate day-by-day itinerary
  const numDays = parseInt(days);
  const dailyPlan = [];
  
  for (let i = 1; i <= numDays; i++) {
    let dayTitle, dayActivities;
    
    if (i === 1) {
      // Arrival day
      dayTitle = `Day ${i} - Arrival & First Impressions`;
      dayActivities = [
        `🛬 Arrive at ${destName} - Check into your hotel and freshen up`,
        `☕ Relax and have brunch at the hotel or nearby cafe`,
        `📍 ${attractions[0] || "Explore the main area near your hotel"}`,
        `🍽️ ${restaurants[0] || "Lunch at a popular local restaurant"}`,
        `🚶 Evening walk to get familiar with the neighborhood`,
        `🌙 ${restaurants[1] || "Dinner at a recommended local spot"}`
      ];
    } else if (i === numDays) {
      // Last day
      dayTitle = `Day ${i} - Final Exploration & Departure`;
      dayActivities = [
        `☀️ Early morning - ${activities[Math.floor(Math.random() * activities.length)] || "Enjoy breakfast with a view"}`,
        `📸 Last-minute photography at favorite spots`,
        `🛍️ Shopping for souvenirs and local handicrafts`,
        `🍽️ ${restaurants[restaurants.length - 1] || "Farewell lunch with local specialties"}`,
        `📦 Pack up and check out from hotel`,
        `✈️ Head to airport/station for departure - Safe travels!`
      ];
    } else {
      // Middle days - mix of attractions and activities
      const dayIndex = i - 1;
      const attractionIdx = dayIndex % attractions.length;
      const activityIdx = dayIndex % activities.length;
      const restaurantIdx = dayIndex % restaurants.length;
      const nextAttractionIdx = (attractionIdx + 1) % attractions.length;
      
      dayTitle = `Day ${i} - ${attractions[attractionIdx]?.split(' - ')[0] || `Explore ${destName}`}`;
      dayActivities = [
        `🌅 Morning: ${attractions[attractionIdx] || "Start with a popular local attraction"}`,
        `☕ Breakfast at hotel or a local cafe`,
        `🎯 Mid-day: ${activities[activityIdx] || "Exciting local activity"}`,
        `🍽️ Lunch: ${restaurants[restaurantIdx] || "Try local cuisine at a recommended spot"}`,
        `🌆 Afternoon: ${attractions[nextAttractionIdx] || "Explore another famous spot"}`,
        `🌙 Evening: ${restaurants[(restaurantIdx + 1) % restaurants.length] || "Dinner and relaxation"}`
      ];
    }
    
    dailyPlan.push({
      title: dayTitle,
      activities: dayActivities
    });
  }

  // Generate guides with real booking platforms
  const guides = [
    {
      name: `${destName} Tourism Office`,
      specialty: "Official tourism information and government-approved guides",
      phone: "+91-1800-111-363 (Incredible India)",
      website: "https://www.incredibleindia.org"
    },
    {
      name: "TripAdvisor Experiences",
      specialty: "Local tours and activities with verified traveler reviews",
      website: `https://www.tripadvisor.in/Search?q=${encodeURIComponent(destName)}`
    },
    {
      name: "Thrillophilia",
      specialty: "Adventure tours, unique experiences, and offbeat activities",
      website: "https://www.thrillophilia.com/"
    },
    {
      name: "Viator",
      specialty: "Curated day tours, skip-the-line experiences, and local guides",
      website: "https://www.viator.com/"
    },
    {
      name: "GetYourGuide",
      specialty: "Professional guided tours and activities worldwide",
      website: "https://www.getyourguide.com/"
    }
  ];

  console.log(`✨ Generated itinerary for ${destName} (${destInfo ? 'Custom data' : 'Generic'} mode)`);
  
  return {
    flights,
    hotels,
    dailyPlan,
    guides,
    meta: {
      demoMode: true,
      destination: destName,
      hasLocalData: !!destInfo,
      bestTime: destInfo?.bestTime || "Year-round",
      type: destInfo?.type || "Tourist Destination"
    }
  };
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Yuva Yatra API is running!',
    demoMode: DEMO_MODE,
    availableDestinations: Object.keys(destinationData).length
  });
});

// List available destinations
app.get('/api/destinations', (req, res) => {
  const destinations = Object.entries(destinationData).map(([key, data]) => ({
    id: key,
    name: data.name,
    state: data.state,
    type: data.type,
    bestTime: data.bestTime
  }));
  res.json({ destinations, total: destinations.length });
});

// Main trip planning endpoint
app.post('/api/plan-trip', async (req, res) => {
  try {
    const { startLocation, destination, budget, days } = req.body;

    if (!startLocation || !destination || !budget || !days) {
      return res.status(400).json({ 
        error: 'Missing required fields: startLocation, destination, budget, days' 
      });
    }

    console.log(`Planning trip: ${startLocation} → ${destination}, ₹${budget}, ${days} days`);

    // Use demo mode for reliable operation
    if (DEMO_MODE) {
      const itinerary = generateSmartItinerary(startLocation, destination, budget, days);
      return res.json(itinerary);
    }

    // API Mode (when demo mode is off)
    const prompt = `Create a detailed travel plan from ${startLocation} to ${destination}, budget ₹${budget}, ${days} days. Return JSON only.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    let result;
    let retries = 3;
    let delay = 2000;
    
    while (retries > 0) {
      try {
        result = await model.generateContent(prompt);
        break;
      } catch (apiError) {
        retries--;
        if (apiError.message?.includes('429') || apiError.message?.includes('quota') || apiError.message?.includes('rate')) {
          console.log(`Rate limited, using demo mode fallback`);
          const itinerary = generateSmartItinerary(startLocation, destination, budget, days);
          return res.json(itinerary);
        } else {
          throw apiError;
        }
      }
    }
    
    const response = await result.response;
    let text = response.text();
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let itinerary;
    try {
      itinerary = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse Gemini response, using demo mode');
      itinerary = generateSmartItinerary(startLocation, destination, budget, days);
    }

    console.log('Successfully generated itinerary for', destination);
    res.json(itinerary);

  } catch (error) {
    console.error('Error generating itinerary:', error);
    // Fallback to demo mode on any error
    try {
      const { startLocation, destination, budget, days } = req.body;
      const itinerary = generateSmartItinerary(startLocation, destination, budget, days);
      res.json(itinerary);
    } catch (fallbackError) {
      res.status(500).json({ 
        error: 'Failed to generate travel plan. Please try again.',
        details: error.message 
      });
    }
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Yuva Yatra API running on http://localhost:${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🗺️  Available destinations: ${Object.keys(destinationData).length}`);
  console.log(`🎮 Demo Mode: ${DEMO_MODE ? 'ON' : 'OFF'}`);
});
