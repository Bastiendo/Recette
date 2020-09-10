var models = require('../models');
var jwtUtils = require('../utils/jwt.utils');
var asyncLib = require('async');

module.exports = {
    createIngredient: function(req, res) {
        var authorization = req.headers['authorization'];
        var userId = jwtUtils.getUserId(authorization);

        var nom = req.body.nom;
        var unite = req.body.unite;

        if(nom == null)
            return res.status(400).json({'erreur':'le nom est vide'})

        asyncLib.waterfall([
            function(done) {
                models.Ingredient.create({
                    nom: nom,
                    unite: unite ? unite : ""
                })
                .then(function(newIngredient) {
                    done(null, newIngredient)
                })
            }
        ],function(newIngredient) {
            return res.status(201).json({message : "l'ingredient à été crée", ingredient : newIngredient })

        })
    },
    listIngredient: function(req, res) {
        console.log("* ** *** on récupère la liste des ingredients *** ** *")
        models.Ingredient.findAll({

        }).then(function(ingredient) {
            if(ingredient)
                return res.status(200).json({"ingredient":ingredient, "message":"ingrédients récupérés"})
            else
                return res.status(404).json({"message":"ingrédients introuvable"})  
        }).catch(function(err) {
            console.log(err);
            return res.status(500).json({"erreur" : "récupération des ingredient impossible"})
        })
    },

    updateIngredient: function(req, res) {
        console.log("* ** *** on update l'ingredient *** ** *");
        var id = req.body.id;

        // on cherche l'ingredient
        models.Ingredient.findOne({
            where : {id : id}
        })
        .then(function(ingredient) {
            if(ingredient) {
                ingredient.update({
                    nom : req.body.nom ? req.body.nom : "",
                    unite : req.body.unite ? req.body.unite : ""
                })
                .then(function(newIngredient) {
                    return res.status(201).json({message : "l'ingredient à été bien modifié", ingredient : newIngredient })
                })
                .catch(function(err) {
                    return res.status(500).json({"message" : "modification impossible"})
                })
            }
        })
        .catch(function(err) {
            return res.status(404).json({"message" : "ingredient introuvable"})
        })
    },

    deleteIngredient: function(req, res) {

        var id = req.body.id;
        models.Ingredient.destroy({
            where : {id : id}
        })
        .then(function() {
            return res.status(201).json({"message" : "l'ingredient a été supprimé"})
        })
        .catch(function(err) {
            return res.status(404).json("message" : "impossible de supprimé l'ingrédient")
        })
    }
    
}