const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("@hapi/joi");
const createError = require("http-errors");
//error

const ArkadasIstekSchema = new Schema(
  {
    istekYollananId: {
      type: Schema.Types.ObjectId,
      required: true,
      trim: true,
    },
    numberUnique: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    istekYollayanIsim: {
      type: String,
      required: true,
      trim: true,
    },
    istekYollayanUserName:{
      type: String,
      required: true,
      trim: true,
    },
    istekYollayanId: {
      type: Schema.Types.ObjectId,
      required: true,
      trim: true,
    },
  },
  { collection: "istekler", timestamps: true }
);

ArkadasIstekSchema.methods.toJSON = function () {
  const arkadasIstek = this.toObject();
  delete arkadasIstek.createdAt;
  delete arkadasIstek.updatedAt;
  delete arkadasIstek.__v;

  return arkadasIstek;
};

const ArkadasIstek = mongoose.model("ArkadasIstek", ArkadasIstekSchema);

module.exports = ArkadasIstek;
