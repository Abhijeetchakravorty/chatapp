let moment = require('moment');
let Models = require('../models');
let def_format = require('../services/data.service');
var config = require('../config');
const saltRounds = config.BCRYPT_SALT_ROUNDS;
const jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const { Op } = require("sequelize");
module.exports = {
        user_signup: function(req, res, next) {
                let obj = {
                        email: req.body.email.toLowerCase(),
                        password: bcrypt.hashSync(req.body.password, saltRounds),
                        firstName: req.body.firstName.toLowerCase(),
                        lastName: req.body.lastName.toLowerCase(),
                        createdBy: 1
                }
        
                Models.Users.findAll({
                        where: {
                                email: obj.email.toLowerCase()
                        }
                }).then(data => {
                        if (data.length !== 0) {
                                return def_format.cs_msg(res, 'Oops! Looks like you are already signed up with us. Signin Now!');
                        }
                        
                        if (data.length === 0) {
                                Models.Users.create(obj).then(data => {
                                        return def_format.res_ok(
                                                res, {
                                                        token: jwt.sign({
                                                                user: obj.email.toLowerCase()
                                                        }, config.JWT_SIGNING_KEY, {
                                                                expiresIn: '10h',
                                                                issuer: 'localchatapp.in'
                                                        }),
                                                        id: data.id,
                                                        firstName: obj.firstName,
                                                        lastName: obj.lastName
                                                });
                                }, err => {
                                        console.error(err);
                                        return def_format.res_err(
                                                res,
                                                'Failed to process your request. Please try again after sometime or contact admin'
                                        );
                                });
                        }
                }).catch((err) => {
                        console.log(err);
                        def_format.res_err(res, 'There was some problem adding the service centre. Contact Support.')
                });
        },

        user_login: function(req, res, next) {
                let email = req.body.email;
                let password = req.body.password;
                Models.Users.findOne({
                        where: {
                                email: email
                        },
                        attributes: ["id", "email", "password", "firstName", "lastName"]
                }).then(data => {
                        console.log(data);
                        if (data === null) {
                                return def_format.cs_msg(res, 'Oops! Looks like you are not signed up with us. Signup Now!');
                        } else {
                                 // // console.log(data);
                                if (data.length === 0) {
                                        return def_format.cs_msg(res, 'Oops! Looks like you are not signed up with us. Signup Now!');
                                }
        
                                if (data.length !== 0) {
                                        if (bcrypt.compareSync(password, data.password)) {
                                                // Sign the token with phone
                                                let user_obj = {
                                                        email: data.email
                                                }
        
                                                let token = jwt.sign({
                                                                user: user_obj
                                                        }, config.JWT_SIGNING_KEY, {
                                                                expiresIn: '10h',
                                                                issuer: 'localchatapp.in'
                                                        })
        
                                                let Obj = {
                                                        id: data.id,
                                                        token: token,
                                                        firstName: data.firstName,
                                                        lastName: data.lastName
                                                }
        
                                                return def_format.res_ok(res, Obj);
                                        } else {
                                                return def_format.res_err(res, 'Passwords do not match');
                                        }
                                }
                        }
                }, err => {
                        return def_format.res_err(res, data);
                });
        },

        login_check: function(req, res, next) {
                jwt.verify(req.body.token, config.JWT_SIGNING_KEY, function(err, data) {
                        if (data!==undefined) {
                                return def_format.res_ok(res, 'User logged in');
                        } else {
                                def_format.res_auth_err(res, 'Authentication failed');
                        }
                });
        },

        fetch_all_users: function (req, res, next) {
                let dat = {};
                if (req.query.search.length !== 0) {
                        dat = {
                                deletedAt: null,
                                firstName: {
                                        [Op.like]: '%'+req.query.search.toLowerCase()+'%'
                                }
                        }
                } else {
                        dat = {
                                deletedAt: null
                        }
                }
                Models.Users.findAndCountAll({
                        limit: Number(req.query.limit),
                        offset: Number(req.query.offset),
                        where: dat,
                        attributes: ["id", "firstName", "lastName", "email"]
                }).then((data)=> {
                        return def_format.res_custom(res, {
                                limit: Number(req.query.limit),
                                offset: Number(req.query.offset),
                                count: data.count
                        }, data.rows)
                }).catch((err) => {
                        console.log(err);
                        return res.status(422).json({
                                success: false,
                                response: 'Failed to process your request. Please try again after sometime or contact admin'
                        });
                });
        },

        fetch_all_messages: function (req, res, next) {
                let dat = {
                        [Op.or]: [
                                {
                                        UserId: req.body.senderId,
                                        receiverId: req.body.receiverId
                                },
                                {
                                        UserId: req.body.receiverId,
                                        receiverId: req.body.senderId
                                }
                        ]
                };

                Models.Messages.findAndCountAll({
                        limit: Number(req.body.limit),
                        offset: Number(req.body.offset),
                        where: dat,
                        include: [
                                {
                                        model: Models.Users,
                                        attributes: ["id", "firstName", "lastName"]
                                }
                        ],
                        attributes: ["id", "message", "receiverId", "UserId", "createdBy"]
                }).then((result) => {
                        return def_format.res_custom(res, {
                                limit: Number(req.body.limit),
                                offset: Number(req.body.offset),
                                count: result.count
                        }, result.rows)
                }).catch((err) => {
                        return res.status(422).json({
                                success: false,
                                response: 'Failed to process your request. Please try again after sometime or contact admin'
                        });
                });
        }
}