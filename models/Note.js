const mongoose = require('mongoose')

const noteSchema = new mongoose.Scheme(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, 
      required: true,
      ref: 'User'
    }, 
    title: {
      type: String, 
      required: true
    }, 
    text: {
      type: String, 
      required: true
    }, 
    completed: {
      type: Boolean, 
      default: false
  }
}, 
  {
    timestamps: true // mongoose gives created and updated timestamps
  }
)

module.exports = mongoose.model('Note', noteSchema)