const express = require('express')
const router = express.Router()
const { getAllBlog, getABlog } = require('./../controller/blogController')

router.route('/').get(getAllBlog)

router.route('/:id').get(getABlog)

module.exports = router
