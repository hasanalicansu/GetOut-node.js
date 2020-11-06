const router =require("express").Router();
const authMiddleware = require('../middleware/authMiddleware');

//controller
const durumController =require("../controllers/durumController")

router.patch("/",authMiddleware,durumController.durumUpdate)
router.get("/get",authMiddleware,durumController.durumGet)



module.exports = router;