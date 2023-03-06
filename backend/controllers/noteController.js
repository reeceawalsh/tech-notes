const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')

// @desc Get all notes 
// @route GET /notes
// @access Private
const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find().lean()
  // if no notes
  if (!notes?.length) return res.status(400).json({ message: 'No  notes found' })
  res.json(notes)

  // add username to each note before sending response
  const notesWithUser = await Promise.all(notes.map(async (note) => {
    const user = await User.findById(note.user).lean().exec()
    return { ...note, username: user.username }
  }))

  res.json(notesWithUser)
})

// @desc Create new note
// @route POST /notes
// @access Private
const createNewNote = asyncHandler(async (req, res) => {
  const { user, title, text } = req.body
  console.log(user)

  // confirm data 
  if (!user || !title || !text) {
    return res.status(400).json({ message: 'All fields are required'})
  }

  // check for duplicate title 
  const duplicate = await Note.findOne({ title }).lean().exec() 


  if (duplicate) return res.status(409).json({ message: 'Duplicate note title' })

  // create and store new note 
  const note = await Note.create({ user, title, text })

  if (note) { // created
    res.status(201).json({ message: `New note created`})
  } else {
    res.status(400).json({ message: 'Invalid note data received'})
  }
})

// @desc Update user
// @route PATCH /users
// @access Private
const updateNote = asyncHandler(async (req, res) => {
  const { id, user, title, text, completed } = req.body
  
  // confirm data
  if (!id || !user || !title || !text || typeof completed !== 'boolean') {
    return res.status(400).json({ message: 'All fields are required'})
  }

  const note = await Note.findById(id).exec()

  if (!note) {
    return res.status(400).json({ message: 'Note not found' })
  }

  // check for duplicate
  const duplicate = await Note.findOne({ title }).lean().exec()

  // allow updates to same note
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate note title'})
  }

  user.user = user
  note.title = title
  note.text = text
  note.completed = completed

  const updatedNote = await note.save()

  res.json(`'${updatedNote.title}' updated`)
})

// @desc Remove note
// @route DELETE /notes
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.body

  if (!id) return res.status(400).json({ message: 'Note ID Required' })

  const note = await Note.findById(id).exec()

  if (note) return res.status(400).json({ message: 'Note not found' })

  const result = await note.deleteOne() // store deleted user info 
  const reply = `Note ${result.title} with ID ${result._id} deleted` 
  res.json(reply)
})

module.exports = { 
  getAllNotes, 
  createNewNote, 
  updateNote,
  deleteNote
}