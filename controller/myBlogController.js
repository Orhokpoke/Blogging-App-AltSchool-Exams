const Blog = require('./../model/blog')
const User = require('./../model/user')
const { logEvents } = require('./../middleware/logger')
const generateId = require('./sequenceController')
const message = require('./../config/message')

const getAllMyBlog = async (req, res) => {
  const result = await Blog.find({ email: req.email }).lean()
  if (!result?.length)
    return res.status(400).json({ message: message.notFoundMessage })
  res.json(result)
}

const createABlog = async (req, res) => {
  const { title, description, body, state, tags } = req.body
  if (!title || !body || !state)
    return res.status(400).json({ message: message.requiredMessage })

  const duplicate = await Blog.exists({
    title: { $regex: title, $options: 'i' },
  })

  if (duplicate)
    return res
      .status(409)
      .json({ message: `Duplicate title: ${title} already exist!` })

  const loggedUser = await User.findOne({ email: req.email }).exec()

  if (!loggedUser)
    return res.status(400).json({ message: message.notFoundMessage })

  const blogObj = {
    title,
    description,
    author: loggedUser._id,
    body,
    state,
    tags,
  }
  const createdRecord = await Blog.create(blogObj)

  const newID = await generateId('blogId')
  createdRecord.idBlog = newID
  const updatedRecord = await createdRecord.save()

  if (updatedRecord) {
    logEvents(
      'blog.txt',
      `Created(${req.method})\t Title: ${updatedRecord.title} has been created \t Email: ${loggedUser.email}\t ${req.url}\t${req.headers.origin}`
    )

    return res.status(201).json(updatedRecord)
  } else {
    return res.status(400).json({ message: `Error: Record not Created` })
  }
}

const updateBlog = async (req, res) => {
  const { title, description, body, state, tags } = req.body
  if (!title || !body || !state)
    return res.status(400).json({ message: message.requiredMessage })

  const foundResult = await Blog.findOne({ title }).exec()

  if (!foundResult)
    return res.status(400).json({ message: message.notFoundMessage })

  const duplicate = await Blog.exists({
    title: { $regex: title, $options: 'i' },
  })

  if (duplicate && String(foundResult._id) !== String(duplicate._id)) {
    return res
      .status(409)
      .json({ message: `Duplicate title: ${title} already exist!` })
  }

  foundResult.title = title
  foundResult.description = description
  foundResult.body = body
  foundResult.state = state
  foundResult.tags = tags

  const updatedResult = await foundResult.save()

  if (updatedResult) {
    logEvents(
      'blog.txt',
      `Updated(${req.method}): \t Title: ${updatedResult.title}\t has been updated \t ${req.url}\t${req.headers.origin}`
    )
    return res.status(200).json(updatedResult)
  } else {
    return res.status(400).json({ message: `Error: Record not Updated` })
  }
}

const deleteAllBlog = async (req, res) => {}
const deleteOneBlog = async (req, res) => {}

module.exports = {
  getAllMyBlog,
  createABlog,
  updateBlog,
  deleteAllBlog,
  deleteOneBlog,
}
