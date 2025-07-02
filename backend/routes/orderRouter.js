const express = require('express')
const { placeOrder, verifyOrder, userOrders, listOrders, updateStatus } = require('../controllers/orderController')
const orderRouter = express.Router()
const { auth } = require('../middlewares/auth')

orderRouter.post('/place', auth, placeOrder);
orderRouter.get('/userorders', auth, userOrders);
orderRouter.post("/verify", verifyOrder)
orderRouter.get('/list', listOrders)
orderRouter.post('/status', updateStatus)

module.exports = orderRouter    