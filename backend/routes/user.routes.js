import express from 'express';
import User from '../model/user.model.js';
import { protect } from '../middleware/auth.middleware.js';
import jwt from 'jsonwebtoken'


const router = express.Router();

router.post('/register', async (req,res) => {
    const { username,  email, password } = req.body;

    try {
        if(!username || !email || !password){
            return res.status(400).json({message: "Please! Fill all the fields"});
        }

        const existUser = await User.findOne({email});

        if(existUser){
            return res.status(400).json({message: "User with this email already exist"});
        }

        const user = await User.create({username, email, password})
        const token = genToken(user._id)
        res.status(201).json({
            id: user._id,
            username: user.username,
            email: user.email,
            token
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = genToken(user._id);
    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', protect, async (req, res) => {
  try {
    res.json({
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

const genToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"})
}

export default router;