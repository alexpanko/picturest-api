const express = require('express');
const {
  getOverlays,
  getOverlay,
  createOverlay,
  updateOverlay,
  deleteOverlay,
} = require('../controllers/overlays');

const router = express.Router();

router.route('/').get(getOverlays).post(createOverlay);

router.route('/:id').get(getOverlay).put(updateOverlay).delete(deleteOverlay);

module.exports = router;
