const express = require('express');
const { getNewImage } = require('../controllers/image');

const router = express.Router();

router.route('/').get(getNewImage);

module.exports = router;
