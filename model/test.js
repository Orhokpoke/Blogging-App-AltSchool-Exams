const mongoose = require('mongoose')

const { Schema, model } = mongoose

const testSchema = new Schema({
  idTest: Number,
  code: {
    type: String,
    required: true,
  },
  cName: {
    type: String,
    required: true,
  },
  //   userId: {
  //     type: Schema.Types.ObjectId,
  //     ref: 'User',
  //   },
})

const Test = model('Test', testSchema)

module.exports = Test
