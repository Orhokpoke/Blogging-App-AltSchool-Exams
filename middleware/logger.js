const path = require('path')
const fs = require('fs')
const fsPromises = require('fs/promises')
const { format } = require('date-fns')
const { v4: uuid } = require('uuid')

const logEvents = async (filename, message) => {
  const dateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss')

  const logItem = `${dateTime}\t ${uuid()} \t ${message}\n`

  try {
    if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
      fs.mkdirSync(path.join(__dirname, '..', 'logs'))
    }

    await fsPromises.appendFile(
      path.join(__dirname, '..', 'logs', filename),
      logItem
    )
  } catch (error) {
    console.log(error)
  }
}

const logger = (req, res, next) => {
  logEvents(
    'ReqLog.txt',
    `${req.method} \t ${req.url} \t ${req.headers.origin}`
  )
  next()
}

module.exports = { logEvents, logger }
