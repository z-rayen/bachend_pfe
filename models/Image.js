const mongoose = require('mongoose');
const { Schema } = mongoose;

const predictionDetailSchema = new Schema({
    class_id: { type: Number, required: true },
    class_label: { type: String, required: true },
    probability: { type: Number, required: true }
});

const imageSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    imageData: { type: String, required: true }, 
    predictions: [predictionDetailSchema],  // Array of predictions
    doctorPrediction: { type: String },  // Optional field for doctor's prediction
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Image', imageSchema);
