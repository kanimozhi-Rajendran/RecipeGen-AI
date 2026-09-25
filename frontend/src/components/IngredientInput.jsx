import React, { useState } from 'react';
import { Plus, X, Trash2, Sparkles, Refrigerator } from 'lucide-react';

export default function IngredientInput({
  ingredients,
  onAddIngredient,
  onRemoveIngredient,
  onClearIngredients,
  onSelectSample,
  sampleOptions = []
}) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (!inputValue.trim()) return;

    // Support comma-separated input (e.g. "tomato, onion, egg")
    const parts = inputValue
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    parts.forEach(part => {
      onAddIngredient(part);
    });

    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="glass-card">
      <div className="section-header">
        <h2 className="section-title">
          <Refrigerator size={22} />
          Your Pantry Ingredients
        </h2>
        {ingredients.length > 0 && (
          <button
            type="button"
            className="btn-clear"
            onClick={onClearIngredients}
            title="Clear all ingredients"
            aria-label="Clear all ingredients"
          >
            <Trash2 size={15} />
            Clear All
          </button>
        )}
      </div>

      <div className="input-wrapper">
        <input
          id="ingredient-input-field"
          type="text"
          className="ingredient-text-input"
          placeholder="Enter ingredients: tomato, onion, egg, rice..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        <button
          id="add-ingredient-btn"
          type="button"
          className="btn-add"
          onClick={handleAdd}
          disabled={!inputValue.trim()}
        >
          <Plus size={18} />
          Add
        </button>
      </div>

      <div className="chips-container" aria-label="Selected ingredients">
        {ingredients.length === 0 ? (
          <div className="chip-empty-placeholder">
            No ingredients added yet. Type an ingredient above or pick a sample below!
          </div>
        ) : (
          ingredients.map((item, index) => (
            <span key={`${item}-${index}`} className="chip">
              {item}
              <button
                type="button"
                className="chip-remove"
                onClick={() => onRemoveIngredient(index)}
                aria-label={`Remove ${item}`}
                title={`Remove ${item}`}
              >
                <X size={14} />
              </button>
            </span>
          ))
        )}
      </div>

      <div className="chips-footer">
        <span>{ingredients.length} item{ingredients.length === 1 ? '' : 's'} in pantry</span>
        <span>Press <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 5px', borderRadius: '4px' }}>Enter</kbd> or comma to add</span>
      </div>

      {sampleOptions.length > 0 && (
        <div className="quick-samples">
          <div className="quick-samples-title">Quick Fill Examples</div>
          <div className="sample-pills">
            {sampleOptions.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                className="sample-pill-btn"
                onClick={() => onSelectSample(sample)}
              >
                <Sparkles size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                {sample.slice(0, 3).join(', ')}...
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
