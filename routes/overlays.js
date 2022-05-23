const express = require('express');
const {
  getOverlays,
  getOverlay,
  createOverlay,
  updateOverlay,
  deleteOverlay,
  overlayImageUpload
} = require('../controllers/overlays');

const Overlay = require('../models/Overlay')
const advancedResults = require('../middleware/advancedResults');

const router = express.Router();

router.route('/').get(advancedResults(Overlay), getOverlays).post(createOverlay);

router.route('/:id').get(getOverlay).put(updateOverlay).delete(deleteOverlay);

// Route for image overlay file upload
router.route('/:id/image').put(overlayImageUpload);

module.exports = router;
