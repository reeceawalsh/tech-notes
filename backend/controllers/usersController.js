const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')
const bcrypt = require ('bcrypt')

// @desc Get all users (all user data except password)
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').lean()
  if (!users?.length) return res.status(400).json({ message: 'No  users found' })
  res.json(users)
})

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body

  // confirm data 
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: 'All fields are required'})
  }

  // check duplicate user
  const duplicate = await User.findOne( { username }).lean().exec()
  if (duplicate) {
    return res.status(409).json({ message: 'Username has already been taken' })
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10) // add 10 salt rounds
  const userObject = { username, 'password': hashedPassword, roles }

  // create and store new user 
  const user = await User.create(userObject)

  if (user) { // created
    res.status(201).json({ message: `New user ${username} created`})
  } else {
    res.status(400).json({ message: 'Invalid user data received'})
  }
})

// @desc Update user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, roles, active, password } = req.body
  
  // confirm data
  if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
    return res.status(400).json({ message: 'All fields are required'})
  }

  const user = await User.findById(id).exec()
  if (!user) {
    return res.status(400).json({ message: 'User not found' })
  }

  // check for duplicate
  const duplicate = await User.findOne({ username }).lean().exec()
  // allow updates to same user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Username has already been taken'})
  }

  user.username = username
  user.roles = roles
  user.active = active

  // hash password
  if (password) user.password = await bcrypt.hash(password, 10) // 10 salt rounds
  const updateUser = await user.save() 

  res.json({ message: `${updateUser.username} was updated` })
})

// @desc Remove user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body

  if (!id) return res.status(400).json({ message: 'User ID Required'})

  const note = await Note.findOne({ user: id }).lean().exec()
  if (note) return res.status(400).json({ message: 'User has assigned notes'})

  const user = await User.findById(id).exec()

  if (!user) return res.status(400).json({ message: 'User not found' })

  const result = await user.deleteOne() // store deleted user info 
  const reply = `Username ${result.username} with ID ${result._id} deleted` 
  res.json(reply)
})

module.exports = { 
  getAllUsers, 
  createNewUser, 
  updateUser,
  deleteUser
}