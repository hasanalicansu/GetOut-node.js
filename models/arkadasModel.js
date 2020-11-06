const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("@hapi/joi");
const createError = require("http-errors");
//error

const ArkadasSchema = new Schema(
  {
    kullaniciId: {
      type: Schema.Types.ObjectId,
      required: true,
      trim: true,
    },
    arkadasId: {
        type: Schema.Types.ObjectId,
        required: true,
        trim: true,
      },
    numberUnique: {
        type: String,
        required: true,
        trim: true,
        unique: true,
      }
  },
  { collection: "arkadaslar", timestamps: true }
);



ArkadasSchema.methods.toJSON = function () {
  const arkadas = this.toObject();
  delete arkadas.createdAt;
  delete arkadas.updatedAt;
  delete arkadas.__v;

  return arkadas;
};

const Arkadas = mongoose.model("Arkadas", ArkadasSchema);

module.exports = Arkadas;
