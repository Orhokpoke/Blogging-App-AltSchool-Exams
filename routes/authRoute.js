const express = require('express')
const router = express.Router()
const {
  handleLogin,
  handleLogout,
  handleRefresh,
} = require('./../controller/authController')

router.route('/').post(handleLogin)
router.route('/refresh').get(handleRefresh)
router.route('/logout').post(handleLogout)

module.exports = router
