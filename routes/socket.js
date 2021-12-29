var express = require('express');
var router = express.Router();
const { body} = require('express-validator/check');
let controller = require('../controllers/socket.controller');

router.get('/ioconnect', (req, res, next) => {
        controller.on();
});

module.exports = router;
