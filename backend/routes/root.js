const express = require('express')
const router = express.Router()
const path = require('path')

// if it starts and ends with / or if its /index with or without index.html
router.get('^/$|/index(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
} ) 

module.exports = router