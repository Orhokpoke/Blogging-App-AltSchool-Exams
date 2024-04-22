const mongoose = require('mongoose')
const { Schema, model } = mongoose

const usersSchema = new Schema(
  {
    idUser: Number,
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

const User = model('User', usersSchema)

module.exports = User
