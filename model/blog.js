const mongoose = require('mongoose')
const { Schema, model } = mongoose
const blogEnum = require('./../config/enum')
const blogsSchema = new Schema(
  {
    idBlog: Number,
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      enum: {
        values: blogEnum,
        message: '{VALUE} is not supported',
      },
      required: true,
    },
    tags: {
      type: String,
    },
    // readCount: {},
    // readingTime: {},
  },
  { timestamps: true }
)

const Blog = model('Blog', blogsSchema)

module.exports = Blog
