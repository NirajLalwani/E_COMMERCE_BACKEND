const express = require("express");
const router = express.Router();
const userController = require('../Controller/userController')
router.route('/register')
    .post(userController.register)


router.route('/login')
    .post(userController.login)

router.route('/resend/mail').post(userController.resendMail)
router.route('/getdata').post(userController.getData)

router.route("/:token/verify/:_id").get(userController.verifyMail)
router.route("/sendresetlink").post(userController.sendResetLink)
router.route("/updatePassword").patch(userController.updatePassword)
router.route("/delete").delete(userController.DeleteAccount)

module.exports = router;