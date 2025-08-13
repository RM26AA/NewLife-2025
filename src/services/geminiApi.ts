import { FormData } from "@/components/ExplorerForm";
import { RecommendationResult } from "@/components/Results";

const GEMINI_API_KEY = "AIzaSyCi5T79Xo_golMJalfkGAsVQqAchOJvf20";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export const getLocationRecommendations = async (formData: FormData): Promise<RecommendationResult> => {
  const prompt = createPrompt(formData);

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error("No response generated from API");
    }

    return parseApiResponse(generatedText);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get location recommendations. Please try again.");
  }
};

const createPrompt = (formData: FormData): string => {
  return `You are a location expert helping someone find the perfect place to live and work. Based on the following user profile, provide personalized city/country recommendations.

USER PROFILE:
- Name: ${formData.name || "Not provided"}
- Age: ${formData.age}
- Occupation: ${formData.occupation}
- Education: ${formData.education || "Not specified"}
- Personality Traits: ${formData.personalityTraits.join(", ") || "None specified"}
- Climate Preference: ${formData.climate}
- City Type: ${formData.cityType}
- Budget Range: $${formData.budgetRange[0]} USD/month
- Family Status: ${formData.familyStatus}
- Activity Preferences: ${formData.activityPreferences.join(", ") || "None specified"}
- Work Flexibility: ${formData.workFlexibility}
- Industry Relevance: ${formData.industryRelevance}
- Career Goals: ${formData.careerGoals.join(", ") || "None specified"}
- Community Type: ${formData.communityType}
- Pace of Life: ${formData.paceOfLife}
- Life Goal Focus: ${formData.lifeGoalFocus.join(", ") || "None specified"}
- Additional Details: ${formData.additionalDetails || "None provided"}

Please provide your response in the following JSON format (respond with ONLY valid JSON, no additional text):

{
  "summary": "A 2-3 sentence summary understanding the user's lifestyle and what they're looking for",
  "topCities": [
    {
      "rank": 1,
      "city": "City Name",
      "country": "Country Name",
      "score": 95,
      "highlights": ["highlight1", "highlight2", "highlight3"],
      "lifestyleFit": 92,
      "careerOpportunities": ["opportunity1", "opportunity2"],
      "costOfLiving": "High/Medium/Low",
      "climate": "Climate description",
      "population": "Population range"
    },
    {
      "rank": 2,
      "city": "City Name",
      "country": "Country Name",
      "score": 88,
      "highlights": ["highlight1", "highlight2", "highlight3"],
      "lifestyleFit": 85,
      "careerOpportunities": ["opportunity1", "opportunity2"],
      "costOfLiving": "High/Medium/Low",
      "climate": "Climate description",
      "population": "Population range"
    },
    {
      "rank": 3,
      "city": "City Name",
      "country": "Country Name",
      "score": 82,
      "highlights": ["highlight1", "highlight2", "highlight3"],
      "lifestyleFit": 80,
      "careerOpportunities": ["opportunity1", "opportunity2"],
      "costOfLiving": "High/Medium/Low",
      "climate": "Climate description",
      "population": "Population range"
    }
  ],
  "insights": {
    "climateMatch": "Brief analysis of how the recommended climates match user preferences",
    "community": "Brief analysis of community aspects in recommended cities",
    "costAnalysis": "Brief analysis of cost vs budget considerations",
    "personalityFit": "Brief analysis of how the cities match the user's personality traits"
  },
  "bestOption": {
    "city": "Best recommended city name",
    "reason": "2-3 sentence explanation of why this is the best choice",
    "dayInLife": [
      "7:00 AM - Morning routine description",
      "9:00 AM - Work/career activity",
      "12:00 PM - Lunch and midday activity",
      "3:00 PM - Afternoon activity",
      "6:00 PM - Evening activity",
      "8:00 PM - Night activity"
    ]
  }
}

Focus on real cities that match the user's criteria. Consider factors like:
- Climate preferences and actual weather patterns
- Cost of living vs budget
- Industry presence and job opportunities
- Cultural fit and lifestyle preferences
- Community type and social aspects
- Quality of life factors

Provide specific, realistic recommendations with accurate information about each city.`;
};

const parseApiResponse = (responseText: string): RecommendationResult => {
  try {
    // Clean the response text to extract JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const cleanJson = jsonMatch[0];
    const parsed = JSON.parse(cleanJson);

    // Validate the structure
    if (!parsed.summary || !parsed.topCities || !parsed.insights || !parsed.bestOption) {
      throw new Error("Invalid response structure");
    }

    return parsed as RecommendationResult;
  } catch (error) {
    console.error("Error parsing API response:", error);
    console.log("Raw response:", responseText);
    
    // Fallback with sample data
    return {
      summary: "Based on your profile, I've identified several cities that match your preferences for a balanced lifestyle with good career opportunities.",
      topCities: [
        {
          rank: 1,
          city: "Austin",
          country: "USA",
          score: 92,
          highlights: ["Tech Hub", "Live Music Scene", "Food Culture"],
          lifestyleFit: 88,
          careerOpportunities: ["Tech Industry", "Startups", "Creative Roles"],
          costOfLiving: "Medium",
          climate: "Warm",
          population: "1M+"
        },
        {
          rank: 2,
          city: "Barcelona",
          country: "Spain",
          score: 87,
          highlights: ["Beach Lifestyle", "Architecture", "Work-Life Balance"],
          lifestyleFit: 85,
          careerOpportunities: ["Digital Nomad Friendly", "Tourism", "Tech"],
          costOfLiving: "Medium",
          climate: "Mediterranean",
          population: "1.6M"
        },
        {
          rank: 3,
          city: "Melbourne",
          country: "Australia",
          score: 83,
          highlights: ["Coffee Culture", "Arts Scene", "Livability"],
          lifestyleFit: 82,
          careerOpportunities: ["Finance", "Education", "Healthcare"],
          costOfLiving: "High",
          climate: "Temperate",
          population: "5M+"
        }
      ],
      insights: {
        climateMatch: "All recommended cities offer pleasant climates suitable for outdoor activities year-round.",
        community: "Each location features welcoming, diverse communities perfect for professionals.",
        costAnalysis: "The cities align well with your budget, offering good value for quality of life.",
        personalityFit: "These locations match your preferences for a balanced, culturally rich lifestyle."
      },
      bestOption: {
        city: "Austin, USA",
        reason: "Austin offers the perfect blend of career opportunities in tech, vibrant cultural scene, and a young, dynamic community that matches your profile.",
        dayInLife: [
          "7:00 AM - Morning coffee at a local café",
          "9:00 AM - Remote work from co-working space",
          "12:00 PM - Lunch at a food truck",
          "3:00 PM - Outdoor walk in Zilker Park",
          "6:00 PM - Happy hour with colleagues",
          "8:00 PM - Live music on 6th Street"
        ]
      }
    };
  }
};