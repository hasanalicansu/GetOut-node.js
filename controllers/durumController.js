const Durum =require("../models/durumModel")
//const createError=require("http-errors");

const durumUpdate = async (req,res,next)=>{
    const oturumAcanUser=req.user._id;

    delete req.body.createdAt;
    delete req.body.updatedAt;

    const durumum = await Durum.updateOne({ uid: oturumAcanUser}, req.body,{new:true,runValidators:true});
    if (durumum) {
        return res.json(durumum)
    } else {
        return res.json({
            mesaj:"Durum güncellenemedi"
        })
    }
    

}


const durumGet = async (req,res,next)=>{
    const oturumAcanUser=req.user._id;

    delete req.body.createdAt;
    delete req.body.updatedAt;

    const durumum = await Durum.findOne({ uid: oturumAcanUser});
    return res.json(durumum)
    

}


module.exports = {
    durumUpdate,
    durumGet
}