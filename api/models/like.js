'use strict';
module.exports = (sequelize, DataTypes) => {
  var Like = sequelize.define('Like', {
    recetteId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Recette',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    },
  }, {});
  Like.associate = function(models) {
    // associations can be defined here

    models.User.belongsToMany(models.Recette, {
      through: models.Like,
      foreignKey: 'userId',
      otherKey: 'recetteId',
    });

    models.Recette.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'recetteId',
      otherKey: 'userId',
    });

    models.Like.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    models.Like.belongsTo(models.Recette, {
      foreignKey: 'recetteId',
      as: 'recette',
    });
  };
  return Like;
};