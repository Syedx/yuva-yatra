import { destinationData, defaultData } from './destinations.js';

// Smart Itinerary Generator
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
      description: `Compare flight prices from ${startLocation} to ${destName}. Budget airlines like IndiGo and SpiceJet offer great deals!`,
      link: `https://www.makemytrip.com/flights/`
    },
    {
      platform: "Skyscanner",
      description: "Find the cheapest flights across all airlines with flexible date search and price alerts.",
      link: `https://www.skyscanner.co.in/`
    },
    {
      platform: "Cleartrip",
      description: "Book flights with easy cancellation and great cashback offers.",
      link: "https://www.cleartrip.com/flights"
    },
    {
      platform: "IRCTC (Trains)",
      description: `Consider trains for a scenic journey. Check availability at IRCTC.`,
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
      description: `Wide range of ${hotelType} hotels in ${destName}. ${hotelPrice}`,
      link: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destName)}`
    },
    {
      platform: "OYO Rooms",
      description: "Affordable standardized rooms perfect for young travelers.",
      link: "https://www.oyorooms.com/"
    },
    {
      platform: "Goibibo",
      description: "Compare prices and get exclusive app-only discounts.",
      link: "https://www.goibibo.com/hotels/"
    },
    {
      platform: "Hostelworld",
      description: "Best hostels for backpackers and solo travelers!",
      link: `https://www.hostelworld.com/`
    }
  ];

  // Generate day-by-day itinerary
  const numDays = parseInt(days);
  const dailyPlan = [];
  
  for (let i = 1; i <= numDays; i++) {
    let dayTitle, dayActivities;
    
    if (i === 1) {
      dayTitle = `Day ${i} - Arrival & First Impressions`;
      dayActivities = [
        `🛬 Arrive at ${destName} - Check into your hotel`,
        `☕ Relax and have brunch at hotel or nearby`,
        `📍 ${attractions[0] || "Explore the area"}`,
        `🍽️ ${restaurants[0] || "Lunch at local restaurant"}`,
        `🚶 Evening walk to explore neighborhood`,
        `🌙 ${restaurants[1] || "Dinner at recommended spot"}`
      ];
    } else if (i === numDays) {
      dayTitle = `Day ${i} - Final Exploration & Departure`;
      dayActivities = [
        `☀️ Early morning activity`,
        `📸 Last-minute photography`,
        `🛍️ Shopping for souvenirs`,
        `🍽️ Farewell lunch`,
        `📦 Check out from hotel`,
        `✈️ Departure - Safe travels!`
      ];
    } else {
      const dayIndex = i - 1;
      const attractionIdx = dayIndex % attractions.length;
      const activityIdx = dayIndex % activities.length;
      const restaurantIdx = dayIndex % restaurants.length;
      
      dayTitle = `Day ${i} - ${attractions[attractionIdx]?.split(' - ')[0] || `Explore ${destName}`}`;
      dayActivities = [
        `🌅 Morning: ${attractions[attractionIdx] || "Local attraction"}`,
        `☕ Breakfast at local cafe`,
        `🎯 ${activities[activityIdx] || "Exciting activity"}`,
        `🍽️ ${restaurants[restaurantIdx] || "Try local cuisine"}`,
        `🌆 ${attractions[(attractionIdx + 1) % attractions.length] || "Another spot"}`,
        `🌙 ${restaurants[(restaurantIdx + 1) % restaurants.length] || "Dinner"}`
      ];
    }
    
    dailyPlan.push({ title: dayTitle, activities: dayActivities });
  }

  const guides = [
    {
      name: `${destName} Tourism Office`,
      specialty: "Official tourism information and guides",
      phone: "+91-1800-111-363",
      website: "https://www.incredibleindia.org"
    },
    {
      name: "TripAdvisor Experiences",
      specialty: "Local tours with verified reviews",
      website: `https://www.tripadvisor.in/Search?q=${encodeURIComponent(destName)}`
    },
    {
      name: "Thrillophilia",
      specialty: "Adventure tours and unique experiences",
      website: "https://www.thrillophilia.com/"
    }
  ];

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

// Vercel Serverless Function Handler
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { startLocation, destination, budget, days } = req.body;

    if (!startLocation || !destination || !budget || !days) {
      return res.status(400).json({ 
        error: 'Missing required fields: startLocation, destination, budget, days' 
      });
    }

    console.log(`Planning: ${startLocation} → ${destination}, ₹${budget}, ${days} days`);

    const itinerary = generateSmartItinerary(startLocation, destination, budget, days);
    return res.status(200).json(itinerary);

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Failed to generate travel plan' });
  }
}
