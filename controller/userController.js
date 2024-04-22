const User = require('./../model/user')
const { logEvents } = require('./../middleware/logger')
const generateId = require('./sequenceController')
const message = require('./../config/message')
const bcrypt = require('bcrypt')

const getAllUsers = async (req, res) => {
  const result = await User.find({}).select('-password').exec()
  if (!result?.length)
    return res.status(400).json({ message: message.notFoundMessage })
  res.json(result)
}
const createUser = async (req, res) => {
  const { email, password, firstName, lastName } = req.body
  if (!email || !password || !firstName || !lastName)
    return res.status(400).json({ message: message.requiredMessage })

  const duplicate = await User.findOne({
    email: { $regex: email, $options: 'i' },
  })

  if (duplicate)
    return res
      .status(409)
      .json({ message: `Duplicate Email: ${email} already exist!` })

  const hashedPwd = await bcrypt.hash(password, 10)

  const userObj = {
    firstName,
    password: hashedPwd,
    email,
    lastName,
  }

  const result = await User.create(userObj)
  const newId = await generateId('userId')
  result.idUser = newId
  const createdResult = await result.save()

  if (createdResult) {
    logEvents(
      'users.txt',
      `Created(${req.method}): \t Email: ${createdResult.email} has been created \t ${req.url}\t${req.headers.origin}`
    )
    return res.status(201).json(createdResult)
  } else {
    return res.status(400).json({ message: `Error: Record not Created` })
  }
}

// const updateuser = async (req, res) => {
//   const {
//     iduser,
//     username,
//     password,
//     email,
//     fullName,
//     phoneNumber,
//     active,
//     group,
//   } = req.body
//   if (!username || !password || !email || !iduser)
//     return res.status(400).json({ message: message.requiredMessage })

//   const foundResult = await user.findOne({ iduser }).exec()
//   //  const history = await Customer.findOne({ code })
//   //    .select('custName active')
//   //    .lean()

//   if (!foundResult)
//     return res.status(400).json({ message: message.notFoundMessage })

//   // Check for Duplicate

//   const duplicate = await user.exists({
//     username: { $regex: username, $options: 'i' },
//   })

//   if (duplicate && String(foundResult._id) !== String(duplicate._id)) {
//     return res
//       .status(409)
//       .json({ message: `Duplicate code: ${username} already exist!` })
//   }
//   const hashPwd = await bcrypt.hash(password, 10)

//   foundResult.username = username
//   foundResult.password = hashPwd
//   foundResult.active = active
//   foundResult.fullName = fullName
//   foundResult.phoneNumber = phoneNumber
//   foundResult.group = group

//   const updatedResult = await foundResult.save()

//   if (updatedResult) {
//     // logEvents(
//     //   'customer.txt',
//     //   `Updated(${req.method}): \t Code: ${updatedResult.code}\t Old Name: ${history.custName} - \t New Name: ${updatedResult.custName}\t ${req.url}\t${req.headers.origin}`
//     // )
//     return res.status(200).json(updatedResult)
//   } else {
//     return res.status(400).json({ message: `Error: Record not Updated` })
//   }
// }
// const deleteuser = async (req, res) => {
//   const { username } = req.body
//   if (!username)
//     return res.status(400).json({ message: message.requiredMessage })

//   const foundResult = await user.findOne({ username }).exec()

//   if (!foundResult)
//     return res.status(400).json({ message: message.notFoundMessage })
//   const deletedResult = await foundResult.deleteOne()
//   if (deletedResult) {
//     return res
//       .status(200)
//       .json({ message: `username ${foundResult.username} has been deleted` })
//   } else {
//     return res.status(400).json({ message: `Error: Record not Deleted` })
//   }
// }
// const getOneuser = async (req, res) => {
//   const { id } = req.params
//   if (!id) return res.status(400).json({ message: message.requiredMessage })

//   if (isNaN(Number(id))) {
//     return res.status(400).json({ message: `Invalid ID: Enter a valid ID` })
//   }

//   const foundResult = await user
//     .findOne({ iduser: Number(id) })
//     .populate({
//       path: 'group',
//       select: 'permission code -_id',
//     })
//     .exec()
//   !foundResult
//     ? res.status(400).json({ message: message.notFoundMessage })
//     : res.json(foundResult)
// }

module.exports = {
  getAllUsers,
  createUser,
}
