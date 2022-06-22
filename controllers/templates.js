// Middleware
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

const path = require('path');
const Template = require('../models/Template');

// Utils to remove file from server
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);

// Require the Cloudinary library and configuration
const cloudinary = require('../config/cloudinary');

// @desc     Get all Templates
// @route    GET /api/v1/templates
// @access   Private
exports.getTemplates = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc     Get single Template
// @route    GET /api/v1/templates/:id
// @access   Private
exports.getTemplate = asyncHandler(async (req, res, next) => {
  const template = await Template.findById(req.params.id);

  if (!template) {
    return next(
      new ErrorResponse(`Template not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: template });
});

// @desc     Create new Template
// @route    POST /api/v1/templates
// @access   Private
exports.createTemplate = asyncHandler(async (req, res, next) => {
  const template = await Template.create(req.body);

  res.status(201).json({
    success: true,
    data: template,
  });
});

// @desc     Update Template
// @route    PUT /api/v1/templates/:id
// @access   Private
exports.updateTemplate = asyncHandler(async (req, res, next) => {
  const template = await Template.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!template) {
    return next(
      new ErrorResponse(`Template not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: template });
});

// @desc     Delete Template
// @route    DELETE /api/v1/templates/:id
// @access   Private
exports.deleteTemplate = asyncHandler(async (req, res, next) => {
  const template = await Template.findByIdAndDelete(req.params.id);
  if (!template) {
    return next(
      new ErrorResponse(`Template not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: {} });
});

// @desc     Upload template image (Cloudinary via server)
// @route    PUT /api/v1/templates/:id/image
// @access   Private
exports.templateImageUpload = asyncHandler(async (req, res, next) => {
  const template = await Template.findById(req.params.id);
  if (!template) {
    return next(
      new ErrorResponse(`Template not found with id of ${req.params.id}`, 404)
    );
  }
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less then ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `template_${template._id}${path.parse(file.name).ext}`;

  // Save file to server
  file.mv(
    `./${process.env.TEMPLATE_IMAGE_UPLOAD_PATH}/${file.name}`,
    async (err) => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse(`Problem with file upload`, 500));
      }

      await Template.findByIdAndUpdate(req.params.id, { image: file.name });
    }
  );

  // Upload file to Cloudinary
  await cloudinary.v2.uploader.upload(
    `./${process.env.TEMPLATE_IMAGE_UPLOAD_PATH}/${file.name}`,
    {
      public_id: path.parse(file.name).name,
      folder: 'templates',
    },
    function (error, result) {
      res.status(200).json({
        success: true,
        data: result.url,
      });
    }
  );

  // Update template image path in database
  await Template.findByIdAndUpdate(req.params.id, {
    new: true,
    runValidators: true,
    image: `${process.env.CLOUDINARY_IMAGE_UPLOAD_PATH}/${file.name}`,
  });

  //Remove file from server
  const imagePath = `${process.env.TEMPLATE_IMAGE_UPLOAD_PATH}/${file.name}`;
  await unlinkFile(imagePath);
});
