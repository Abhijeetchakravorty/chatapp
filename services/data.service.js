const {
        check,
        oneOf,
        body,
        validationResult,
        buildCheckFunction
} = require('express-validator');
let Models = require('../models');
module.exports = {
        // General format
        general_format: function(data) {
                return new Promise(function(resolve, reject) {
                        if (data.length !== 0) {
                                var arr = [];
                                for (var i = 0; i < data.length; i++) {
                                        arr.push(data[i]);
                                }
                                return resolve(arr);
                        }
                        if (data.length === 0) {
                                return resolve(data)
                        }
                });
        },

        // linked list format
        linked_list: function(req, res, data) {
                let listData = linkedList.add_at_tail(data);
                this.res_custom(res, {
                        count: data.count,
                        limit: Number(req.query.limit),
                        offset: Number(req.query.offset)
                }, listData);
        },

        // Res Ok
        res_ok: function(res, data) {
                return res.status(200).json({
                        success: true,
                        response: data
                });
        },
        // Custom format
        res_custom: function(res, optional, data) {
                return res.status(200).json({
                        success: true,
                        optional: optional,
                        response: data
                });
        },
        // Res Error
        res_err: function(res, data) {
                return res.status(422).json({
                        success: false,
                        response: data
                });
        },
        // Res Auth err
        res_auth_err: function(res) {
                return res.status(401).json({
                        success: false,
                        response: 'Authentication failed.'
                });
        },
        // CS Message
        cs_msg: function(res, msg) {
                return res.status(422).json({
                        success: false,
                        response: msg
                });
        },
        // Error
        v_err: function(req) {
                let err = validationResult(req);
                if (!err.isEmpty()) {
                        return {
                                success: false,
                                response: err.array()
                        }
                } else {
                        return {
                                success: true
                        }
                }
        },
        check_err: function(req) {
                let err = validationResult(req);
                if (!err.isEmpty()) {
                        return false;
                } else {
                        return true;
                }
        },
        // Group by
        groupBy: function(xs, key) {
                return xs.reduce(function(rv, x) {
                        (rv[x[key]] = rv[x[key]] || []).push(x);
                        return rv;
                }, []);
        },
        // Compare two arrays
        compare: function(arr1, arr2) {
                let finalArr = [];
                arr1.forEach((e1) => arr2.forEach((e2) => {
                        if (e1['id'] !== e2['RoomId']) {
                                finalArr.push(e1);
                        }
                }));
                return finalArr;
        },
        // Populate database
        populateDb: function(model, json) {
                return new Promise((resolve, reject) => {
                        if (json.length !== 0) {
                                let Obj = {};
                                for (let v = 0; v < json.length; v++) {
                                        Obj = json[v];
                                        if(Obj.min_price == null || Obj.min_price.length == 0) {
                                                Obj.min_price = "0"; 
                                        }
                                        Obj.createdAt = new Date();
                                        Obj.createdBy = 1
                                        Obj.updatedBy = 1
                                        Obj.updatedAt = new Date();
                                        
                                        Models[model].create(Obj).then(data => {
                                                resolve();
                                        }).catch(err => {
                                                reject();
                                        });
                                }
                        }
                });
        },
        genRand: function(length) {
                var result = '';
                var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                var charactersLength = characters.length;
                for (var i = 0; i < length; i++) {
                        result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
        }
}