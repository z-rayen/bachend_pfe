const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const router = express.Router();
router.post('/register', async (req, res) => {
  const { username, sex,email, password, dateDeNaissance } = req.body;

  try {
      // Check if a user already exists with the given username or email
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
          return res.status(409).json({ message: "Username or email already exists. Please choose a different one." });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create a new user object
      const newUser = new User({
          username,
          email,
          sex,
          password: hashedPassword,
          dateDeNaissance: new Date(dateDeNaissance)
      });

      // Save the new user to the database
      await newUser.save();

      // Prepare and send the response
      const userToReturn = {
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          dateDeNaissance: newUser.dateDeNaissance
      };

      res.status(201).json({ message: "User created successfully", user: userToReturn });
  } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Failed to register user. Please try again later." });
  }
});


router.post('/login', async (req, res) => {
  try {
      // Find the user by email
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
          return res.status(404).send('User not found');
      }

      // Compare submitted password with the hashed password in the database
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
          return res.status(400).send('Invalid credentials');
      }

      // Prepare the user data to send back, excluding the password
      const userData = {
          _id: user._id,
          username: user.username,
          email: user.email,
          dateDeNaissance: user.dateDeNaissance
          // Add other fields as needed but exclude sensitive data
      };

      res.status(201).json({
          message: 'Login successful',
          user: userData
      });
  } catch (error) {
      res.status(500).send(error.message);
  }
});
router.get('/user/:id', async (req, res) => {
  try {
      // Find the user by ID using Mongoose's findById
      const user = await User.findById(req.params.id);
      if (!user) {
          return res.status(404).send('User not found');
      }

      // Excluding the password and possibly other sensitive details
      const { password, ...userWithoutPassword } = user.toObject();
      res.status(201).json(userWithoutPassword);
  } catch (error) {
      // Handling invalid ID error specifically
      if (error.kind === 'ObjectId') {
          return res.status(400).send('Invalid user ID');
      }
      res.status(500).send(error.message);
  }
});
router.put('/user/:id', async (req, res) => {
  const { email, username, password } = req.body;
  try {
      const user = await User.findById(req.params.id);
      if (!user) {
          return res.status(404).send('User not found');
      }

      // Update fields if provided
      if (email) user.email = email;
      if (username) user.username = username;
      if (password) user.password = password; // Consider hashing the password before saving

      await user.save(); // Save the updated user
      res.status(201).send('User updated successfully');
  } catch (error) {
      res.status(500).send(error.message);
  }
});
module.exports = router;