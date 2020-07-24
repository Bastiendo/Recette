'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ingredient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Ingredient.belongToMany(models.Recette, {
        through: 'IngredientRecette',
        as: 'recette',
        foreignKey: 'id_ingredient',
        otherKey: 'id_recette' 
      })
    }
  };
  Ingredient.init({
    nom: DataTypes.STRING,
    unite: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Ingredient',
  });
  return Ingredient;
};