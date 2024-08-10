const Router = require('express').Router();
const controller = require('../Controller/contactController')
Router.post('/contact', controller.contact)
Router.get('/getMessages/:_id', controller.getMessages)
Router.route("/deleteMessage/:_id/:adminId").delete(controller.deleteMessage)
module.exports = Router;