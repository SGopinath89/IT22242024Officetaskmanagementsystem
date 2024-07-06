
var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretkey = "secretkey";
const User = require("../routes/users")



router.post('/signup', async (req, res) => {
  try {
      const { username, password, email } = req.body;
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, password: hashedPassword, email });
      await user.save();
      res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
          return res.status(401).json({ message: 'Invalid username or password' });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
          return res.status(401).json({ message: 'Invalid username or password' });
      }
      // Create JWT token
      const token = jwt.sign({ userId: user._id }, secretkey, { expiresIn: '1h' });
      res.status(200).json({ token });
  } catch (error) {
      res.status(500).json({ message: 'Failed to authenticate user', error: error.message });
  }
});

router.post('/profile', verifyToken, function (req, res) {
  jwt.verify(req.token, secretkey, (err, authData) => {
    if (err) {
      res.send({ result: "your Token is invalid" })
    }
    else {
      res.json({
        message: "Welcome to Profile",
        
      })
    }
  })
});



function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(" ")
    const token = bearer[1];
    req.token = token;
    next();
  }
  else {
    res.send({ result: 'Token is not valid' })
  }
}



module.exports = router;