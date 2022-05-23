const express = require('express');
const { getNewImage } = require('../controllers/newimage');

const router = express.Router();

router.route('/').get(getNewImage);

module.exports = router;
