const express = require('express');
const { getImages } = require('../controllers/images');

const router = express.Router();

router.route('/').get(getImages)

module.exports = router;
