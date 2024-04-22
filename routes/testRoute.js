const express = require('express')
const router = express.Router()
const { getTest, postTest } = require('./../controller/testController')
const verifyJWT = require('./../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/').get(getTest).post(postTest)

// router.route('/delete').delete(deleteAllTest)

// router
//   .route('/user')
//   .get(getUser)
//   .post(createUser)
//   .put(updateUser)
//   .delete(deleteUser)

// router.route('/:id').get(getOneTest)

module.exports = router
