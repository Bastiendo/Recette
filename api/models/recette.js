'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Recette extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Recette.belongToMany(models.Ingredient, {
        through: 'IngredientRecette',
        as: 'ingredient',
        foreignKey: 'id_recette',
        otherKey: 'id_ingredient' 
      })
    }
  };
  Recette.init({
    nom: DataTypes.STRING,
    description: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Recette',
  });
  return Recette;
};