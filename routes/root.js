const express = require('express')
const router = express.Router()
const path = require('path')

router.route('^/$|/index(.html)?').get((req, res) => {
  res.sendFile(path.join(__dirname, '..', 'view', 'index.html'))
})

module.exports = router
