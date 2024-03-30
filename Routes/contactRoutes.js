const Router = require('express').Router();
const controller = require('../Controller/contactController')
Router.post('/contact', controller.contact)

module.exports = Router;