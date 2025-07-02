const userModel = require('../models/userModel')
const foodModel = require('../models/foodModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const createToken = (id)=>{
    return jwt.sign( {id}, process.env.JWT_TOKEN_SECRET)
}
const loginUser = async(req,res)=>{
    const {email,password} = req.body;
    try {
        const user = await userModel.findOne({email})
        if(!user)
            return res.status(400).json({"message":"Invalid Email or Password"})
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch)
            return res.status(400).json({"message":"Invalid Email or Password"})
        const token = createToken(user._id)
        res.status(200).json({token})
    } catch (error) {
        console.log(error)
        res.status(500).json({"message":"Internal Server Error"}) 
    }
}
const registerUser = async(req,res)=>{
    const {name,email,password} = req.body
    try {
        const exists = await userModel.findOne({email})
        if(exists)
            return res.status(400).json({"message":"Email already exists"})
        if(!validator.isEmail(email))
            return res.status(400).json({"message":"Invalid E-mail"})
        if(password.length<8)
            return res.status(400).json({"message":"Password must be atleast 8 chars long"})

        const hashedPassword = await bcrypt.hash(password,10)
        const user = await userModel.create({
            name,email,password:hashedPassword
        })
        res.status(201).json({"message":"User registered successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).json({"message":"Internal Server Error"})
    }
}

const addToFavorites = async(req, res) => {
    const userId = req.user._id;
    const { itemId } = req.body;
    
    try {
        // console.log("Adding to favorites. User ID:", userId, "Item ID:", itemId);
        
        // Find the user
        const user = await userModel.findById(userId);
        if (!user) {
            // console.log("User not found:", userId);
            return res.status(404).json({"message": "User not found"});
        }
        
        // console.log("Current user favorites:", user.favorites);
        
        // Check if the itemId exists in the food collection
        const foodItem = await foodModel.findById(itemId);
        if (!foodItem) {
            // console.log("Food item not found:", itemId);
            return res.status(404).json({"message": "Food item not found"});
        }
        
        // Only add to favorites if not already in user's favorites
        if (!user.favorites.includes(itemId)) {
            // Add to user's favorites
            user.favorites.push(itemId);
            await user.save();
            // console.log("Updated user favorites:", user.favorites);
            
            // Increment food's favorite count
            const updatedFood = await foodModel.findByIdAndUpdate(
                itemId,
                { $inc: { no_of_favorites: 1 } },
                { new: true }
            );
            // console.log("Updated food item no_of_favorites:", updatedFood.no_of_favorites);
        } else {
            // console.log("Item already in favorites");
        }
        
        res.status(200).json({"message": "Added to favorites"});
    } catch (error) {
        // console.log("Error adding to favorites:", error);
        res.status(500).json({"message": "Internal Server Error"});
    }
}

const removeFromFavorites = async(req, res) => {
    const userId = req.user._id;
    const { itemId } = req.query;
    
    try {
        // console.log("Removing from favorites. User ID:", userId, "Item ID:", itemId);
        
        // Find the user
        const user = await userModel.findById(userId);
        if (!user) {
            // console.log("User not found:", userId);
            return res.status(404).json({"message": "User not found"});
        }
        
        // console.log("Current user favorites:", user.favorites);
        
        // Check if the itemId exists in the food collection
        const foodItem = await foodModel.findById(itemId);
        if (!foodItem) {
            // console.log("Food item not found:", itemId);
            return res.status(404).json({"message": "Food item not found"});
        }
        
        // Check if item is in user's favorites before removing
        if (user.favorites.includes(itemId)) {
            // Remove from user's favorites
            user.favorites = user.favorites.filter(id => String(id) !== String(itemId));
            await user.save();
            // console.log("Updated user favorites:", user.favorites);
            
            // Decrement food's favorite count
            const updatedFood = await foodModel.findByIdAndUpdate(
                itemId,
                { $inc: { no_of_favorites: -1 } },
                { new: true }
            );
            // console.log("Updated food item no_of_favorites:", updatedFood.no_of_favorites);
        } else {
            // console.log("Item not in favorites");
        }
        
        res.status(200).json({"message": "Removed from favorites"});
    } catch (error) {
        // console.log("Error removing from favorites:", error);
        res.status(500).json({"message": "Internal Server Error"});
    }
}

const getFavorites = async(req, res) => {
    const userId = req.user._id;
    
    try {
        // console.log("Getting favorites for user ID:", userId);
        const user = await userModel.findById(userId);
        if (!user) {
            // console.log("User not found:", userId);
            return res.status(404).json({"message": "User not found"});
        }
        
        // console.log("Retrieved favorites:", user.favorites);
        res.status(200).json({favorites: user.favorites});
    } catch (error) {
        // console.log("Error getting favorites:", error);
        res.status(500).json({"message": "Internal Server Error"});
    }
}

module.exports = {loginUser, registerUser, addToFavorites, removeFromFavorites, getFavorites}