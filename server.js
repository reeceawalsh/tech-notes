require("dotenv").config({ path: ".env" });
const express = require('express')
const app = express()
const path = require('path')
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3500

console.log(process.env.NODE_ENV)

connectDB() 

app.use(logger) 
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, 'public'))) // __dirname is a global variable (look in folder we are in). 

app.use('/', require('./routes/root')) // looking for routes folder and root file

// deals with everything that didn't match anything above
// this code should be at the end of the routes but before the app.listen
app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
    res.json({ message: '404 Not Found' })
  } else {
    res.type('txt').send('404 Not Found')
  }
})

// error handler
app.use(errorHandler)

// will point to the server destination 
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
  app.listen(PORT, () => console.log(`Server available at http://localhost:${PORT}`))
})

// will provide an error to the log if connection doesn't work
mongoose.connection.on('error', err => {
  console.log(err)
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})