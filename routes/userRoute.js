const express = require('express')
const router = express.Router()
const { getAllUsers, createUser } = require('./../controller/userController')

router.route('/').get(getAllUsers).post(createUser).put().delete()

module.exports = router
