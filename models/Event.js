const mongoose = require('mongoose');

// Define the schema for events
const eventSchema = new mongoose.Schema({
  index: { type: Number, required: true },
  title: { type: String, required: true },
  thumbnail: { type: String },
  date: { type: String, required: true }, // Format: "MM/DD"
  year: { type: Number, required: true },
  coordinates: { type: Object, default: null },
  category: { type: String, required: true }, // E.g., "births", "deaths"
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema, 'events'); // Specify collection name
