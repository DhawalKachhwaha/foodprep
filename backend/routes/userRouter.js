const express = require('express')
const userRouter = express.Router()
const {loginUser,registerUser, addToFavorites, removeFromFavorites, getFavorites} = require('../controllers/userController')
const {auth} = require('../middlewares/auth')

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/favorites/add', auth, addToFavorites)
userRouter.delete('/favorites/remove', auth, removeFromFavorites)
userRouter.get('/favorites', auth, getFavorites)

module.exports = userRouter