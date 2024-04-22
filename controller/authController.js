const User = require('./../model/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const handleLogin = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password)
    return res.status(400).json({ message: 'Email and Password is required' })

  const foundUser = await User.findOne({ email }).exec()

  if (!foundUser)
    return res.status(401).json({ message: `email ${email} not found` })

  const match = await bcrypt.compare(password, foundUser.password)

  if (match) {
    // const roles = Object.values(foundUser.roles)
    // Create JWT
    const accessToken = jwt.sign(
      {
        userInfo: {
          email: foundUser.email,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    )

    const refreshToken = jwt.sign(
      { email: foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    )

    res.cookie('jwt', refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: 'None',
    })
    res.status(201).json({ accessToken })
  } else {
    res.status(401).json({ Error: `Email and Password does not match` })
  }
}

const handleRefresh = async (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt)
    return res.status(401).json({ message: 'JWT cookie not found' })

  const refreshToken = cookies.jwt

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ error: `${err.message}` })

      const foundUser = await User.findOne({ email: decoded.email }).exec()
      if (!foundUser)
        return res.status(403).json({ message: 'Email not found' })

      // Generate a new Access token
      const accessToken = jwt.sign(
        {
          userInfo: { email: foundUser.email },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }
      )

      res.json({ accessToken })
    }
  )
}
const handleLogout = async (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204)

  // const foundUser = await User.findOne({ email: decoded.email }).exec()
  // if (foundUser) {
  //   res.clearCookie('jwt', { maxAge: 1000 * 60 * 60 * 24, httpOnly: true })
  //   res.status(200).json({ message: 'Cookie cleared!' })
  // }

  res.clearCookie('jwt', { maxAge: 1000 * 60 * 60 * 24, httpOnly: true })
  res.status(200).json({ message: 'Cookie cleared!' })
}

module.exports = {
  handleLogin,
  handleLogout,
  handleRefresh,
}
