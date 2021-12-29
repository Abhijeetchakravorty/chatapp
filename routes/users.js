var express = require('express');
var router = express.Router();
const { body, buildCheckFunction} = require('express-validator/check');
let controller = require('../controllers/user.controller');
let data_format = require('../services/data.service');
const checkQuery = buildCheckFunction(['query']);
// User signup
router.post('/signup', [
        body('email'),
        body('password'),
        body('firstName'),
        body('lastName')
], (req, res, next) => {
        let chk = data_format.v_err(req);
        if (!chk.success) {
                data_format.cs_msg(res, chk.response)
        }

        if (chk.success) {
                controller.user_signup(req, res, next);
        }
});

// User login
router.post('/login', [
        body('email'),
        body('password')
], (req, res, next) => {
        console.log('I am here');
        let chk = data_format.v_err(req);
        if (!chk.success) {
                data_format.cs_msg(res, chk.response)
        }

        if (chk.success) {
                controller.user_login(req, res, next);
        }
});

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
module.exports = router;
