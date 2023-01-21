import bcrypt from 'bcrypt'
import express from 'express'
import passport from 'passport'
import { bcryptConfig } from '../../bcryptConfig'
import User from '../../models/User'

const router = express.Router()

router.get('/login', function (_req, res) {
  res.render('user/login')
})

router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/api/user/login'
  }),
  function (req, res) {
    res.redirect('/')
  }
)

router.get('/signup', function (_req, res) {
  res.render('user/signup')
})

router.post('/signup', async (req, res) => {
  const { body } = req

  if (body.password === body['password-repeat']) {
    const salt = bcrypt.genSaltSync(bcryptConfig.saltRounds)
    const hashedPassword = bcrypt.hashSync(body.password, salt)

    const newUser = {
      login: body.username,
      password: hashedPassword
    }

    try {
      const user = new User(newUser)

      await user.save()

      res.redirect('/')
    } catch (e) {
      console.error(e)
    }
  }
})

router.get(
  '/me',
  function (req, res, next) {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      if (req.session) {
        req.session.returnTo = req.originalUrl || req.url
      }
      return res.redirect('/api/user/login')
    }
    next()
  },
  function (req, res) {
    res.render('user/profile', { user: req.user })
  }
)

router.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})

export { router as userApiRouter }
