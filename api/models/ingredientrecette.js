'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class IngredientRecette extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  IngredientRecette.init({
    id_ingredient: DataTypes.INTEGER,
    id_recette: DataTypes.INTEGER,
    qte: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'IngredientRecette',
  });
  return IngredientRecette;
};