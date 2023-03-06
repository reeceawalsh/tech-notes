const allowedOrigins = require('./allowedOrigins')

// checks if website fetching is on the list of allowedOrigins and returns an error if not
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }, 
  credentials: true, 
  optionsSuccessStatus: 200
}

module.exports = corsOptions