const express = require('express')
const redis = require('redis')

const app = express()

const redisUrl = process.env.REDIS_URL || 'redis://localhost'

const client = redis.createClient({ url: redisUrl });

(async () => {
  await client.connect()
})()

app.post('/counter/:bookId/incr', async (req, res) => {
  const { bookId } = req.params

  try {
    const counter = await client.incr(bookId)

    res.status(201).json({ counter })
  } catch (e) {
    console.log(e.message)

    res.status(404).send('not found')
  }
})

app.get('/counter/:bookId', async (req, res) => {
  const { bookId } = req.params

  try {
    const visits = (await client.get(bookId)) ?? 0

    res.status(200).send(visits.toString())
  } catch (e) {
    console.log(e.message)

    res.status(404).send('not found')
  }
})

const port = process.env.PORT || 3001

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
