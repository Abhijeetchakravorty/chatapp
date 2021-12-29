let app = require('../app');
let controller = require('../controllers/socket.controller');
let jwt = require('jsonwebtoken');
let config = require('../config');
module.exports = {
        authenticate: function (data, io, socket) {
                controller.add(data, io, socket);
                // jwt.verify(data.sender.token, config.JWT_SIGNING_KEY, function(err, result) {
                //         if (result) {
                //                 controller.add(data, io, socket);
                //         }
                // });
        }
}