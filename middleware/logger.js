const { format } = require('date-fns')
const { v4: uuid } = require('uuid') // comes in as v4 but renames to uuid
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

// \t = tab | \n = new line 
// logItem is the log message (date, time, unique log id, the request)
const logEvents = async (message, logFileName) => {
  const dateTime = format(new Date(), 'ddMMyyyy\tHH:mm:ss')
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`

  // creates a logs folder if it doesn't exist then adds a log file to the folder
  try {
    if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
      await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
    }
    await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem)
  } catch (err) {
    console.log(err)
  }
}

// logs all requests 
const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
  console.log(`${req.method} ${req.path}`)
  next()
}

module.exports = { logEvents, logger }