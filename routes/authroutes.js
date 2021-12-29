var express = require('express');
var router = express.Router();
const { body, buildCheckFunction} = require('express-validator/check');
let controller = require('../controllers/user.controller');
let data_format = require('../services/data.service');
const checkQuery = buildCheckFunction(['query']);

router.post('/loginCheck', [
        body('token')
], (req, res, next) => {
        let chk = data_format.v_err(req);
        if (!chk.success) {
                data_format.cs_msg(res, chk.response)
        }

        if (chk.success) {
                controller.login_check(req, res, next);
        }
});

router.get('/allusers', [
        checkQuery('search'),
        checkQuery('limit'),
        checkQuery('offset')
], (req, res, next) => {
        let chk = data_format.v_err(req);
        if (!chk.success) {
                data_format.cs_msg(res, chk.response)
        }

        if (chk.success) {
                controller.fetch_all_users(req, res, next);
        }
});


router.post('/allmessages', [
        body('senderId'),
        body('receiverId'),
        body('limit'),
        body('offset'),
], (req, res, next) => {
        console.log("I am in all messags");
        let chk = data_format.v_err(req);
        if (!chk.success) {
                data_format.cs_msg(res, chk.response)
        }

        if (chk.success) {
                controller.fetch_all_messages(req, res, next);
        }
})

module.exports = router;
