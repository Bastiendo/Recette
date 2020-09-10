var bcrypt = require('bcrypt');
var asyncLib = require('async')

var jwtUtils = require('../utils/jwt.utils');
var models = require('../models');

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/

module.exports = {
    register: function(req, res) {
        
        console.log(req.body)
        var email = req.body.email;
        var username = req.body.username;
        var password = req.body.password;
        var bio = req.body.bio;

        if(email == null || password == null || username == null) {
            return res.status(400).json({'erreur': 'il manque des paramètre'})
        }

        // on test la longueur su pseudo
        if(username.length >= 13 || username.length <= 3) {
            return res.status(400).json({'erreur': "L'username doit être compris entre 4 et 13 characteres"})
        }

        // on teste le format de l'email
        if(!EMAIL_REGEX.test(email)) {
            return res.status(400).json({'erreur': "L'email est pas valide"})
        }

        if(PASSWORD_REGEX.test(password)) {
            return res.status(400).json({'erreur': "Le mot de passe n'est pas valide"})
        }

        // on verifie si l'utilisateur existe déjà
        models.User.findOne({
            attributes: ['email'],
            where : {email : email}
        })
        .then(function(userFound) {
            if(userFound) {
                return res.status(409).json({'error': 'l\'utilisateur existe déjà'})
            }
            else {
                console.log("utilisateur existe pas ")
                bcrypt.hash(password, 5, function(err, bcryptedPassword) {
                    var newUser = models.User.create({
                        email : email,
                        username : username,
                        password : bcryptedPassword,
                        bio : bio,
                        isAdmin : 0
                    })
                    .then(function(newUser) {
                        return res.status(201).json({'userId': newUser.id})
                    })
                    .catch(function(err) {
                        return res.status(500).json({
                            'error': 'ajout impossible'
                        })
                    })

                })
            }
        })
        .catch(function(err) {
            console.log(err);
            return res.status(500).json({'error' : 'on peut pas vérifier l\'email'})
        })

    },
    login: function(req, res) {
		console.log(req.body);
        var email = req.body.email;
        var password = req.body.password

        if(email == null || password == null) {

            return res.status(500).json({
                'error': 'il manque des paramètres'
            })
        }

        models.User.findOne({
            where: {email:email}
        })
        .then(function(userFound) {
            if(userFound) {

                bcrypt.compare(password, userFound.password, function(errBcrypt, resBycript) {

                    if(resBycript) {
                        return res.status(200).json({
                            'userId': userFound.id,
                            'token':  jwtUtils.generateTokenForUser(userFound)
                        })
                    }
                    else {
                        return res.status(403).json({
                            'error' : 'invalid password'
                        })
                    }
                })

            }
            else {
                return res.status(404).json({
                    'error' : 'utilisateur introuvable'
                })
            }
        })
        .catch(function(err) {
            return res.status(500).json({
                'error' : 'connexion bdd impossible'
            })
        })
    },
    getUserProfil: function(req, res) {

        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        if(userId < 0) {
            return res.status(400).json({'error': 'token invalid'})
        }

        models.User.findOne({
            attributes: ['id', 'email', 'username', 'bio'],
            where :  {id:userId}
        })
        .then(function(user) {
            if(user) {
                return res.status(200).json({'user':user})
            }
            else {
                return res.status(404).json({'error': 'utilisateur introuvable'})
            }
        })

    },
    updateUserProfile: function(req, res) {
        console.log("*** on modifie le profil ***")
        var authorisation = req.headers['authorization'];
        var userId = jwtUtils.getUserId(authorisation);

        var bio = req.body.bio;

        models.User.findOne({
            attributes: ['id', 'bio'],
            where: {id : userId}
        })
        .then(function(user) {
            if(user) {
                user.update({
                    bio: bio ? bio : user.bio
                })
                .then(function() {
                    return res.status(201).json({'sucesse': 'mise à jour effectué'})
                })
                .catch(function(err) {
                    return res.status(500).json({'erreur': 'Impossible de mettre à jour la bio'})
                })
            }
            else {
                return res.status(400).json({'erreur': 'utilisateur introuvable'})
            }
        })
    }
}