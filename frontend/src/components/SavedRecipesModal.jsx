import React from 'react';
import { X, Trash2, Heart, ArrowRight, Utensils } from 'lucide-react';

export default function SavedRecipesModal({
  savedRecipes,
  onClose,
  onSelectRecipe,
  onRemoveRecipe
}) {
  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Heart size={22} style={{ color: '#ef4444' }} fill="#ef4444" />
            <h2>Saved Recipes ({savedRecipes.length})</h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close saved recipes"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {savedRecipes.length === 0 ? (
            <div className="empty-state">
              <Utensils size={40} />
              <p>You haven't saved any recipes yet.</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Click the heart icon on any generated recipe card to save it for quick access!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {savedRecipes.map((recipe) => (
                <div
                  key={recipe.id || recipe.name}
                  style={{
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: '0.2rem' }}>{recipe.name}</h4>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                      {recipe.cuisine} • {recipe.diet} • {recipe.cooking_time_minutes} mins
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn-modal-action btn-modal-primary"
                      style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
                      onClick={() => {
                        onSelectRecipe(recipe);
                        onClose();
                      }}
                    >
                      <span>View</span>
                      <ArrowRight size={14} />
                    </button>
                    <button
                      type="button"
                      className="chip-remove"
                      style={{
                        padding: '8px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#f87171',
                        borderRadius: 'var(--radius-sm)'
                      }}
                      onClick={() => onRemoveRecipe(recipe.id || recipe.name)}
                      title="Delete recipe"
                      aria-label="Delete recipe"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
