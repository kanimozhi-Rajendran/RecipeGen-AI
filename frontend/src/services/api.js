/**
 * API Service for interacting with Recipe Generator backend.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/recipes';

/**
 * Sends available ingredients and user preferences to generate structured recipes.
 */
export async function generateRecipesApi(ingredients, preferences) {
  try {
    const response = await fetch(`${API_BASE}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ingredients,
        preferences,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `Server error: ${response.status} ${response.statusText}`);
    }

    return data;
  } catch (err) {
    console.error('[API error]', err);
    throw err;
  }
}

/**
 * Fetches sample ingredient sets for quick-fill.
 */
export async function getSampleIngredientsApi() {
  try {
    const response = await fetch(`${API_BASE}/samples`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.samples || [];
  } catch (err) {
    console.warn('[API error] Could not fetch samples, using fallback.', err);
    return [
      ['tomato', 'onion', 'egg', 'rice', 'green chilli'],
      ['rice', 'carrot', 'peas', 'onion', 'cumin seeds'],
      ['potato', 'onion', 'chilli', 'coriander', 'wheat flour'],
      ['bread', 'egg', 'cheese', 'butter', 'black pepper']
    ];
  }
}

/**
 * Checks backend health and status.
 */
export async function getBackendStatusApi() {
  try {
    const response = await fetch(`${API_BASE}/status`);
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    return null;
  }
}
