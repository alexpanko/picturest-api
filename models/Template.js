const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters'],
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description can not be more than 500 characters'],
  },
  image: {
    type: String,
    required: [true, 'Please add an overlay image'],
  },
  resize: {
    x: Number,
    y: Number,
  },
  crop: {
    x: Number,
    y: Number,
  },
  price: {
    axisX: Number,
    axisY: Number,
    font: String,
  },
  custom1: {
    axisX: Number,
    axisY: Number,
    font: String,
  },
  custom2: {
    axisX: Number,
    axisY: Number,
    font: String,
  },
  custom3: {
    axisX: Number,
    axisY: Number,
    font: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Template', TemplateSchema);
