var express = require('express');
var userController = require('./routes/UserController');
var recetteController = require('./routes/RecetteController');
var likeController = require('./routes/LikeController');
const IngredientController = require('./routes/IngredientController');

exports.router = (function() {

    var apiRouter = express.Router();

    apiRouter.route('/users/register/').post(userController.register);
    apiRouter.route('/users/login/').post(userController.login);
    apiRouter.route('/users/me/').get(userController.getUserProfil);
    apiRouter.route('/users/me').put(userController.updateUserProfile)

    apiRouter.route('/recettes').post(recetteController.createRecette)
    apiRouter.route('/recettes/').get(recetteController.listRecette);
    apiRouter.route('/recettes/').put(recetteController.updateRecette)
    apiRouter.route('/recettes/:recetteId/like/').post(likeController.likeRecette);
    apiRouter.route('/recettes/:recetteId/dislike').post(likeController.dislikeRecette);

    apiRouter.route('/ingredients/').get(IngredientController.listIngredient);
    apiRouter.route('/ingredients/').post(IngredientController.createIngredient)
    apiRouter.route('/ingredients/').put(IngredientController.updateIngredient)
    apiRouter.route('/ingredients').delete(IngredientController.deleteIngredient)

    return apiRouter;
})();