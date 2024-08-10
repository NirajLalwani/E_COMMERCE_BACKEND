const Router = require('express').Router();
const controller = require('../Controller/productController');

Router.route('/data').get(controller.getData);
Router.route('/data/add').post(controller.addData);
Router.route('/data/update').patch(controller.updateProduct);
Router.route('/data/delete/:productId/:_id').delete(controller.deleteProduct);

module.exports = Router;