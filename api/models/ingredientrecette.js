'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {

  var IngredientRecette = sequelize.define('IngredientRecette', {
    id_ingredient: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Ingredient',
        key: 'id'
      }
    },
    id_recette: { type :DataTypes.INTEGER,
      references: {
        model: 'Recette',
        key: 'id'
      }
    },
    qte: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        models.Recette.belongsToMany(models.Ingredient, {
          through: models.IngredientRecette,
          foreignKey: 'id_recette',
          otherKey: 'id_ingredient' 
        }),
        models.Ingredient.belongsToMany(models.Recette, {
          through: models.IngredientRecette,
          foreignKey: 'id_ingredient',
          otherKey: 'id_recette' 
        })
        models.IngredientRecette.belongsTo(models.Ingredient, {
          foreignKey: 'id_ingredient',
          as: 'ingredient',
        });
    
        models.IngredientRecette.belongsTo(models.Recette, {
          foreignKey: 'id_recette',
          as: 'recette',
        });
      }
    }
  });
  return IngredientRecette;
};