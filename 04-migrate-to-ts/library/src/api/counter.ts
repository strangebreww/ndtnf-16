const http = require('http')

function getCounter (id) {
  const url = `${process.env.COUNTER_URL}/counter/${id}`

  return new Promise((resolve) => {
    http.get(url, (res) => {
      res.setEncoding('utf8')

      let rawData = ''

      res.on('data', (chunk) => {
        rawData = rawData + chunk
      })

      res.on('end', () => {
        try {
          resolve(rawData)
        } catch (e) {
          console.error(e.message)
        }
      })
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`)
    })
  })
}

function incCounter (id) {
  const url = `${process.env.COUNTER_URL}/counter/${id}/incr`

  return new Promise((resolve) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Length': 0
      }
    }

    http.request(url, options, (res) => {
      res.setEncoding('utf8')

      let rawData = ''

      res.on('data', (chunk) => {
        rawData = rawData + chunk
      })

      res.on('end', () => {
        try {
          resolve(rawData)
        } catch (e) {
          console.error(e.message)
        }
      })
    })
      .on('error', (e) => {
        console.error(`Got error: ${e.message}`)
      })
      .end()
  })
}

module.exports = { incCounter, getCounter }
