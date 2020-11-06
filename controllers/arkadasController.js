const Arkadas = require("../models/arkadasModel");
const Durum = require("../models/durumModel");
const User = require("../models/userModel");
const ArkadasIstek = require("../models/arkadasIstekModel");
//const createError=require("http-errors");

const arkadasIstek = async (req, res, next) => {
  try {
    const oturumAcanUser = req.user._id;
    const eklenecekArkadas = req.params.id;
    let ozelNo;
    if (oturumAcanUser > eklenecekArkadas) {
      ozelNo = oturumAcanUser + eklenecekArkadas;
    } else {
      ozelNo = eklenecekArkadas + oturumAcanUser;
    }

    const sorgu = await Arkadas.findOne({ numberUnique: ozelNo });

    if (sorgu == null) {
      const istek = await new ArkadasIstek({
        istekYollananId: eklenecekArkadas,
        istekYollayanIsim: req.user.isim,
        istekYollayanId: oturumAcanUser,
        numberUnique: ozelNo,
        istekYollayanUserName: req.user.userName,
      });

      const sonuc = await istek.save();
      if (sonuc) {
        return res.json(sonuc);
      } else {
        return res.json({
          mesaj: "İstek Gönderilemedi",
        });
      }
    } else {
      return res.status(206).json({
        mesaj: "Halihazırda istek gönderilen kişi arkadaşınız",
      });
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(207).json({
        mesaj:
          "Eklemeye çalıştığınız kullanıcıya istek gönderilmiş veya o size istek gönderdi",

        hataKodu: 207,
      });
    }
    res.json({
      mesaj: error,
    });
  }
};

const istekGet = async (req, res, next) => {
  try {
    const oturumAcanUser = req.user._id;
    const istekler = await ArkadasIstek.find({
      istekYollananId: oturumAcanUser,
    });
    if (istekler.length != 0) {
      return res.json({
        mesaj: istekler,
      });
    } else {
      return res.status(206).json({
        mesaj: "Herhangi bir istek bulunamadı",
      });
    }
  } catch (error) {
    return res.json({
      mesaj: error,
    });
  }
};

const arkadasAdd = async (req, res, next) => {
  try {
    const oturumAcanUser = req.user._id;
    const eklenecekArkadas = req.params.id;

    delete req.body.createdAt;
    delete req.body.updatedAt;

    const arkadas = await new Arkadas({
      kullaniciId: oturumAcanUser,
      arkadasId: eklenecekArkadas,
      numberUnique: oturumAcanUser + eklenecekArkadas,
    });
    const sonuc = await arkadas.save();
    const arkadas2 = await new Arkadas({
      kullaniciId: eklenecekArkadas,
      arkadasId: oturumAcanUser,
      numberUnique: eklenecekArkadas + oturumAcanUser,
    });
    const sonuc2 = await arkadas2.save();

    if (sonuc) {
      return res.json(sonuc);
    } else {
      return res.json({
        mesaj: "Arkadas Eklenemedi",
      });
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        mesaj: "Eklemeye çalıştığınız kullanıcı zaten arkadaşınız",

        hataKodu: 400,
      });
    }
    res.json({
      mesaj: error,
    });
  }
};

const arkadasGet = async (req, res, next) => {
  const oturumAcanUser = req.user._id;
  const arkadaslarim = [];
  try {
    const arkadaslarId = await Arkadas.find({ kullaniciId: oturumAcanUser });
    if (arkadaslarId) {
      await Promise.all(
        arkadaslarId.map(async (element) => {
          const arkadasGetir = await Durum.find({ uid: element.arkadasId });
          arkadaslarim.push(arkadasGetir);
        })
      );
      return res.json({ mesaj: arkadaslarim });
    } else {
      return res.json({ mesaj: "Şimdilik arkdaşınız bulunmamakta" });
    }
  } catch (error) {
    return res.json({ mesaj: error });
  }
};

const aramaGet = async (req, res, next) => {
  try {
    const aranacakKisi = req.params.name;
    const arama = await User.find({}, { sifre: 0, email: 0, __v: 0 }).or([
      { isim: aranacakKisi },
      { userName: aranacakKisi },
    ]);
    if (arama.length != 0) {
      res.json({
        mesaj: arama,
      });
    } else {
      res.status(206).json({
        mesaj: "Böyle bir kullanıcı bulunmamaktadır",
      });
    }
  } catch (error) {
    res.json({
      mesaj: error,
    });
  }
};

const istekOnay = async (req, res, next) => {
  try {
    const istekId = req.params.id;
    const istek = await ArkadasIstek.findOne({ _id: istekId });
    if (istek != null) {
      const onaylayan = istek.istekYollananId;
      const yollayan = istek.istekYollayanId;

      const arkadas = await new Arkadas({
        kullaniciId: onaylayan,
        arkadasId: yollayan,
        numberUnique: onaylayan + yollayan,
      });
      const sonuc = await arkadas.save();
      const arkadas2 = await new Arkadas({
        kullaniciId: yollayan,
        arkadasId: onaylayan,
        numberUnique: yollayan + onaylayan,
      });
      const sonuc2 = await arkadas2.save();
      if (sonuc && sonuc2) {
        const sil = await ArkadasIstek.deleteOne({ _id: istekId });
        if (sil.length != 0) {
          console.log(sil);
          return res.json(sonuc);
        } else {
          return res.json({
            mesaj: "Arkadas Eklenemedi",
          });
        }
      } else {
        return res.json({
          mesaj: "Arkadas Eklenemedi",
        });
      }
    } else {
      return res.json({
        mesaj: "Böyle bir istek bulumamakta",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      mesaj: error,
    });
  }
};

const istekRed = async (req, res, next) => {
  try {
    const istekId = req.params.id;
    const sil = await ArkadasIstek.deleteOne({ _id: istekId });
    if (sil.deletedCount != 0) {
      return res.json(sil);
    } else {
      return res.status(206).json({
        mesaj: "Belirtilen istek bulunamadı",
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

const arkadasSil = async(req,res,next)=>{
  try {
    const oturumAcanUser = req.user._id;
    const silinecekArkadas= req.params.id
    const bendenSil=await Arkadas.deleteOne({}).and([{arkadasId:silinecekArkadas},{kullaniciId:oturumAcanUser}])
    const ondanSil=await Arkadas.deleteOne({}).and([{arkadasId:oturumAcanUser},{kullaniciId:silinecekArkadas}])

    return res.json({
      mesaj:  "Arkadaşlıktan çıkarıldı"
    })
    
  } catch (error) {
    return res.json({
      mesaj:  error
    })
    
  }
}

module.exports = {
  arkadasSil,
  istekRed,
  istekOnay,
  aramaGet,
  istekGet,
  arkadasGet,
  arkadasAdd,
  arkadasIstek,
};
