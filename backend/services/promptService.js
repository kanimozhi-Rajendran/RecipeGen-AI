/**
 * Prompt Service: Constructs structured and dynamic prompts for LLM recipe generation.
 */

function buildRecipePrompt(ingredients = [], preferences = {}) {
  const {
    diet = 'Any',
    cuisine = 'Any',
    difficulty = 'Any',
    maxTime = 'Any',
    servings = 2
  } = preferences;

  const ingredientListStr = ingredients
    .map((item) => `- ${String(item).trim()}`)
    .join('\n');

  return `You are an expert recipe generation assistant. Generate practical recipes using the user's available ingredients. Prefer recipes that maximize the use of available ingredients. Clearly identify ingredients that are missing. Do not claim an ingredient is available if the user did not provide it. Provide realistic cooking instructions. Return only valid JSON matching the requested schema.

### USER INPUTS:
- Available Ingredients:
${ingredientListStr}

### USER PREFERENCES:
- Diet Preference: ${diet}
- Cuisine Preference: ${cuisine}
- Difficulty Level: ${difficulty}
- Maximum Cooking Time: ${maxTime === 'Any' ? 'Flexible' : `${maxTime} minutes`}
- Desired Servings: ${servings}

### INSTRUCTIONS:
1. Generate exactly 3 distinct, creative, and delicious recipe options that prominently utilize the user's available ingredients.
2. In 'available_ingredients', list only the items from the user's provided list that this specific recipe uses.
3. In 'missing_ingredients', list any common pantry essentials or extra items (like cooking oil, salt, spices, or garnish) needed for the recipe that the user didn't explicitly specify. Keep missing ingredients minimal and realistic.
4. In 'ingredients', provide detailed quantities for both available and missing items.
5. In 'steps', provide clear, chronological step-by-step cooking instructions.
6. In 'substitutions', provide smart culinary ingredient substitutions.
7. In 'tips', provide helpful cooking advice, heat control tips, or serving suggestions.
8. Strictly follow the user's diet, cuisine, difficulty, and cooking time constraints if specified.
9. Return ONLY a single raw JSON object matching the schema below. Do not wrap the JSON in Markdown code blocks (\`\`\`json ... \`\`\`), do not output conversational text, and do not add preamble or postscript.

### REQUIRED JSON SCHEMA:
{
  "recipes": [
    {
      "name": "Recipe name",
      "description": "Appetizing 1-2 sentence description",
      "cuisine": "Cuisine type",
      "diet": "Vegetarian | Non-Vegetarian | Vegan",
      "difficulty": "Easy | Medium | Hard",
      "cooking_time_minutes": 25,
      "servings": ${typeof servings === 'number' ? servings : 2},
      "available_ingredients": ["ingredient1", "ingredient2"],
      "missing_ingredients": ["salt", "oil"],
      "ingredients": [
        {
          "name": "ingredient1",
          "quantity": "2 units / 100g"
        }
      ],
      "steps": [
        "Step 1 instruction",
        "Step 2 instruction"
      ],
      "substitutions": [
        {
          "original": "ingredient",
          "replacement": "alternative"
        }
      ],
      "tips": [
        "Pro chef cooking tip"
      ]
    }
  ]
}`;
}

module.exports = {
  buildRecipePrompt
};
