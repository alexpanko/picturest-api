const express = require('express');
const { getNewImage } = require('../controllers/imagesb');

const router = express.Router();

router.route('/').get(getNewImage);

module.exports = router;
