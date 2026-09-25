/**
 * Recipe API Routes
 */

const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

// POST /api/recipes/generate - Generate recipes based on ingredients and preferences
router.post('/generate', recipeController.generateRecipes);

// GET /api/recipes/samples - Get preset sample ingredient combinations
router.get('/samples', recipeController.getSampleIngredients);

// GET /api/recipes/status - Get backend & AI engine status
router.get('/status', recipeController.getStatus);

module.exports = router;
