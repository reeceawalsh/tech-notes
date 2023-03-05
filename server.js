const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 3500

app.use('/', express.static(path.join(__dirname, '/public'))) // __dirname is a global variable (look in folder we are in). 

app.use('/', require('./routes/root')) // looking for routes folder and root file

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


// will point to the server destination 
app.listen(PORT, () => console.log(`Server available at http://localhost:${PORT}`))