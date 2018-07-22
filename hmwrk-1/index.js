/*
 * Primary file for API
 */

// Dependencies
const http = require("http")
const https = require("https")
const url = require("url")
const { StringDecoder } = require("string_decoder")
const { readFileSync } = require("fs")

const config = require("./config")

// a more convenient partial evaluator
const partial = (f, ...args) => f.bind(null, ...args)
const log = (s, ...args) => console.log(s, ...args)

const getTrimmedPathFromRequest = parsedUrl =>
  parsedUrl.pathname.replace(/^\/+|\/+$/g, "")

const serverHandler = (req, res) => {
  const parsedUrl = url.parse(req.url, true)
  const queryParams = parsedUrl.query
  const headers = req.headers

  const trimmedPath = getTrimmedPathFromRequest(parsedUrl)
  const methodStr = req.method.toLowerCase()

  let buffer = ""
  const decoder = new StringDecoder("utf-8")
  req.on("data", chunk => (buffer += decoder.write(chunk)))

  req.on("end", () => {
    buffer += decoder.end()

    let chosenHandler = router[trimmedPath] || handlers.notFound

    const cb = (status, payload) => {
      let code = status || 200
      let returnedData = payload || {}

      let payloadStr = JSON.stringify(returnedData)

      res.setHeader("Content-Type", "application/json")
      res.writeHead(code)
      res.end(payloadStr)

      console.log("We did it!", code, payloadStr)
    }

    chosenHandler(
      {
        trimmedPath,
        headers,
        queryStringObject: queryParams,
        payload: buffer,
        method: req.method,
      },
      cb
    )
  })
}

// Instantiate http/https servers
const httpServer = http.createServer(serverHandler)
const httpsServer = https.createServer(
  {
    key: readFileSync("./https/key.pem"),
    cert: readFileSync("./https/cert.pem"),
  },
  serverHandler
)

// Start the server
httpServer.listen(
  config.httpPort,
  partial(
    log,
    "HTTP server is up on port " +
      config.httpPort +
      ", in " +
      config.envName +
      " mode"
  )
)

httpsServer.listen(
  config.httpsPort,
  partial(
    log,
    "HTTPS server is up on port " +
      config.httpsPort +
      ", in " +
      config.envName +
      " mode"
  )
)

const handlers = {
  ping: (data, cb) => cb(200),
  notFound: (data, cb) => cb(404),
  hello: (data, cb) => {
    if (data.method == "POST") {
      return cb(200, { message: "🤖 Form Voltron! 🤖" })
    }

    cb(400)
  },
}

const router = {
  ping: handlers.ping,
  hello: handlers.hello,
}
