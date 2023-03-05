const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

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

// sets up a field that will increment after each note is created (starts at 500)
noteSchema.plugin(AutoIncrement, {
  inc_field: 'ticket', 
  id: 'ticketNums',
  start_seq: 500
})

module.exports = mongoose.model('Note', noteSchema)