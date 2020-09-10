var jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = 'fd5df584rgtfsc56gtfs56g5da5ht5k5r548k:io5re'
module.exports = {
    generateTokenForUser: function(userData) {
        return jwt.sign({
            userId : userData.id,
            isAdmin : userData.isAdmin
        },
        JWT_SIGN_SECRET,
        {
            expiresIn: '1h'
        })
    },

    parseAuthorisation: function(authorisation) {
        return authorisation != null ? authorisation.replace('Bearer ', ''): null;
    },
    getUserId: function(authorisation) {
        var userId = -1;
        var token = module.exports.parseAuthorisation(authorisation);
        if(token != null) {
            console.log("token != null !!!!")
            try {
                var jwtToken = jwt.verify(token, JWT_SIGN_SECRET)
                console.log(jwtToken);
                if(jwtToken != null) {
                    userId = jwtToken.userId
                }
            } catch(err) {}
        }

        return userId;
    }
}