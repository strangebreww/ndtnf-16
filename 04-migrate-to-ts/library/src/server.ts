import bcrypt from 'bcrypt'
import express from 'express'
import expressSession from 'express-session'
import http from 'http'
import mongoose from 'mongoose'
import passport from 'passport'
import passportLocal from 'passport-local'
import { Server } from 'socket.io'
import errorMiddleware from './middleware/error'
import User from './models/User'
import { booksApiRouter } from './routes/api/books'
import { userApiRouter } from './routes/api/user'
import { booksRouter } from './routes/books'
import { indexRouter } from './routes/index'

const LocalStrategy = passportLocal.Strategy

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.set('view engine', 'ejs')

app.use(require('body-parser').urlencoded({ extended: true }))
app.use(
  expressSession({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.use('/', indexRouter)
app.use('/books', booksRouter)
app.use('/api/user', userApiRouter)
app.use('/api/books', booksApiRouter)

app.use(errorMiddleware)

async function verify (username: string, password: string, done: Function) {
  try {
    const user = await User.findOne({ login: username }).select('-__v')

    if (!user) {
      return done(null, false)
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return done(null, false)
    }

    return done(null, user)
  } catch (e) {
    return done(e)
  }
}

const options = {
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: false
} as const

passport.use('local', new LocalStrategy(options, verify))

passport.serializeUser(function (user: Record<string, any>, cb) {
  cb(null, user._id)
})

passport.deserializeUser(async function (id, cb) {
  try {
    const user = await User.findById(id).select('-__v')

    cb(null, user)
  } catch (e) {
    return cb(e)
  }
})

io.on('connection', (socket) => {
  const { id } = socket

  console.log(`Socket connected: ${id}`)

  const { roomName } = socket.handshake.query

  console.log(`Socket roomName: ${roomName}`)

  socket.join(roomName)

  socket.on('message-to-room', (msg) => {
    socket.to(roomName).emit('message-to-room', msg)
    socket.emit('message-to-room', msg)
  })

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${id}`)
  })
})

const port = process.env.PORT || 3000
const dbName = process.env.DB_NAME || 'library_service'

async function start () {
  try {
    const UrlDb = `mongodb://mongo:27017/${dbName}`
    await mongoose.connect(UrlDb)

    server.listen(port, () => {
      console.log(`Server started on port ${port}`)
    })
  } catch (e) {
    console.log(e)
  }
}

start()
