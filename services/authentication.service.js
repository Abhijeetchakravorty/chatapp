let config = require('../config');
let def_format = require('./data.service');
let jwt = require('jsonwebtoken');
module.exports = {
        authenticateToken: function(req, res, next) {
                const authHeader = req.headers['authorization'];
                const token = authHeader && authHeader.split(' ')[1];
                console.log('////////////////');
                console.log(token);
                console.log('////////////////');
                let origin = req.get('origin');
                console.log(token);
                console.log(origin);
                if (token === null || token === undefined) {
                        return def_format.res_auth_err(res);
                }

                if (config.NODE_ENV !== 'development') {
                        console.log(config.NODE_ENV);
                        console.log('//////////');
                        console.log(config.SERVER_PROTOCOL+'://'+config.CHAT_CLIENT_HOST);
                        if (config.NODE_ENV === 'production') {
                                if (origin !== 'https://www.'+config.CHAT_CLIENT_HOST) {
                                        return res.status(404).end();
                                }
                        } else {
                                console.log(origin);
                                console.log('https://'+config.CHAT_ADMIN_HOST);
                                if (origin !== 'https://'+config.CHAT_CLIENT_HOST && origin !== 'https://'+config.CHAT_ADMIN_HOST) {
                                        return res.status(404).end();
                                }
                        }
                }
                
                jwt.verify(token, config.JWT_SIGNING_KEY, (err, user) => {
                        if (err) {
                                return def_format.res_auth_err(res);
                        };
                        req.user = user;
                        next();
                })
        },

        authOrigin: function(req, res, next) {
                let origin = req.get('origin');
                if (config.NODE_ENV !== 'development') {
                        console.log(config.NODE_ENV);
                        console.log('//////////');
                        console.log(config.SERVER_PROTOCOL+'://'+config.CHAT_CLIENT_HOST);
                        if (config.NODE_ENV === 'production') {
                                if (origin !== 'https://www.'+config.CHAT_CLIENT_HOST) {
                                        return res.status(404).end();
                                }
                        } else {
                                console.log(origin);
                                console.log('https://'+config.CHAT_ADMIN_HOST);
                                if (origin !== 'https://'+config.CHAT_CLIENT_HOST && origin !== 'https://'+config.CHAT_ADMIN_HOST) {
                                        return res.status(404).end();
                                }
                        }
                }
                next();
        }
}