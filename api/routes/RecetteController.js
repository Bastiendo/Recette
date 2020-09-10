var models = require('../models');
var jwtUtils = require('../utils/jwt.utils');
var asyncLib = require('async');
const { listIngredient } = require('./IngredientController');

module.exports = {
    createRecette : function(req, res) {
        var authorization = req.headers['authorization'];
        var userId = jwtUtils.getUserId(authorization);
        console.log("on ajoute une recette")
        console.log("user id = " + userId);

        var nom = req.body.nom;
        var description = req.body.description;
        var etape = req.body.etape;
        var ingredients = JSON.parse(req.body.ingredients);

        if(nom == null)
            return res.status(400).json({'erreur':'le nom est vide'})

        asyncLib.waterfall([
            function(done) {
                models.User.findOne({
                    where: {id : userId}
                })
                .then(function(userFound) {
                    done(null, userFound);
                })
                .catch(function(err) {
                    console.log(err);
                    return res.status(500).json({'error': 'impossible de verifier l\'utilisateur'})
                })
            },
            function(userFound, done) {
                if(userFound) {
                    models.Recette.create({
                        nom: nom,
                        description: description ? description : "",
                        etape : etape ? etape : "",
                        like : 0,
                        UserId : userFound.id
                    })
                    .then(function(newRecette) {
                        // fin traitement
                        done(newRecette)
                    })
                    .catch(function(err) {
                        console.log(err);
                        return res.status(500).json({'erreur': 'impossible d\'ajouter la recette'})
                    })
                }
                else {
                    return res.status(404).json({'erreur': 'utilisateur introuvable'})
                }
                
            }
        ],function(newRecette) {
            if(newRecette) {
                // ajouter les nouveaux ingredients
                console.log(ingredients);
                 
                var listIngredientRecette = [];
                
                for(var i = 0; i< ingredients.length; i++) {
                    listIngredientRecette.push({
                        qte : ingredients[i].qte,
                        id_recette : newRecette.id,
                        id_ingredient : ingredients[i].id_ingredient,
                        nom : ingredients[i].nom
                    });
                }

                models.IngredientRecette.bulkCreate(listIngredientRecette).then(function() {
                    return res.status(201).json({'recette':newRecette})
                })
            }
            else {
                return res.status(500).json({'erreur': 'ajout impossible'})
            }
            
        })
    },
    listRecette: function(req, res) {
        console.log("* *** ** liste des recettes *** ** * ")
        var fields = req.query.fields;
        var limit = parseInt(req.query.limit);
        var offset = parseInt(req.query.offset);
        var order = req.query.order;

        models.Recette.findAll({
            // nom:asc, 
            order : [order != null ? order.split(":") : ['nom', 'ASC']],
            // nom,description,...
            attributes : (fields !== "*" && fields != null) ? fields.split(",") : null,
            limit :  (!isNaN(limit)) ? limit : null,
            offset : (!isNaN(offset)) ? offset : null,
            include : [
            // {
            //     model: models.User,
            //     attributes : ['username']
            // },
            {
                model: models.Ingredient,
                attributes: ["nom", "unite", "id"],
                // include: [{
                //     model : models.Recette,
                //     attributes: ["nom", "unite"]
                // }
                //]
            }
        ]
        })
        .then(function(recettes) {
            if(recettes) {
                return res.status(200).json({'recettes': recettes, 'length' : recettes.length})
            }
            else {
                return res.status(404).json({'erreur' : 'recettes introuvable'})
            }
        })
        .catch(function(err) {
            console.log(err);
            return res.status(500).json({"erreur" : "récupération des message impossible"})
        })
    },

    updateRecette : function(req, res) {
        var authorization = req.headers['authorization'];
        var userId = jwtUtils.getUserId(authorization);
        console.log("on met à jour une recette")
        console.log("user id = " + userId);

        var nom = req.body.nom;
        var description = req.body.description;
        var etape = req.body.etape;
        var ingredients = JSON.parse(req.body.ingredients);
        var id = req.body.id;

        models.Recette.findOne({
            where : {id : id}
        })
        .then(function(recette) {
            if(recette) {
                recette.update({
                    description : description,
                    etape : etape,
                    nom : nom
                }).then(function(newRecette) {

                    // récuperer les ingredients de la recette
                models.IngredientRecette.destroy({
                    where : {
                        id_recette : id
                    }
                }).then(function() {
                    // models.IngredientRecette.bulkCreate(ingredients);

                    // ajouter les nouveaux ingredients
                    console.log(ingredients);
                 
                    var listIngredientRecette = [];
                    
                    for(var i = 0; i< ingredients.length; i++) {
                        listIngredientRecette.push({
                            qte : ingredients[i].qte,
                            id_recette : id,
                            id_ingredient : ingredients[i].id_ingredient,
                            nom : ingredients[i].nom
                        });
                    }

                    models.IngredientRecette.bulkCreate(listIngredientRecette).then(function() {
                        return res.status(201).json({'sucesse': 'mise à jour effectué', "recette": newRecette, "ingredientRecette":listIngredientRecette })
                    })

                    // for(var i = 0; i < ingredients.length; i++) {
                    //     console.log(ingredients[i]);
                    //     models.IngredientRecette.create({
                    //         qte : ingredients[i].qte,
                    //         id_recette : id,
                    //         id_ingredient : ingredients[i].id_ingredient
                    //     }).then(function(newIngredient) {
                    //         console.log("i = " + i + " taille " + ingredients.length )
                    //         if(newIngredient) {
                    //             console.log(newIngredient.dataValues);
                    //             listIngredientRecette.push(newIngredient.dataValues);
                    //         }
                            
                    //     })
                    //     .catch(function(err) {
                    //         console.log(err);
                    //         //return res.status(500).json({"erreur" : "impossible de mettre à jour les ingredients"})
                    //     })
                    // }
                    


                    }).catch(function(err) {
                        console.log(err);
                        return res.status(500).json({'erreur': 'Impossible de mettre à jour les ingredients'})
                    })
                })
                .catch(function(err) {
                    return res.status(500).json({'erreur': 'Impossible de mettre à jour la recette'})
                })

                
            }
        else {
            return res.status(400).json({'erreur': 'recette introuvable'})
        }

        })
        
    },
    
}