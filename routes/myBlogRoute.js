const express = require('express')
const router = express.Router()
const {
  getAllMyBlog,
  getABlog,
  createABlog,
  updateBlog,
} = require('./../controller/myBlogController')

const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/').get(getAllMyBlog).post(createABlog).put().delete()

router.route('/draft').get().post().put().delete()

router.route('/draft/:id').get().delete()

router.route('/:id').get()

module.exports = router
