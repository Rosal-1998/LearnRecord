const http = require('http')

const server = http.createServer((req, res) => {
  console.log('req.url', req.url)
  res.writeHead(200, {
    // 'content-type': 'application/json',
    // 'access-control-allow-origin': '*',
    // 'access-control-allow-headers': 'name'
    // 'access-control-allow-method': 'get,post,put,option,delete'
  })
  res.end(
    JSON.stringify({
      name: 'lxfriday',
      age: 1111
    })
  )
})

server.listen(3000)
console.log('listenning')