const express = require('express');
const { newImage } = require('../controllers/newimage');

const router = express.Router();

router.route('/').get(newImage);

module.exports = router;
