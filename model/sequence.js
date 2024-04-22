const mongoose = require('mongoose')
const { Schema, model } = mongoose

const sequenceSchema = new Schema({
  collectionName: {
    type: String,
    required: true,
  },
  counter: Number,
})

const Sequence = model('Sequence', sequenceSchema)

module.exports = Sequence
