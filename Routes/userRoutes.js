const express = require("express");
const router = express.Router();
const userController = require('../Controller/userController')


router.route('/register').post(userController.register)


router.route('/login').post(userController.login)


router.route("/:token/verify/:_id").get(userController.verifyMail)


router.route('/getdata').post(userController.getData)




router.route("/sendresetlink").post(userController.sendResetPasswordLink)


router.route("/updatePassword").patch(userController.updatePassword)

router.route("/getUsers/:_id").get(userController.getUsers)

router.route("/updateIsAdmin/:_id/:adminId").patch(userController.updateIsAdmin)

router.route("/deleteUser/:_id/:adminId").delete(userController.deleteUser)

module.exports = router;