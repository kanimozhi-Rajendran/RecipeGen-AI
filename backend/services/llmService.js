/**
 * LLM Service: Handles communication with AI providers (Google Gemini / OpenAI compatible)
 * and provides realistic dynamic demo recipe generation when DEMO_MODE=true.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Safely strips markdown code blocks and extracts the pure JSON string.
 */
function extractJsonString(rawText) {
  if (!rawText || typeof rawText !== 'string') return '';
  let cleaned = rawText.trim();

  // If enclosed in markdown ```json or ``` code fences, extract the inner block
  const jsonFenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (jsonFenceMatch && jsonFenceMatch[1]) {
    cleaned = jsonFenceMatch[1].trim();
  }

  // Find first '{' and last '}'
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return cleaned;
}

/**
 * Dynamic recipe generator for DEMO_MODE (no API key required).
 * Generates 3 realistic recipes tailored to the passed ingredients and preferences.
 */
function generateDemoRecipes(ingredients, preferences) {
  const {
    diet = 'Any',
    cuisine = 'Any',
    difficulty = 'Easy',
    maxTime = '30',
    servings = 2
  } = preferences;

  const ingList = ingredients.map(i => i.toLowerCase().trim());
  const primary = ingList[0] || 'Vegetables';
  const secondary = ingList[1] || 'Herbs';
  const third = ingList[2] || 'Spices';

  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const p1 = cap(primary);
  const p2 = cap(secondary);
  const p3 = cap(third);

  const isVeg = diet === 'Vegetarian' || diet === 'Vegan';
  const resolvedDiet = isVeg ? (diet === 'Vegan' ? 'Vegan' : 'Vegetarian') : (ingList.some(i => ['egg', 'chicken', 'meat', 'fish', 'prawns', 'bacon'].includes(i)) ? 'Non-Vegetarian' : 'Vegetarian');

  const resolvedCuisine = cuisine !== 'Any' ? cuisine : (ingList.includes('egg') && ingList.includes('rice') ? 'South Indian' : 'Fusion');

  return {
    recipes: [
      {
        name: `Classic ${resolvedCuisine} ${p1} & ${p2} Medley`,
        description: `A fragrant, perfectly seasoned pan-sauté combining ${p1} with ${p2} and warming spices for a quick comforting meal.`,
        cuisine: resolvedCuisine,
        diet: resolvedDiet,
        difficulty: difficulty !== 'Any' ? difficulty : 'Easy',
        cooking_time_minutes: maxTime !== 'Any' && parseInt(maxTime, 10) <= 30 ? parseInt(maxTime, 10) : 20,
        servings: typeof servings === 'number' ? servings : 2,
        available_ingredients: ingList.slice(0, 4),
        missing_ingredients: ['Cooking oil (1 tbsp)', 'Salt (to taste)', 'Black pepper or chili powder (1/2 tsp)'],
        ingredients: [
          ...ingList.slice(0, 4).map((item, idx) => ({
            name: cap(item),
            quantity: idx === 0 ? '1 cup, chopped' : (idx === 1 ? '1 medium, sliced' : '2 tbsp / as needed')
          })),
          { name: 'Cooking oil', quantity: '1 tbsp' },
          { name: 'Salt & Pepper', quantity: 'to taste' }
        ],
        steps: [
          `Rinse and prep your ${p1} and ${p2} into bite-sized pieces.`,
          `Heat 1 tbsp oil in a skillet or wok over medium-high flame.`,
          `Sauté ${p2} and aromatics for 2-3 minutes until golden and fragrant.`,
          `Toss in ${p1} along with ${p3 ? p3 : 'seasonings'} and cook for 5-7 minutes until tender.`,
          `Season with salt, black pepper, and serve piping hot.`
        ],
        substitutions: [
          { original: 'Cooking oil', replacement: 'Butter, ghee, or olive oil' },
          { original: p1, replacement: 'Tofu, mushrooms, or paneer' }
        ],
        tips: [
          'Sear on medium-high heat without overcrowding the pan for maximum caramelized flavor.',
          'Garnish with fresh herbs or a squeeze of lemon juice before serving.'
        ]
      },
      {
        name: `Savory ${p1} & ${p2} Skillet Toss`,
        description: `A wholesome, one-pan delight highlighting ${p1} cooked to perfection with ${secondary} and crispy aromatic accents.`,
        cuisine: resolvedCuisine === 'Indian' || resolvedCuisine === 'South Indian' ? 'Indian' : 'Continental',
        diet: resolvedDiet,
        difficulty: 'Easy',
        cooking_time_minutes: maxTime !== 'Any' && parseInt(maxTime, 10) <= 25 ? parseInt(maxTime, 10) : 18,
        servings: typeof servings === 'number' ? servings : 2,
        available_ingredients: ingList,
        missing_ingredients: ['Butter or Olive oil (1 tbsp)', 'Garlic (2 cloves minced)', 'Pinch of oregano or cumin'],
        ingredients: [
          ...ingList.map((item, idx) => ({
            name: cap(item),
            quantity: idx === 0 ? '1.5 cups' : '1/2 cup / unit'
          })),
          { name: 'Garlic cloves', quantity: '2 minced' },
          { name: 'Butter/Oil', quantity: '1 tbsp' }
        ],
        steps: [
          `Heat a wide shallow pan and melt butter or heat oil over medium flame.`,
          `Add minced garlic and allow to sizzle for 30 seconds until aromatic.`,
          `Add ${p1} and ${p2}, tossing evenly to coat in the fragrant oil.`,
          `Cover and cook on low-medium heat for 8 minutes until juicy and tender.`,
          `Uncover, crank the heat for 2 minutes to get a slight char, and remove from heat.`
        ],
        substitutions: [
          { original: 'Garlic', replacement: 'Garlic powder or finely chopped shallots' },
          { original: 'Butter', replacement: 'Olive oil or coconut oil' }
        ],
        tips: [
          'Let the ingredients sit undisturbed for 1-2 minutes at the end for a crispy golden crust.'
        ]
      },
      {
        name: `Comforting ${p1} Infused Broth & Bowl`,
        description: `A soothing, aromatic warm bowl bringing together ${p1}, ${p2}, and subtle comforting notes for light dining.`,
        cuisine: 'Fusion',
        diet: resolvedDiet,
        difficulty: difficulty !== 'Any' ? difficulty : 'Medium',
        cooking_time_minutes: maxTime !== 'Any' && parseInt(maxTime, 10) <= 35 ? parseInt(maxTime, 10) : 25,
        servings: typeof servings === 'number' ? servings : 2,
        available_ingredients: ingList.slice(0, 3),
        missing_ingredients: ['Water or vegetable broth (2 cups)', 'Salt (1 tsp)', 'Soy sauce or lemon (optional)'],
        ingredients: [
          ...ingList.slice(0, 3).map(item => ({ name: cap(item), quantity: '1 portion' })),
          { name: 'Water / Broth', quantity: '2 cups' },
          { name: 'Salt & Seasoning', quantity: 'to taste' }
        ],
        steps: [
          `Bring 2 cups of water or broth to a gentle simmer in a saucepan.`,
          `Chop ${p1} and ${p2} into fine pieces and add to the simmering liquid.`,
          `Allow the flavors to infuse on low heat for 12-15 minutes.`,
          `Adjust seasoning with a pinch of salt and cracked pepper.`,
          `Ladle into soup bowls and serve warm.`
        ],
        substitutions: [
          { original: 'Vegetable broth', replacement: 'Water with a pinch of turmeric and cumin' }
        ],
        tips: [
          'Simmer on gentle heat with a tight lid to lock in volatile aromas.'
        ]
      }
    ]
  };
}

/**
 * Calls the Google Gemini API using @google/generative-ai
 */
async function callGemini(promptText, apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  // Try gemini-1.5-flash as default fast and high-quality model, fallback to gemini-2.0-flash or gemini-pro
  const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 2500,
      responseMimeType: 'application/json'
    }
  });

  const result = await model.generateContent(promptText);
  const response = await result.response;
  const rawText = response.text();
  return rawText;
}

/**
 * Main LLM caller function
 */
async function generateRecipesFromLLM(promptText, userIngredients = [], preferences = {}) {
  const isDemoMode = process.env.DEMO_MODE === 'true';
  const geminiKey = process.env.GEMINI_API_KEY || process.env.LLM_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  // If in DEMO_MODE or if no API key is provided, use demo mode with a helpful log
  if (isDemoMode || (!geminiKey && !openaiKey)) {
    console.log(`[llmService] Using DEMO_MODE for recipe generation (${isDemoMode ? 'DEMO_MODE=true' : 'No API Key configured'}).`);
    // Artificial small delay to simulate realistic AI generation feel
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      rawText: JSON.stringify(generateDemoRecipes(userIngredients, preferences)),
      isDemo: true
    };
  }

  // Real LLM Call
  try {
    let rawText = '';
    if (geminiKey) {
      console.log('[llmService] Calling Google Gemini API...');
      rawText = await callGemini(promptText, geminiKey);
    } else if (openaiKey) {
      console.log('[llmService] Calling OpenAI API endpoint...');
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are an expert recipe generation assistant. Return only valid JSON.' },
            { role: 'user', content: promptText }
          ],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `OpenAI API returned HTTP ${response.status}`);
      }

      const data = await response.json();
      rawText = data.choices?.[0]?.message?.content || '';
    }

    return {
      rawText,
      isDemo: false
    };
  } catch (error) {
    console.error('[llmService] Real LLM call failed:', error.message);
    throw error;
  }
}

module.exports = {
  generateRecipesFromLLM,
  extractJsonString,
  generateDemoRecipes
};
