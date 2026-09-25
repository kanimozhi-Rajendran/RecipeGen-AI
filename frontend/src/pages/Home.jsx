import React, { useState, useEffect } from 'react';
import {
  ChefHat,
  Sparkles,
  Heart,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Check,
  Flame,
  Info
} from 'lucide-react';
import IngredientInput from '../components/IngredientInput';
import PreferenceForm from '../components/PreferenceForm';
import RecipeCard from '../components/RecipeCard';
import RecipeDetails from '../components/RecipeDetails';
import SavedRecipesModal from '../components/SavedRecipesModal';
import Loading from '../components/Loading';
import { generateRecipesApi, getSampleIngredientsApi, getBackendStatusApi } from '../services/api';

const LOCAL_STORAGE_KEY = 'recipegen_saved_recipes_v1';

export default function Home() {
  const [ingredients, setIngredients] = useState([]);
  const [preferences, setPreferences] = useState({
    diet: 'Any',
    cuisine: 'Any',
    difficulty: 'Easy',
    maxTime: '30',
    servings: '2'
  });

  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isDemoResponse, setIsDemoResponse] = useState(false);

  const [savedRecipes, setSavedRecipes] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [showSavedModal, setShowSavedModal] = useState(false);
  const [sampleOptions, setSampleOptions] = useState([]);
  const [backendStatus, setBackendStatus] = useState(null);

  // Load sample ingredients and backend status on mount
  useEffect(() => {
    getSampleIngredientsApi().then((samples) => {
      if (samples && samples.length > 0) {
        setSampleOptions(samples);
      }
    });

    getBackendStatusApi().then((status) => {
      setBackendStatus(status);
    });
  }, []);

  // Save to localStorage when savedRecipes state updates
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedRecipes));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [savedRecipes]);

  // Ingredient Handlers
  const handleAddIngredient = (newIngredient) => {
    const trimmed = newIngredient.trim().toLowerCase();
    if (!trimmed) return;
    if (!ingredients.includes(trimmed)) {
      setIngredients((prev) => [...prev, trimmed]);
    }
  };

  const handleRemoveIngredient = (index) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearIngredients = () => {
    setIngredients([]);
  };

  const handleSelectSample = (sampleArr) => {
    setIngredients(sampleArr.map((s) => s.toLowerCase().trim()));
  };

  // Preference Handlers
  const handleChangePreference = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // Recipe Generation Handler
  const handleGenerateRecipes = async () => {
    if (ingredients.length === 0) {
      setError('Please add at least one ingredient to generate recipes.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await generateRecipesApi(ingredients, preferences);
      if (data.success && data.recipes) {
        setRecipes(data.recipes);
        setIsDemoResponse(Boolean(data.isDemo));

        // Smooth scroll to results
        setTimeout(() => {
          const resultsElem = document.getElementById('recipe-results-section');
          if (resultsElem) {
            resultsElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      } else {
        throw new Error(data.message || 'Failed to generate recipes');
      }
    } catch (err) {
      console.error('Generation Error:', err);
      setError(err.message || 'An unexpected error occurred while communicating with the AI service.');
    } finally {
      setIsLoading(false);
    }
  };

  // Save / Bookmark Handlers
  const isRecipeSaved = (recipe) => {
    return savedRecipes.some((r) => (r.id && r.id === recipe.id) || r.name === recipe.name);
  };

  const handleToggleSave = (recipe) => {
    setSavedRecipes((prev) => {
      const exists = prev.some((r) => (r.id && r.id === recipe.id) || r.name === recipe.name);
      if (exists) {
        return prev.filter((r) => (r.id ? r.id !== recipe.id : r.name !== recipe.name));
      } else {
        return [recipe, ...prev];
      }
    });
  };

  const handleRemoveSaved = (recipeIdOrName) => {
    setSavedRecipes((prev) => prev.filter((r) => (r.id ? r.id !== recipeIdOrName : r.name !== recipeIdOrName)));
  };

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <header className="navbar">
        <div className="brand-logo">
          <div className="logo-icon">
            <ChefHat size={24} />
          </div>
          <div className="brand-title">
            RecipeGen <span>AI</span>
          </div>
        </div>

        <div className="nav-actions">
          <button
            type="button"
            className="btn-secondary-pill"
            onClick={() => setShowSavedModal(true)}
            aria-label="View saved recipes"
          >
            <Heart size={16} fill={savedRecipes.length > 0 ? '#ef4444' : 'none'} color={savedRecipes.length > 0 ? '#ef4444' : 'currentColor'} />
            <span>Saved Recipes ({savedRecipes.length})</span>
          </button>
        </div>
      </header>

      {/* Demo Mode / AI Notice */}
      {backendStatus && backendStatus.demoMode && (
        <div className="demo-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Info size={18} />
            <span>
              <strong>Demo Simulator Active:</strong> The backend is currently running in test mode without an API key. Recipes are generated dynamically based on your exact pantry items.
            </span>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge">
          <Sparkles size={14} />
          AI-Powered Culinary Assistant
        </div>
        <h1 className="hero-title">
          Turn Your Ingredients Into <span className="gradient-text">Delicious Recipes</span>
        </h1>
        <p className="hero-subtitle">
          Tell us what you have. AI will create recipes for you.
        </p>
      </section>

      {/* Interactive Generator Grid */}
      <main className="generator-layout">
        {/* Left Column: Ingredient Input */}
        <IngredientInput
          ingredients={ingredients}
          onAddIngredient={handleAddIngredient}
          onRemoveIngredient={handleRemoveIngredient}
          onClearIngredients={handleClearIngredients}
          onSelectSample={handleSelectSample}
          sampleOptions={sampleOptions}
        />

        {/* Right Column: Preferences & Generate CTA */}
        <PreferenceForm
          preferences={preferences}
          onChangePreference={handleChangePreference}
          onGenerate={handleGenerateRecipes}
          disabled={ingredients.length === 0}
          isLoading={isLoading}
        />
      </main>

      {/* Loading Animation */}
      {isLoading && <Loading />}

      {/* Error Message */}
      {error && !isLoading && (
        <div className="error-card" role="alert">
          <AlertTriangle size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4>Unable to Generate Recipes</h4>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Recipe Results Section */}
      {recipes.length > 0 && !isLoading && (
        <section id="recipe-results-section">
          <div className="results-header">
            <div>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
                Generated Recipes ({recipes.length})
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Handcrafted for your ingredients: {ingredients.slice(0, 5).join(', ')}
                {ingredients.length > 5 ? '...' : ''}
              </p>
            </div>
            <button
              type="button"
              className="btn-secondary-pill"
              onClick={handleGenerateRecipes}
              title="Regenerate new recipe options"
            >
              <RefreshCw size={15} />
              <span>Regenerate</span>
            </button>
          </div>

          <div className="recipes-grid">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id || recipe.name}
                recipe={recipe}
                onSelect={(rec) => setSelectedRecipe(rec)}
                isSaved={isRecipeSaved(recipe)}
                onToggleSave={handleToggleSave}
              />
            ))}
          </div>
        </section>
      )}

      {/* Recipe Details Modal */}
      {selectedRecipe && (
        <RecipeDetails
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          isSaved={isRecipeSaved(selectedRecipe)}
          onToggleSave={handleToggleSave}
          onGenerateAgain={handleGenerateRecipes}
        />
      )}

      {/* Saved Recipes Modal */}
      {showSavedModal && (
        <SavedRecipesModal
          savedRecipes={savedRecipes}
          onClose={() => setShowSavedModal(false)}
          onSelectRecipe={(rec) => setSelectedRecipe(rec)}
          onRemoveRecipe={handleRemoveSaved}
        />
      )}
    </div>
  );
}
