const express = require('express');
const {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  templateImageUpload
} = require('../controllers/templates');

const Template = require('../models/Template')
const advancedResults = require('../middleware/advancedResults');

const router = express.Router();

router.route('/').get(advancedResults(Template), getTemplates).post(createTemplate);

router.route('/:id').get(getTemplate).put(updateTemplate).delete(deleteTemplate);

// Route for image template file upload
router.route('/:id/image').put(templateImageUpload);

module.exports = router;
