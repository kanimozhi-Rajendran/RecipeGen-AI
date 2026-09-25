/**
 * Validates and sanitizes recipe data returned from the LLM or demo generator.
 * Ensures the structure strictly conforms to the expected schema.
 */

function validateAndSanitizeRecipes(rawOutput, requestedIngredients = []) {
  if (!rawOutput) {
    return {
      isValid: false,
      recipes: [],
      error: 'Empty LLM response received'
    };
  }

  let recipesArray = [];

  // Check if output has a recipes property or is directly an array
  if (Array.isArray(rawOutput.recipes)) {
    recipesArray = rawOutput.recipes;
  } else if (Array.isArray(rawOutput)) {
    recipesArray = rawOutput;
  } else if (typeof rawOutput === 'object' && rawOutput.name && (rawOutput.steps || rawOutput.ingredients)) {
    recipesArray = [rawOutput];
  } else {
    return {
      isValid: false,
      recipes: [],
      error: 'LLM response does not contain a valid recipes array'
    };
  }

  if (recipesArray.length === 0) {
    return {
      isValid: false,
      recipes: [],
      error: 'No recipes were generated in the response'
    };
  }

  const sanitized = recipesArray.map((r, index) => {
    // Sanitize name
    const name = (typeof r.name === 'string' && r.name.trim()) 
      ? r.name.trim() 
      : `Custom Recipe ${index + 1}`;

    // Sanitize description
    const description = (typeof r.description === 'string' && r.description.trim())
      ? r.description.trim()
      : 'A hearty and flavorful dish tailored to your selected pantry ingredients.';

    // Sanitize metadata
    const cuisine = (typeof r.cuisine === 'string' && r.cuisine.trim()) ? r.cuisine.trim() : 'Fusion';
    const diet = (typeof r.diet === 'string' && r.diet.trim()) ? r.diet.trim() : 'Any';
    const difficulty = (typeof r.difficulty === 'string' && ['Easy', 'Medium', 'Hard'].includes(r.difficulty.trim())) 
      ? r.difficulty.trim() 
      : 'Easy';

    let cooking_time_minutes = parseInt(r.cooking_time_minutes, 10);
    if (isNaN(cooking_time_minutes) || cooking_time_minutes <= 0) {
      cooking_time_minutes = 25;
    }

    let servings = r.servings;
    if (typeof servings === 'string') {
      servings = parseInt(servings, 10) || 2;
    } else if (typeof servings !== 'number' || servings <= 0) {
      servings = 2;
    }

    // Sanitize available & missing ingredients
    const available_ingredients = Array.isArray(r.available_ingredients)
      ? r.available_ingredients.map(i => String(i).trim()).filter(Boolean)
      : requestedIngredients;

    const missing_ingredients = Array.isArray(r.missing_ingredients)
      ? r.missing_ingredients.map(i => String(i).trim()).filter(Boolean)
      : ['salt', 'cooking oil'];

    // Sanitize ingredients list
    let ingredients = [];
    if (Array.isArray(r.ingredients)) {
      ingredients = r.ingredients.map(ing => {
        if (typeof ing === 'string') {
          return { name: ing.trim(), quantity: 'to taste' };
        } else if (typeof ing === 'object' && ing !== null) {
          return {
            name: String(ing.name || ing.ingredient || 'Ingredient').trim(),
            quantity: String(ing.quantity || ing.amount || 'as needed').trim()
          };
        }
        return { name: 'Pantry item', quantity: 'as needed' };
      }).filter(ing => Boolean(ing.name));
    }

    if (ingredients.length === 0) {
      ingredients = available_ingredients.map(ing => ({ name: ing, quantity: 'as available' }));
    }

    // Sanitize steps / instructions
    let steps = [];
    if (Array.isArray(r.steps)) {
      steps = r.steps.map(s => String(s).trim()).filter(Boolean);
    } else if (typeof r.steps === 'string') {
      steps = r.steps.split('\n').map(s => s.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);
    }

    if (steps.length === 0) {
      steps = [
        'Prep all available ingredients by washing and chopping finely.',
        'Heat oil in a pan over medium heat and sauté the aromatics.',
        'Add remaining ingredients, season to taste, and simmer until cooked through.',
        'Serve hot and enjoy fresh.'
      ];
    }

    // Sanitize substitutions
    let substitutions = [];
    if (Array.isArray(r.substitutions)) {
      substitutions = r.substitutions.map(sub => {
        if (typeof sub === 'object' && sub !== null) {
          return {
            original: String(sub.original || sub.from || 'Ingredient').trim(),
            replacement: String(sub.replacement || sub.to || sub.alternative || 'Alternative').trim()
          };
        }
        return null;
      }).filter(Boolean);
    }

    // Sanitize tips
    let tips = [];
    if (Array.isArray(r.tips)) {
      tips = r.tips.map(t => String(t).trim()).filter(Boolean);
    } else if (typeof r.tips === 'string' && r.tips.trim()) {
      tips = [r.tips.trim()];
    }

    if (tips.length === 0) {
      tips = ['Taste and adjust seasoning before serving for the best flavor balance.'];
    }

    return {
      id: `recipe-${index + 1}-${Date.now().toString(36)}`,
      name,
      description,
      cuisine,
      diet,
      difficulty,
      cooking_time_minutes,
      servings,
      available_ingredients,
      missing_ingredients,
      ingredients,
      steps,
      substitutions,
      tips
    };
  });

  return {
    isValid: true,
    recipes: sanitized,
    error: null
  };
}

module.exports = {
  validateAndSanitizeRecipes
};
