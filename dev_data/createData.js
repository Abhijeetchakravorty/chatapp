let Models = require('../models');
let userJson = require('./users/users.json');
let dataFormat = require('../services/data.service');
var main = function() {
        // Populate database
        Models.sequelize.sync({
                force: true
        })
        // // populate user table
        .then(userTable)        
        // Catch all errors
        .catch((err) => console.log(err));
};

// Populate user table
var userTable = function() {
        return dataFormat.populateDb('Users', userJson);
}

main();