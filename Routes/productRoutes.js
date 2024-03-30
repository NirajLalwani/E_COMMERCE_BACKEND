const Router = require('express').Router();
const controller = require('../Controller/productController');

Router.route('/data').get(controller.getData);

module.exports = Router;