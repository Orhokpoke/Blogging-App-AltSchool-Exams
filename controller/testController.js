const Test = require('./../model/test')
const generateId = require('./sequenceController')
// const message = require('./../config/message')

const getTest = async (req, res) => {
  //   const results = await Test.find()
  //     .populate({ path: 'userId', select: 'idUser username -_id' })
  //     .where({ userId: '65cdd3f706224090d6263e1b' })
  //     .limit(2)
  //     .exec()
  //   if (!results?.length)
  //     return res.status(400).json({ message: `No record found` })
  //   res.json(results)

  const results = await Test.find()
  if (!results?.length)
    return res.status(400).json({ message: `No record found here` })
  res.json(results)
}

const postTest = async (req, res) => {
  const { code, cName } = req.body

  if (!code || !cName)
    return res.status(404).json({ Error: 'All fields are required' })

  const duplicate = await Test.exists({ code: { $regex: code, $options: 'i' } })

  if (duplicate) return res.status(409).json({ message: `Duplicate code` })

  const testObj = {
    code,
    cName,
  }
  const result = await Test.create(testObj)
  const newId = await generateId('testId')

  result.idTest = newId

  const createdResult = await result.save()

  if (createdResult) return res.status(201).json(createdResult)
}

const updateTest = async (req, res) => {}
const deleteTest = async (req, res) => {
  const { code } = req.body
  if (!code) return res.status(400).json({ message: message.requiredMessage })

  const foundResult = await Test.findOne({ code }).exec()

  if (!foundResult)
    return res.status(400).json({ message: message.notFoundMessage })
  const deletedResult = await foundResult.deleteOne()
  if (deletedResult) {
    return res
      .status(200)
      .json({ message: `Code ${foundResult.code} has been deleted` })
  } else {
    return res.status(400).json({ message: `Error: Record not Deleted` })
  }
}

const deleteAllTest = async (req, res) => {
  const deletedResult = await Test.deleteMany({}).exec()
  if (deletedResult.deletedCount == 0) {
    return res.status(400).json({ message: message.notFoundMessage })
  } else {
    return res
      .status(200)
      .json({ message: `${deletedResult.deletedCount} record(s) deleted` })
  }
}

const getOneTest = async (req, res) => {
  const { id } = req.params
  if (!id) return res.status(400).json({ message: message.requiredMessage })

  if (isNaN(Number(id))) {
    return res.status(400).json({ message: `Invalid ID: Enter a valid ID` })
  }

  // const result = await Test.findOne({ idTest: Number(id) })
  //   .populate('userId', 'idUser username' })
  //   .exec()

  // use the object model in the populate Query

  const result = await Test.findOne({ idTest: Number(id) })
    .populate({ path: 'userId', select: 'idUser username' })
    .exec()

  if (!result) return res.status(400).json({ Message: message.notFoundMessage })

  res.status(200).json(result)
}

// User Controller to test populate and store userID
const getUser = async (req, res) => {
  const results = await User.find({}).exec()
  if (!results?.length)
    return res.status(400).json({ message: `No record found` })
  res.json(results)
}
const createUser = async (req, res) => {
  const { username, password } = req.body

  if (!username || !password)
    return res.status(404).json({ Error: 'All fields are required' })

  const duplicate = await User.exists({
    username: { $regex: username, $options: 'i' },
  })

  if (duplicate) return res.status(409).json({ message: `Duplicate username` })

  const hashPwd = await bcrypt.hash(password, 10)

  const userObj = {
    username,
    password: hashPwd,
  }
  const result = await User.create(userObj)
  const newId = await generateId('userId')

  result.idUser = newId

  const createdResult = await result.save()

  if (createdResult) return res.status(201).json(createdResult)
}

const updateUser = async (req, res) => {}
const deleteUser = async (req, res) => {}

module.exports = {
  getTest,
  postTest,
  updateTest,
  deleteTest,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  deleteAllTest,
  getOneTest,
}
