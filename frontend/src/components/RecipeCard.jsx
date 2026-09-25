import React from 'react';
import { Clock, Users, CheckCircle2, AlertCircle, ArrowRight, Heart, Utensils } from 'lucide-react';

export default function RecipeCard({
  recipe,
  onSelect,
  isSaved,
  onToggleSave
}) {
  const isVeg = recipe.diet?.toLowerCase().includes('veg');
  const availableCount = recipe.available_ingredients?.length || 0;
  const missingCount = recipe.missing_ingredients?.length || 0;

  return (
    <div className="recipe-card">
      <div>
        {/* Top Badges & Save Button */}
        <div className="card-top-bar">
          <div className="badge-group">
            <span className={`badge ${isVeg ? 'badge-veg' : 'badge-nonveg'}`}>
              {recipe.diet || 'Any'}
            </span>
            <span className="badge badge-cuisine">
              {recipe.cuisine || 'Fusion'}
            </span>
            <span className="badge badge-difficulty">
              {recipe.difficulty || 'Easy'}
            </span>
          </div>

          <button
            type="button"
            className="chip-remove"
            style={{
              color: isSaved ? '#ef4444' : 'var(--text-muted)',
              padding: '6px',
              background: isSaved ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              borderRadius: '50%'
            }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(recipe);
            }}
            title={isSaved ? 'Remove from saved' : 'Save recipe'}
            aria-label={isSaved ? 'Remove from saved' : 'Save recipe'}
          >
            <Heart size={16} fill={isSaved ? '#ef4444' : 'none'} />
          </button>
        </div>

        {/* Recipe Title & Description */}
        <h3 className="recipe-card-title">{recipe.name}</h3>
        <p className="recipe-card-desc">{recipe.description}</p>

        {/* Cooking Info Stats */}
        <div className="meta-stats">
          <div className="stat-item">
            <Clock size={16} />
            <span>{recipe.cooking_time_minutes || 20} mins</span>
          </div>
          <div className="stat-item">
            <Users size={16} />
            <span>{recipe.servings || 2} servings</span>
          </div>
          <div className="stat-item">
            <Utensils size={16} />
            <span>{recipe.steps?.length || 4} steps</span>
          </div>
        </div>

        {/* Available & Missing Ingredients Overview */}
        <div className="match-overview">
          <div className="match-item available">
            <CheckCircle2 size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span className="match-names">
              <strong>{availableCount} in pantry:</strong> {recipe.available_ingredients?.join(', ') || 'All supplied'}
            </span>
          </div>
          {missingCount > 0 && (
            <div className="match-item missing">
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span className="match-names">
                <strong>{missingCount} pantry extra{missingCount > 1 ? 's' : ''}:</strong> {recipe.missing_ingredients?.join(', ')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* View Full Recipe CTA */}
      <button
        type="button"
        className="btn-card-details"
        onClick={() => onSelect(recipe)}
      >
        <span>View Full Recipe & Steps</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
