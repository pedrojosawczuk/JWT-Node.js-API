const router = require('express').Router()
const User = require('../model/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { registerValidation, loginValitation } = require('../validation')

// Register
router.post('/register', async (req, res) => {
    // Lets Validate the data before we add a user
    const { error } = registerValidation(req.body)
    if(error) return res.status(400).json({ error: error.details[0].message }).send()
  
    // Checking if the User is already in the database
    const emailExist = await User.findOne({ email: req.body.email })
    if(emailExist) return  res.status(400).json({ error: 'Email already exists' }).send()
  
    // Hash passwords
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
  
    // Create a new User
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })
    
    try {
        const savedUser = await user.save()
        res.send(savedUser)
    } catch(err) {
        res.status(400).json({ error: err }).send()
    }
})

// Login
router.post('/login', async (req, res) => {
    // Lets Validate the data before we add a user
    const { error } = loginValitation(req.body)
    if(error) return res.status(400).json({ error: error.details[0].message }).send()
  
    // Checking if the Email doesn't exists
    const user = await User.findOne({ email: req.body.email })
    if(!user) return res.status(400).json({ error: 'Email/Password is wrong!' }).send()
  
    // Password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(400).json({ error: 'Email/Password is wrong!' }).send()
  
    // Create ans assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
    res.header('auth-token', token).json({ token: token }).send()
})

module.exports = router