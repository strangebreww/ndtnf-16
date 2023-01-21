const router = require('express').Router()

router.get('/', (_req, res) => {
  res.render('index', { title: 'Главная' })
})

module.exports = router
