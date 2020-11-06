const router =require("express").Router();
const authMiddleware = require('../middleware/authMiddleware');
//controller
const userController =require("../controllers/userController")
//hesap oluşturma

router.post("/createAccount",userController.createNewAccount);
router.post("/login",userController.login);
router.get("/login/token",authMiddleware,userController.oturumAcanUserBilgileri)


module.exports = router;