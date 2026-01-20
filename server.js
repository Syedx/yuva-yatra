import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
// DESTINATION DATABASE
// ===============================
const destinationData = {
  goa: {
    name: "Goa",
    attractions: [
      "Baga Beach - Famous for water sports and nightlife",
      "Calangute Beach - Queen of Beaches with golden sands",
      "Fort Aguada - 17th-century Portuguese fort with lighthouse",
      "Basilica of Bom Jesus - UNESCO World Heritage church",
      "Dudhsagar Waterfalls - Stunning 4-tiered waterfall",
      "Anjuna Flea Market - Best for shopping and souvenirs",
      "Chapora Fort - Iconic 'Dil Chahta Hai' location",
      "Old Goa Churches - Beautiful Portuguese architecture",
      "Palolem Beach - Crescent-shaped paradise beach",
      "Spice Plantations - Aromatic tour with local cuisine"
    ],
    restaurants: [
      "Thalassa - Greek restaurant with stunning sunset views",
      "Britto's - Beachside dining at Baga",
      "Fisherman's Wharf - Fresh seafood by the river",
      "Gunpowder - Authentic South Indian cuisine",
      "Curlies Beach Shack - Legendary beach party spot"
    ],
    activities: [
      "Parasailing at Baga Beach",
      "Jet skiing and banana boat rides",
      "Scuba diving at Grande Island",
      "Dolphin watching cruise",
      "Casino night at Deltin Royale",
      "Sunset cruise on Mandovi River",
      "Party at Tito's Lane"
    ]
  },
  manali: {
    name: "Manali",
    attractions: [
      "Solang Valley - Adventure sports paradise",
      "Rohtang Pass - Stunning snow-capped views",
      "Hadimba Temple - Ancient cave temple in cedar forest",
      "Old Manali - Hippie cafes and vibrant culture",
      "Jogini Waterfall - Beautiful trek through apple orchards",
      "Manu Temple - Sacred shrine of sage Manu",
      "Vashisht Hot Springs - Natural thermal baths",
      "Mall Road - Shopping and local food hub",
      "Beas River - Rafting and riverside camping",
      "Naggar Castle - Historic castle with art gallery"
    ],
    restaurants: [
      "Johnson's Cafe - Continental cuisine with mountain views",
      "Lazy Dog Lounge - Cozy cafe with live music",
      "Dylan's Toasted & Roasted - Best coffee in town",
      "Drifters' Inn - Backpacker favorite with great food",
      "Renaissance - Italian and Indian fusion"
    ],
    activities: [
      "Paragliding at Solang Valley",
      "River rafting in Beas",
      "Skiing and snowboarding (winter)",
      "Trekking to Bhrigu Lake",
      "Mountain biking tours",
      "Camping under the stars",
      "Zorbing and ATV rides"
    ]
  },
  jaipur: {
    name: "Jaipur",
    attractions: [
      "Amber Fort - Majestic hilltop fortress",
      "Hawa Mahal - Iconic Palace of Winds",
      "City Palace - Royal residence and museum",
      "Jantar Mantar - UNESCO astronomical observatory",
      "Nahargarh Fort - Sunset viewpoint over city",
      "Jal Mahal - Water Palace in Man Sagar Lake",
      "Albert Hall Museum - Indo-Saracenic architecture",
      "Johri Bazaar - Famous for jewelry shopping",
      "Birla Mandir - White marble temple",
      "Elefantastic - Ethical elephant sanctuary"
    ],
    restaurants: [
      "1135 AD - Royal dining at Amber Fort",
      "Suvarna Mahal - Regal Rajasthani cuisine",
      "Tapri Central - Hip rooftop chai spot",
      "Rawat Misthan Bhandar - Famous for pyaaz kachori",
      "Bar Palladio - Italian in Mughal garden setting"
    ],
    activities: [
      "Hot air balloon ride over Pink City",
      "Elephant ride at Amber Fort",
      "Cooking class for Rajasthani cuisine",
      "Textile and block printing workshop",
      "Evening light & sound show at Amber",
      "Vintage car museum visit",
      "Chokhi Dhani cultural village"
    ]
  },
  kerala: {
    name: "Kerala",
    attractions: [
      "Alleppey Backwaters - Houseboat paradise",
      "Munnar Tea Gardens - Rolling hills of green",
      "Fort Kochi - Colonial charm and Chinese nets",
      "Thekkady - Periyar Wildlife Sanctuary",
      "Varkala Beach - Cliff-top beach destination",
      "Kovalam Beach - Crescent beach with lighthouse",
      "Wayanad - Misty mountains and waterfalls",
      "Athirappilly Falls - Niagara of India",
      "Kumarakom Bird Sanctuary - Birdwatcher's heaven",
      "Marari Beach - Pristine and peaceful"
    ],
    restaurants: [
      "Malabar Junction - Authentic Kerala cuisine",
      "Kashi Art Cafe - Artistic vibes in Fort Kochi",
      "Paragon - Famous for Malabar biryani",
      "Fusion Bay - Seafood with backwater views",
      "Tharavadu - Traditional sadya experience"
    ],
    activities: [
      "Houseboat cruise through backwaters",
      "Ayurvedic spa and massage",
      "Kathakali dance performance",
      "Spice plantation tour in Thekkady",
      "Periyar jungle safari",
      "Bamboo rafting",
      "Canoe through village canals"
    ]
  },
  ladakh: {
    name: "Ladakh",
    attractions: [
      "Pangong Lake - Stunning blue alpine lake",
      "Leh Palace - Historic royal residence",
      "Nubra Valley - Cold desert with Bactrian camels",
      "Khardung La - World's highest motorable pass",
      "Thiksey Monastery - Mini Potala Palace",
      "Magnetic Hill - Gravity-defying optical illusion",
      "Shanti Stupa - Peaceful Buddhist monument",
      "Hemis Monastery - Largest monastery in Ladakh",
      "Tso Moriri Lake - Remote and pristine",
      "Zanskar Valley - Adventure destination"
    ],
    restaurants: [
      "Bon Appetit - Continental and Ladakhi",
      "Gesmo - Popular traveler cafe",
      "Tibetan Kitchen - Authentic momos and thukpa",
      "Lamayuru - Rooftop dining with views",
      "The Tibetan World Cafe - Cozy Leh hangout"
    ],
    activities: [
      "Motorcycle trip on Manali-Leh highway",
      "Camping at Pangong Lake",
      "Camel safari in Nubra Valley",
      "River rafting in Zanskar",
      "Trekking to Stok Kangri",
      "Mountain biking",
      "Monastery meditation retreat"
    ]
  },
  rishikesh: {
    name: "Rishikesh",
    attractions: [
      "Laxman Jhula - Iconic suspension bridge",
      "Ram Jhula - Sacred pedestrian bridge",
      "Triveni Ghat - Evening aarti ceremony",
      "Beatles Ashram - Meditation ruins in forest",
      "Neelkanth Mahadev Temple - Shiva temple in hills",
      "Parmarth Niketan - Famous ashram",
      "Rajaji National Park - Tigers and elephants",
      "Neer Garh Waterfall - Refreshing natural pool",
      "Shivpuri Beach - White sand camping",
      "Kunjapuri Temple - Sunrise viewpoint"
    ],
    restaurants: [
      "Chotiwala - Iconic vegetarian since 1958",
      "Little Buddha Cafe - Chilled vibes by Ganga",
      "Beatles Cafe - Music and food tribute",
      "Madras Cafe - South Indian favorites",
      "Ganga Beach Cafe - River view dining"
    ],
    activities: [
      "White water rafting (Grade 3-4)",
      "Bungee jumping (highest in India)",
      "Cliff jumping",
      "Yoga and meditation retreat",
      "Camping by the Ganges",
      "Flying fox/zipline",
      "Evening Ganga aarti ceremony"
    ]
  },
  mumbai: {
    name: "Mumbai",
    attractions: [
      "Gateway of India - Iconic waterfront arch",
      "Marine Drive - Queen's Necklace promenade",
      "Elephanta Caves - UNESCO World Heritage site",
      "Colaba Causeway - Shopping and street food",
      "Chhatrapati Shivaji Terminus - Victorian Gothic station",
      "Bandra-Worli Sea Link - Engineering marvel",
      "Juhu Beach - Celebrity spotting and bhelpuri",
      "Sanjay Gandhi National Park - Urban jungle",
      "Haji Ali Dargah - Floating mosque",
      "Dharavi - Asia's largest slum tour"
    ],
    restaurants: [
      "Leopold Cafe - Historic Colaba landmark",
      "Trishna - Legendary butter garlic crab",
      "Britannia & Co. - Parsi institution",
      "Pali Village Cafe - Trendy Bandra spot",
      "Bademiya - Iconic late-night kebabs"
    ],
    activities: [
      "Street food tour in Colaba",
      "Bollywood studio tour",
      "Cricket at Wankhede Stadium",
      "Ferry to Elephanta Caves",
      "Heritage walk in Fort area",
      "Nightlife in Lower Parel",
      "Shopping at Crawford Market"
    ]
  },
  udaipur: {
    name: "Udaipur",
    attractions: [
      "City Palace - Largest palace complex in India",
      "Lake Pichola - Romantic boat rides",
      "Jag Mandir - Island palace in the lake",
      "Jagdish Temple - 17th century Vishnu temple",
      "Sajjangarh Palace - Monsoon Palace sunset",
      "Fateh Sagar Lake - Peaceful lakeside walks",
      "Bagore Ki Haveli - Cultural shows nightly",
      "Saheliyon Ki Bari - Garden of Maidens",
      "Lake Palace Hotel - Floating luxury",
      "Vintage Car Museum - Royal automobiles"
    ],
    restaurants: [
      "Ambrai - Lake view fine dining",
      "Upre by 1559 AD - Rooftop with palace views",
      "Savage Garden - Bohemian cafe vibes",
      "Cafe Edelweiss - German bakery",
      "Charcoal by Carlsson - Barbecue specialist"
    ],
    activities: [
      "Sunset boat ride on Lake Pichola",
      "Cooking class for Mewari cuisine",
      "Traditional puppet show",
      "Cycling tour of old city",
      "Hot air balloon over lakes",
      "Horse safari",
      "Rajasthani folk dance show"
    ]
  },
  varanasi: {
    name: "Varanasi",
    attractions: [
      "Dashashwamedh Ghat - Famous evening aarti",
      "Kashi Vishwanath Temple - Holy Shiva temple",
      "Assi Ghat - Morning yoga and music",
      "Manikarnika Ghat - Sacred cremation ground",
      "Sarnath - Where Buddha gave first sermon",
      "Ramnagar Fort - Across the Ganges",
      "Tulsi Manas Temple - Ram Charit Manas",
      "Banaras Hindu University - Beautiful campus",
      "Bharat Kala Bhavan - Art museum",
      "Alamgir Mosque - Mughal architecture"
    ],
    restaurants: [
      "Blue Lassi - Legendary lassi shop",
      "Kashi Chat Bhandar - Famous street chaat",
      "Brown Bread Bakery - Cafe and social enterprise",
      "Pizzeria Vaatika Cafe - Italian with ghat views",
      "Aadha-Aadha - Authentic Banarasi food"
    ],
    activities: [
      "Sunrise boat ride on Ganges",
      "Evening Ganga Aarti ceremony",
      "Silk weaving workshop visit",
      "Classical music performance",
      "Walking tour of old city lanes",
      "Yoga session at Assi Ghat",
      "Morning chai at the ghats"
    ]
  },
  andaman: {
    name: "Andaman Islands",
    attractions: [
      "Radhanagar Beach - Asia's best beach",
      "Cellular Jail - Historic colonial prison",
      "Havelock Island - Pristine beaches",
      "Neil Island - Laid-back beach vibes",
      "Ross Island - British ruins in jungle",
      "Elephant Beach - Snorkeling paradise",
      "Baratang Island - Limestone caves",
      "Mahatma Gandhi Marine Park - Coral reefs",
      "Chidiya Tapu - Sunset point",
      "North Bay Island - Water activities hub"
    ],
    restaurants: [
      "New Lighthouse Restaurant - Seafood specialist",
      "Anju Coco - Beach shack dining",
      "Full Moon Cafe - Havelock favorite",
      "Barefoot at Havelock - Resort dining",
      "Fat Martin Cafe - Port Blair cafe"
    ],
    activities: [
      "Scuba diving at Havelock",
      "Snorkeling at Elephant Beach",
      "Sea walking at North Bay",
      "Glass bottom boat ride",
      "Kayaking through mangroves",
      "Light & Sound show at Cellular Jail",
      "Island hopping tour"
    ]
  }
};

// Default activities for unknown destinations
const defaultData = {
  attractions: [
    "Visit the main city center and local markets",
    "Explore historical monuments and temples",
    "Check out the local museum",
    "Walk through the old town area",
    "Visit nearby natural attractions"
  ],
  restaurants: [
    "Local cuisine restaurant",
    "Popular street food spots",
    "Rooftop cafe with city views",
    "Traditional thali restaurant",
    "Modern fusion dining"
  ],
  activities: [
    "Local sightseeing tour",
    "Shopping at local markets",
    "Photography walk",
    "Cultural experience",
    "Nature excursion nearby"
  ]
};

// ===============================
// SMART ITINERARY GENERATOR
// ===============================
function generateSmartItinerary(startLocation, destination, budget, days) {
  const destKey = destination.toLowerCase().replace(/\s+/g, '');
  const destInfo = destinationData[destKey] || null;
  const destName = destInfo ? destInfo.name : destination;
  
  const attractions = destInfo ? destInfo.attractions : defaultData.attractions;
  const restaurants = destInfo ? destInfo.restaurants : defaultData.restaurants;
  const activities = destInfo ? destInfo.activities : defaultData.activities;

  // Generate flights
  const flights = [
    {
      platform: "MakeMyTrip",
      description: `Compare flight prices from ${startLocation} to ${destName}. Budget airlines like IndiGo and SpiceJet offer great deals.`,
      link: `https://www.makemytrip.com/flights/`
    },
    {
      platform: "Skyscanner",
      description: "Find the cheapest flights across all airlines with flexible date search.",
      link: `https://www.skyscanner.co.in/`
    },
    {
      platform: "Cleartrip",
      description: "Book flights with easy cancellation and great cashback offers.",
      link: "https://www.cleartrip.com/flights"
    }
  ];

  // Generate hotels
  const budgetNum = parseInt(budget);
  let hotelType = "budget-friendly";
  if (budgetNum > 50000) hotelType = "premium";
  else if (budgetNum > 25000) hotelType = "mid-range";

  const hotels = [
    {
      platform: "Booking.com",
      description: `Wide range of ${hotelType} hotels and guesthouses in ${destName}.`,
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
      description: "Best hostels for backpackers and solo travelers - great for meeting people!",
      link: `https://www.hostelworld.com/`
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
        `🛬 Arrive at ${destName} and check into your hotel`,
        `🍽️ ${restaurants[0] || "Enjoy lunch at a local restaurant"}`,
        `🚶 Evening walk to explore the neighborhood`,
        `📸 ${attractions[0] || "Visit the main attraction nearby"}`,
        `🌙 ${restaurants[1] || "Dinner at a popular local spot"}`
      ];
    } else if (i === numDays) {
      // Last day
      dayTitle = `Day ${i} - Final Exploration & Departure`;
      dayActivities = [
        `☀️ Early morning ${activities[i % activities.length] || "local experience"}`,
        `🛍️ Last-minute shopping for souvenirs`,
        `📷 Final photo opportunities at favorite spots`,
        `🍽️ Farewell lunch with local specialties`,
        `✈️ Head to airport/station for departure`
      ];
    } else {
      // Middle days
      const attractionIdx = (i - 1) % attractions.length;
      const activityIdx = (i - 1) % activities.length;
      const restaurantIdx = (i - 1) % restaurants.length;
      
      dayTitle = `Day ${i} - ${attractions[attractionIdx]?.split(' - ')[0] || 'Adventure Day'}`;
      dayActivities = [
        `🌅 Morning: ${attractions[attractionIdx] || "Explore local attractions"}`,
        `☕ Breakfast at hotel or local cafe`,
        `🎯 ${activities[activityIdx] || "Exciting activity"}`,
        `🍽️ ${restaurants[restaurantIdx] || "Lunch at recommended spot"}`,
        `🌆 Evening: ${attractions[(attractionIdx + 1) % attractions.length] || "Sunset views"}`,
        `🌙 Night: ${restaurants[(restaurantIdx + 1) % restaurants.length] || "Dinner and relaxation"}`
      ];
    }
    
    dailyPlan.push({
      title: dayTitle,
      activities: dayActivities
    });
  }

  // Generate guides
  const guides = [
    {
      name: `${destName} Tourism Office`,
      specialty: "Official tourism information and government-approved guides",
      phone: "+91-1800-111-363",
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
      specialty: "Curated day tours and skip-the-line experiences",
      website: "https://www.viator.com/"
    }
  ];

  console.log(`✨ Generated smart itinerary for ${destName} (Demo Mode)`);
  
  return {
    flights,
    hotels,
    dailyPlan,
    guides,
    meta: {
      demoMode: true,
      destination: destName,
      hasLocalData: !!destInfo
    }
  };
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Yuva Yatra API is running!',
    demoMode: DEMO_MODE
  });
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
    const prompt = `You are a travel planning assistant. Create a detailed travel plan for:
FROM: ${startLocation}, India TO: ${destination}, India
BUDGET: ₹${budget} DURATION: ${days} days

Return JSON with: flights (array with platform, description, link), hotels (same format), 
dailyPlan (array of objects with title and activities array), guides (array with name, specialty, phone, website).
Response must be valid JSON only.`;

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
  console.log(`🎮 Demo Mode: ${DEMO_MODE ? 'ON (No API calls)' : 'OFF (Using Gemini API)'}`);
});
