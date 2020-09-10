var models = require('../models');
var jwtUtils = require('../utils/jwt.utils');
var asyncLib = require('async');

module.exports = {
    likeRecette : function(req, res) {

        var authorization = req.headers['authorization']
        var userId = jwtUtils.getUserId(authorization);

        var recetteId = parseInt(req.params.recetteId);

        if(recetteId <= 0) {
            return res.status(404).json({'erreur' : 'recette invalide'})
        }
        console.log("recetteId = " + recetteId);
        console.log("userId = " + userId)

        asyncLib.waterfall([
            function(done) {
                models.Recette.findOne({
                    where : {id : recetteId}
                })
                .then(function(recetteFound) {
                    done(null, recetteFound)
                })
                .catch(function(err) {
                    console.log(err)
                    return res.status(500).json({"erreur" : "erreur dans la récupération des recettes"})
                })
            },

            function(recetteFound, done) {
                if(recetteFound) {
                    models.User.findOne({
                        where : {id : userId}
                    })
                    .then(function(userFound) {
                        done(null, recetteFound, userFound);
                    })
                    .catch(function(err) {
                        return res.status(500).json({"erreur" : "erreur dans la récupération de l'utiliateur"})
                    })
                }

                else {
                    return res.status(404).json({"erreur" : "recette introuvable"}) 
                }
                
            },

            function(recetteFound, userFound, done) {
                
                if(userFound) {
                    models.Like.findOne({
                        where : {
                            recetteId : recetteFound.id,
                            userId : userFound.id
                        }
                    })
                    .then(function(userLikedRecette) {
                        done(null, recetteFound, userFound, userLikedRecette)
                    })
                    .catch(function(err) {
                        console.log(err);
                        return res.status(500).json({"erreur" : "Impossible de verifier le like"})
                    })
                }

                else {
                    return res.status(404).json({"erreur" : "utilisateur introuvable"})
                }
            },

            function(recetteFound, userFound, userLikedRecette, done) {
                if(!userLikedRecette) {
                    recetteFound.addUser(userFound)
                    .then(function(alreadyLikeFound) {
                        done(null, recetteFound, userFound, userLikedRecette)
                    })
                    .catch(function(err) {
                        console.log(err);
                        return res.status(500).json({"erreur" : "impossible de like"})
                    })
                }
                else {
                    return res.status(409).json({"erreur" : "La recette est déja liké"})
                }
            },
            // on incrémente les like de la recette
            function(recetteFound, userFound, userLikedRecette, done) {
                recetteFound.update({
                    like : recetteFound.like + 1
                })
                .then(function(likedRecette) {
                    done(likedRecette); 
                })
                .catch(function(err) {
                    console.log(err)
                    return res.status(500).json({"erreur" : "impossible de mettre à jour les likes de recettes"})
                })

            }

        ], function(likedRecette) {
            if(likedRecette)
                return res.status(201).json(likedRecette)
            else
                return res.status(500).json({"erreur" : "cannot update like recette"})
        })
    },

    dislikeRecette : function(req, res) {
        var authorization = req.headers['authorization']
        var userId = jwtUtils.getUserId(authorization);
        //var recetteId = parseInt(req.query.recetteId);
        var recetteId = parseInt(req.params.recetteId);

        console.log("recetteId = " + recetteId);
        console.log("userId = " + userId)

        if(recetteId <= 0) {
            return res.status(404).json({'erreur' : 'recette invalide'})
        }

        asyncLib.waterfall([
            function(done) {
                models.Recette.findOne({
                    where : {id : recetteId}
                })
                .then(function(recetteFound) {
                    done(null, recetteFound)
                })
                .catch(function(err) {
                    return res.status(500).json({"erreur" : "erreur dans la récupération des recettes"})
                })
            },

            function(recetteFound, done) {
                if(recetteFound) {
                    models.User.findOne({
                        where : {id : userId}
                    })
                    .then(function(userFound) {
                        done(null, recetteFound, userFound);
                    })
                    .catch(function(err) {
                        return res.status(500).json({"erreur" : "erreur dans la récupération de l'utiliateur"})
                    })
                }

                else {
                    return res.status(404).json({"erreur" : "recette introuvable"}) 
                }
                
            },

            function(recetteFound, userFound, done) {
                
                if(userFound) {
                    models.Like.findOne({
                        where : {
                            recetteId : recetteFound.id,
                            userId : userFound.id
                        }
                    })
                    .then(function(userLikedRecette) {
                        done(null, recetteFound, userFound, userLikedRecette)
                    })
                    .catch(function(err) {
                        return res.status(500).json({"erreur" : "Impossible de verifier le like"})
                    })
                }

                else {
                    return res.status(404).json({"erreur" : "utilisateur introuvable"})
                }
            },
            // onsupprime le like dans la base
            function(recetteFound, userFound, userLikedRecette, done) {
                if(userLikedRecette != null) {
                    userLikedRecette.destroy()
                    .then(function(alreadyLikeFound) {
                        done(null, recetteFound, userFound)
                    })
                    .catch(function(err) {
                        return res.status(500).json({"erreur" : "impossible de like"})
                    })
                }
                else {
                    return res.status(409).json({"erreur" : "La recette est déja liké dans le dislike"})
                }
            },
            // on incrémente les like de la recette
            function(recetteFound, userFound, done) {
                recetteFound.update({
                    like : recetteFound.like - 1
                })
                .then(function() {
                    done(recetteFound)
                })
                .catch(function(err) {
                    return res.status(500).json({"erreur" : "impossible de mettre à jour les likes de recettes"})
                })

            }

        ], function(likedRecette) {
            if(likedRecette)
                return res.status(201).json(likedRecette)
            else
                return res.status(500).json({"erreur" : "cannot update like recette"})
        })
    },
}