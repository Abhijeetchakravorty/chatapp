let config = require('../config');
let Models = require('../models');
let def_format = require('../services/data.service');
module.exports = {
        add: function (data, io, socket) {
                let obj = {
                        message: data.message,
                        messageType: "text",
                        receiverId: data.receiver.id,
                        createdBy: data.sender.id,
                        updatedBy: data.sender.id,
                        UserId: data.sender.id
                }
                Models.Messages.create(obj).then((result) => {
                        if (result) {
                                console.log("I am here");
                                io.sockets.emit("receive", data);
                        }
                }, err => {
                        console.error(err);
                });
        }
}