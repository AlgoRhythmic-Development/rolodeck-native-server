const { Schema, model } = require("mongoose");

const cardSchema = new Schema(
  {
    logoUrl: {
      type: String,
      unique: false,
      default: "",
    },
    companyName: {
      type: String,
      default: "",
    },
    tagline: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^(\+0?1\s)?\(?\d{3}\)?[\s-]\d{3}[\s-]\d{4}$/im.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    email: {
      type: String,
      required: true,
      match: [/.+@.+\..+/, "Must match an email address!"],
    },
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

const Card = model("Card", cardSchema);

module.exports = Card;
