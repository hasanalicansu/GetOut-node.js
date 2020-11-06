const router =require("express").Router();
const authMiddleware = require('../middleware/authMiddleware');

//controller
const arkadasController =require("../controllers/arkadasController")

router.get("/add/:id",authMiddleware,arkadasController.arkadasAdd)//arkadaş ekler
router.get("/istek/:id",authMiddleware,arkadasController.arkadasIstek)//arkadaş isteği yollar
router.get("/get",authMiddleware,arkadasController.arkadasGet)//arkdaşalarını getirir
router.get("/istekgetir",authMiddleware,arkadasController.istekGet)//arkadaş isteklerini getirir
router.get("/arama/:name",authMiddleware,arkadasController.aramaGet)//arkadaş aramalarını getirir
router.get("/istek/onay/:id",authMiddleware,arkadasController.istekOnay)//arkadaş isteklerini onaylar
router.get("/istek/red/:id",authMiddleware,arkadasController.istekRed)//arkadaş isteklerini reddeder
router.get("/arkadasSil/:id",authMiddleware,arkadasController.arkadasSil)//arkadaşını siler



module.exports = router;