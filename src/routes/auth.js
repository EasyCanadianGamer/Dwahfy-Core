const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const router = express.Router()

//Signup much again!!
router.post('/signup', async (req, res) => {
    try{
        const {name, email, password} = req.body

        const userExists = await User.findOne({email})
        if(userExists) return res.status(400).json({message: 'Bruh, u already exist!!'})

        const hashedPwd = await bcrypt.hash(password, 10)

        //User creation 
        const user = await User.create({name, email, password: hashedPwd})

        res.status(201).json({message: 'Welcome to dwhafy..... You!!', user: {id: user._id, email: user.email}})
    }
    catch(error){
        res.status.json({error: `Something went terribly terribly wrong at ${error.message}`})
    }
})
//signin ig
router.post('/signup', async (req, res) => {
    try{
        const {email, password} = req.body
    
        const user = await User.findOne(email)
        const validPwd = await bcrypt.compare(password, user?.password)
        if(!valid || !user) res.status.json({message: 'Seriosuly :/'})
    
        const jwtToken = jwt.sign({id: user._id,}, process.env.JWT_SEC, {expiresIn: '1h'}) //For Testing
    
        res.status.json({message: 'Welcome Back to Dwahfy', token})
    }
    catch(error){
        res.status(500).json({error: `IDFK, look at this ${error.message}`})
    }
})

module.exports = router