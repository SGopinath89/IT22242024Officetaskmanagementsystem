const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../routes/users'); // Adjust the path as per your actual structure

// Middleware function to verify JWT token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];

  // Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}

// GET home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// POST Signup
router.post('/signup', async function (req, res) {
    try {
      const { username, email, password } = req.body;
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10); // Hash with salt rounds of 10
  
      // Check if user with the same email already exists
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, error: "Email already exists" });
      }
  
      // Create new user with hashed password
      let newUser = new userModel({ username, email, password: hashedPassword });
      let result = await newUser.save();
  
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

// POST Login with email and password
router.post('/login', async function (req, res) {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret_key', { expiresIn: '1h' });

    // Return the token along with user data
    res.json({ success: true, token, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Protected route example: POST Profile
router.post('/profile', verifyToken, function (req, res) {
  // Debugging: Log the token received
  console.log('Token received:', req.token);

  // Verify token and handle authentication
  jwt.verify(req.token, 'your_jwt_secret_key', (err, authData) => {
    if (err) {
      // Debugging: Log any verification errors
      console.error('JWT verification error:', err);
      res.status(403).json({ success: false, error: "Unauthorized" });
    } else {
      // If token is valid, you can access authData containing userId
      res.json({ success: true, message: "Profile accessed successfully", authData });
    }
  });
});

module.exports = router;
