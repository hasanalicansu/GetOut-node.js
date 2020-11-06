const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const auth = async (req, res, next)=>{ 

    try {
        if (req.header('Authorization'))
        {
            const token = req.header('Authorization').replace('Bearer ', '');
            const sonuc = jwt.verify(token, 'secretkey');
          
            const bulunanUser = await User.findById({ _id: sonuc._id });

            if (bulunanUser)
                req.user = bulunanUser;
            else {
                return  res.json({
                    mesaj: "Lütfen giriş yapın",
                  });
            }
            next();
        } else {
            return  res.json({
                mesaj: "Lütfen giriş yapın",
              });
            //throw new Error('Lütfen giriş yapın');
        }

    } catch (e) {
        return res.json({
            mesaj: e.message,
          });
    }
    


}

module.exports = auth;