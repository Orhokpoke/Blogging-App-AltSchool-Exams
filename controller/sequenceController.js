const Sequence = require('./../model/sequence')

const generateId = async (name) => {
  const result = await Sequence.findOne({ collectionName: name }).exec()
  if (!result) {
    const newValue = await Sequence.create({
      collectionName: name,
      counter: 1,
    })
    return newValue.counter
  } else {
    result.counter = result.counter + 1
    await result.save()
    return result.counter
  }
}

module.exports = generateId
