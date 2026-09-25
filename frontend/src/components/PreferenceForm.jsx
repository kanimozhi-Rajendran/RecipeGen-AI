import React from 'react';
import { SlidersHorizontal, Sparkles, Utensils, Globe, Gauge, Clock, Users } from 'lucide-react';

export default function PreferenceForm({
  preferences,
  onChangePreference,
  onGenerate,
  disabled,
  isLoading
}) {
  return (
    <div className="glass-card">
      <div className="section-header">
        <h2 className="section-title">
          <SlidersHorizontal size={22} />
          Cooking Preferences
        </h2>
      </div>

      <div className="preferences-grid">
        {/* Diet */}
        <div className="pref-group">
          <label className="pref-label" htmlFor="pref-diet">
            <Utensils size={14} />
            Dietary Preference
          </label>
          <select
            id="pref-diet"
            className="pref-select"
            value={preferences.diet}
            onChange={(e) => onChangePreference('diet', e.target.value)}
          >
            <option value="Any">Any Diet</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Non-Vegetarian">Non-Vegetarian</option>
            <option value="Vegan">Vegan</option>
          </select>
        </div>

        {/* Cuisine */}
        <div className="pref-group">
          <label className="pref-label" htmlFor="pref-cuisine">
            <Globe size={14} />
            Cuisine
          </label>
          <select
            id="pref-cuisine"
            className="pref-select"
            value={preferences.cuisine}
            onChange={(e) => onChangePreference('cuisine', e.target.value)}
          >
            <option value="Any">Any Cuisine</option>
            <option value="Indian">Indian (General)</option>
            <option value="South Indian">South Indian</option>
            <option value="North Indian">North Indian</option>
            <option value="Italian">Italian</option>
            <option value="Chinese">Chinese</option>
            <option value="Mexican">Mexican</option>
          </select>
        </div>

        {/* Difficulty */}
        <div className="pref-group">
          <label className="pref-label" htmlFor="pref-difficulty">
            <Gauge size={14} />
            Skill Level / Difficulty
          </label>
          <select
            id="pref-difficulty"
            className="pref-select"
            value={preferences.difficulty}
            onChange={(e) => onChangePreference('difficulty', e.target.value)}
          >
            <option value="Any">Any Difficulty</option>
            <option value="Easy">Easy (Beginner friendly)</option>
            <option value="Medium">Medium (Standard cooking)</option>
            <option value="Hard">Hard (Gourmet / Advanced)</option>
          </select>
        </div>

        {/* Max Time */}
        <div className="pref-group">
          <label className="pref-label" htmlFor="pref-time">
            <Clock size={14} />
            Max Cooking Time
          </label>
          <select
            id="pref-time"
            className="pref-select"
            value={preferences.maxTime}
            onChange={(e) => onChangePreference('maxTime', e.target.value)}
          >
            <option value="Any">Any Time (Flexible)</option>
            <option value="15">15 Minutes (Express)</option>
            <option value="30">30 Minutes (Quick)</option>
            <option value="45">45 Minutes</option>
            <option value="60">60+ Minutes (Slow cook)</option>
          </select>
        </div>

        {/* Servings */}
        <div className="pref-group" style={{ gridColumn: '1 / -1' }}>
          <label className="pref-label" htmlFor="pref-servings">
            <Users size={14} />
            Servings
          </label>
          <select
            id="pref-servings"
            className="pref-select"
            value={preferences.servings}
            onChange={(e) => onChangePreference('servings', e.target.value)}
          >
            <option value="1">1 Person (Solo meal)</option>
            <option value="2">2 People (Couples / Duo)</option>
            <option value="4">4 People (Family size)</option>
            <option value="6+">6+ People (Large gathering)</option>
          </select>
        </div>

        {/* Generate CTA Button */}
        <div className="cta-container">
          <button
            id="generate-recipes-btn"
            type="button"
            className="btn-generate"
            onClick={onGenerate}
            disabled={disabled || isLoading}
          >
            <Sparkles size={20} />
            {isLoading ? 'Generating Recipes...' : 'Generate Recipes with AI'}
          </button>
        </div>
      </div>
    </div>
  );
}
