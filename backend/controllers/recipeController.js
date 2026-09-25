/**
 * Recipe Controller: Handles incoming HTTP requests for recipe generation and samples.
 */

const fs = require('fs');
const path = require('path');
const promptService = require('../services/promptService');
const llmService = require('../services/llmService');
const recipeValidator = require('../utils/recipeValidator');

/**
 * POST /api/recipes/generate
 * Generates structured recipes using LLM or demo fallback.
 */
async function generateRecipes(req, res) {
  try {
    const { ingredients, preferences } = req.body;

    // Validate Ingredients Input
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one ingredient to generate recipes.'
      });
    }

    // Filter out empty strings
    const sanitizedIngredients = ingredients
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter((item) => item.length > 0);

    if (sanitizedIngredients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Ingredient list cannot be empty or contain only whitespace.'
      });
    }

    // Sanitize Preferences
    const sanitizedPreferences = {
      diet: preferences?.diet || 'Any',
      cuisine: preferences?.cuisine || 'Any',
      difficulty: preferences?.difficulty || 'Any',
      maxTime: preferences?.maxTime || 'Any',
      servings: preferences?.servings || 2
    };

    console.log(`[recipeController] Generating recipes for ${sanitizedIngredients.length} ingredients: [${sanitizedIngredients.join(', ')}]`);

    // 1. Build prompt
    const prompt = promptService.buildRecipePrompt(sanitizedIngredients, sanitizedPreferences);

    // 2. Call LLM Service
    let llmResult;
    try {
      llmResult = await llmService.generateRecipesFromLLM(
        prompt,
        sanitizedIngredients,
        sanitizedPreferences
      );
    } catch (llmErr) {
      console.error('[recipeController] LLM Generation error:', llmErr);
      return res.status(502).json({
        success: false,
        message: `Failed to communicate with the AI model: ${llmErr.message || 'Service unavailable'}. Please check your API key or enable DEMO_MODE.`
      });
    }

    // 3. Parse JSON safely
    const jsonString = llmService.extractJsonString(llmResult.rawText);
    let parsedData;

    try {
      parsedData = JSON.parse(jsonString);
    } catch (parseErr) {
      console.error('[recipeController] JSON parse error on raw output:', llmResult.rawText);
      return res.status(500).json({
        success: false,
        message: 'The AI model generated an invalid format. Please try generating again.'
      });
    }

    // 4. Validate and Sanitize Schema
    const validationResult = recipeValidator.validateAndSanitizeRecipes(
      parsedData,
      sanitizedIngredients
    );

    if (!validationResult.isValid) {
      return res.status(500).json({
        success: false,
        message: `Recipe validation failed: ${validationResult.error}`
      });
    }

    // 5. Send Successful Response
    return res.status(200).json({
      success: true,
      count: validationResult.recipes.length,
      isDemo: llmResult.isDemo,
      recipes: validationResult.recipes
    });

  } catch (error) {
    console.error('[recipeController] Unexpected error:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected internal error occurred while generating recipes.'
    });
  }
}

/**
 * GET /api/recipes/samples
 * Returns curated sample ingredient lists for quick-fill buttons.
 */
function getSampleIngredients(req, res) {
  try {
    const sampleFilePath = path.join(__dirname, '../../data/sample_ingredients.json');
    if (fs.existsSync(sampleFilePath)) {
      const data = JSON.parse(fs.readFileSync(sampleFilePath, 'utf8'));
      return res.status(200).json({ success: true, samples: data });
    }
    return res.status(200).json({
      success: true,
      samples: [
        ['tomato', 'onion', 'egg', 'rice', 'green chilli'],
        ['rice', 'carrot', 'peas', 'onion', 'cumin seeds'],
        ['potato', 'onion', 'chilli', 'coriander', 'wheat flour'],
        ['bread', 'egg', 'cheese', 'butter', 'black pepper']
      ]
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Could not load sample ingredients.' });
  }
}

/**
 * GET /api/recipes/status
 * Health & Configuration check
 */
function getStatus(req, res) {
  const isDemo = process.env.DEMO_MODE === 'true';
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY || process.env.LLM_API_KEY);
  const hasOpenaiKey = Boolean(process.env.OPENAI_API_KEY);

  return res.status(200).json({
    success: true,
    status: 'online',
    demoMode: isDemo,
    aiProvider: hasGeminiKey ? 'Google Gemini' : (hasOpenaiKey ? 'OpenAI' : 'Demo Simulator'),
    timestamp: new Date().toISOString()
  });
}

module.exports = {
  generateRecipes,
  getSampleIngredients,
  getStatus
};
