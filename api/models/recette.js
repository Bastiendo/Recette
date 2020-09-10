'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  var Recette = sequelize.define('Recette', {
    nom: DataTypes.STRING,
    description: DataTypes.STRING,
    etape: DataTypes.STRING,
    like: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        
        models.Recette.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        })
      }
    }
  });
  return Recette;
};