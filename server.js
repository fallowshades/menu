const express = require('express')
const cors = require('cors')
const { createProxyMiddleware } = require('http-proxy-middleware')
require('dotenv').config()
const app = express()
const port = 3000
app.use(cors())
const apiProxy = createProxyMiddleware({
  target: 'https://6ldruff9ul.execute-api.eu-north-1.amazonaws.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '',
  },
  onProxyReq: (proxyReq) => {
    proxyReq.setHeader('x-zocom', process.env.PIZZA_API_KEY)
  },
})
app.use('/api', apiProxy)
app.listen(port, () => {
  console.log(`Proxy server listening at http://localhost:${port}`)
})
