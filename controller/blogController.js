const Blog = require('./../model/blog')
const User = require('./../model/user')
const { logEvents } = require('./../middleware/logger')
const generateId = require('./sequenceController')
const message = require('./../config/message')

const getAllBlog = async (req, res) => {
  const result = await Blog.find({ state: 'Publish' }).lean()
  if (!result?.length)
    return res.status(400).json({ message: message.notFoundMessage })
  res.json(result)
}

const getABlog = async (req, res) => {
  const { id } = req.params
  if (!id) return res.status(400).json({ message: message.requiredMessage })

  if (isNaN(Number(id))) {
    return res.status(400).json({ message: `Invalid ID: Enter a valid ID` })
  }

  const foundResult = await Blog.findOne({ idBlog: Number(id) }).lean()
  if (!foundResult || foundResult.state === 'Draft')
    return res.status(400).json({ message: 'No Blog Post found!' })
  res.status(200).json(foundResult)
}

module.exports = {
  getAllBlog,
  getABlog,
}
