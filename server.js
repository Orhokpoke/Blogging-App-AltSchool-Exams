require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()
const path = require('path')
const cookieParser = require('cookie-parser')
const errorHandler = require('./middleware/errorHandler')
const { logger, logEvents } = require('./middleware/logger')
const cors = require('cors')
const mongoose = require('mongoose')
const corsOptions = require('./config/corsOptions')
const PORT = process.env.PORT || 7500
const connectDB = require('./config/dbConnect')

connectDB()

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(express.static(path.join(__dirname, 'view', 'public')))

app.use('/', require('./routes/root'))
app.use('/test', require('./routes/testRoute'))
app.use('/blog', require('./routes/blogRoute'))
app.use('/auth', require('./routes/authRoute'))
app.use('/user', require('./routes/userRoute'))
app.use('/myBlog', require('./routes/myBlogRoute'))

app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'view', 'error404.html'))
  } else if (req.accepts('json')) {
    res.json({ message: 'Error 404 not found' })
  } else {
    res.type('txt').send(`Error 404 not found`)
  }
})

app.use(errorHandler)

mongoose.connection.on('open', () => {
  console.log('Connected to MongoDb')
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
})
// mongoose.connection.on('disconnected', (err) => {
//   console.log('Disconnected from MongoDb')
// })
mongoose.connection.on('error', (err) => {
  logEvents('mongoErr.txt', `${err.name}\t${err.message}`)
  console.log(err)
})
