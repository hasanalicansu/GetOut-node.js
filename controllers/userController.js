const User = require("../models/userModel.js");
const Durum = require("../models/durumModel");
const bcrypt = require("bcrypt");

const createNewAccount = async (req, res, next) => {
  try {
    const eklenecekUser = new User(req.body);

    if (req.body.sifre && req.body.sifre.length >= 6)
      eklenecekUser.sifre = await bcrypt.hash(eklenecekUser.sifre, 8);

    const { error, value } = eklenecekUser.joiValidation(req.body);

    if (error) {
      //console.log("joi error\n\n",error)
      res.status(206).json({
        mesaj: error.message,
        hataKodu: 400,
      });

      //next gelicek
    } else {
      try {
        const sonuc = await eklenecekUser.save();
        const userDurum = await new Durum({ uid: sonuc._id ,isim:sonuc.isim});
        const durum = await userDurum.save();
        console.log(sonuc)
        res.status(200).json(sonuc);
      } catch (err) {
        console.log("hata1");
        throw err;
      }
    }
  } catch (error) {
    //console.log("user kaydederken hata:" + error);

    if (error.code === 11000) {
      return res.status(206).json({
        mesaj:
          Object.keys(error.keyValue) +
          " için girdiğiniz " +
          Object.values(error.keyValue) +
          " daha önceden veritabanında olduğu için tekrar eklenemez/güncenllenemez, unique olmalıdır",

        hataKodu: 400,
      });
    }

    res.status(206).json({
      mesaj: "Kullanıcı kaydedilirken hahta oluştu",
      hataKodu: 400,
    });
    //next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await User.girisYap(req.body.email, req.body.sifre);
    const token = await user.generateToken();
    res.json({
      user,
      token,
    });
  } catch (hata) {
    next(hata);
  }
};

const oturumAcanUserBilgileri =async(req,res,next)=>{
  return res.json({mesaj:req.user})
}
module.exports = {
  createNewAccount,
  login,
  oturumAcanUserBilgileri
};
