const express = require('express')
const { auth } = require('../middlewares/auth')
const { addToCart, getCart, removeFromCart } = require('../controllers/cartController')

const cartRouter = express.Router()
cartRouter.post('/add', auth, addToCart)
cartRouter.get('/get', auth, getCart)
cartRouter.delete('/remove', auth, removeFromCart)

module.exports = cartRouter