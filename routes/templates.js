const express = require('express');
const {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  templateImageUpload,
} = require('../controllers/templates');

const Template = require('../models/Template');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, authorize('user', 'admin'), advancedResults(Template), getTemplates)
  .post(protect, authorize('user', 'admin'), createTemplate);

router
  .route('/:id')
  .get(getTemplate)
  .put(protect, authorize('user', 'admin'), updateTemplate)
  .delete(protect, authorize('user', 'admin'), deleteTemplate);

// Route for image template file upload
router
  .route('/:id/image')
  .put(protect, authorize('user', 'admin'), templateImageUpload);

module.exports = router;
