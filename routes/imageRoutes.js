const express = require('express');
const Image = require('../models/Image');
const router = express.Router();
router.get('/user/:userId/uploads', async (req, res) => {
  try {
      const userUploads = await Image.find({ user: req.params.userId }).sort({ createdAt: -1 });
      res.json(userUploads);
  } catch (error) {
      res.status(500).send(error.message);
  }
});
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const imgBuffer = req.file.buffer;
        const imgBase64 = imgBuffer.toString('base64'); // Convert buffer to Base64 string

        const newImage = new Image({
            user: req.body.user,
            imageData: imgBase64,  // Store the Base64 encoded string
            predictions: JSON.parse(req.body.predictions),
            createdAt: new Date()
        });
        await newImage.save();
        res.status(201).send({
            message: 'Image uploaded successfully',
            imageId: newImage._id  // Return the ID of the saved image
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});
router.put('/update-doctor-prediction/:imageId', async (req, res) => {
  try {
      const updatedImage = await Image.findByIdAndUpdate(
          req.params.imageId,
          { $set: { doctorPrediction: req.body.doctorPrediction } },
          
          { new: true }
      );
      if (!updatedImage) {
          return res.status(404).send('Image not found');
      }
      res.json(updatedImage);
  } catch (error) {
      res.status(500).send(error.message);
  }
});

  module.exports = router ;