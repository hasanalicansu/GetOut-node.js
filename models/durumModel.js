const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("@hapi/joi");
const createError = require('http-errors');
//error


const DurumSchema = new Schema(
  {
    uid: {
      type: Schema.Types.ObjectId,
      required: true,
      trim: true,
    },
    isim: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    text: {
      type: String,
      required: [true, "Text boş olamaz"],
      trim: true,
      lowercase: true,
      default:"Merhaba ben burada yeniyim"
    },
    durum: {
      type: Boolean,
      required: true,
      default:true
    }
  },
  { collection: "durumlar", timestamps: true }
);




DurumSchema.methods.toJSON = function () {
  const durum = this.toObject();
  delete durum.createdAt;
  delete durum.updatedAt;
  delete durum.__v;

  return durum;
};



const Durum = mongoose.model("Durum", DurumSchema);

module.exports = Durum;
