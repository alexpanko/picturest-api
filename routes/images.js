const express = require('express');
const { getImages, getImagesTestOne } = require('../controllers/images');

const router = express.Router();

router.route('/').get(getImages);
router.route('/test1/').get(getImagesTestOne);

module.exports = router;
