// Middleware
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

const path = require('path');
const Overlay = require('../models/Overlay');

// Utils to remove file from server
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);

// Require the Cloudinary library and configuration
const cloudinary = require('../config/cloudinary');

// @desc     Get all overlays
// @route    GET /api/v1/overlays
// @access   Private
exports.getOverlays = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc     Get single overlays
// @route    GET /api/v1/overlays/:id
// @access   Private
exports.getOverlay = asyncHandler(async (req, res, next) => {
  const overlay = await Overlay.findById(req.params.id);

  if (!overlay) {
    return next(
      new ErrorResponse(`Overlay not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: overlay });
});

// @desc     Create new overlay
// @route    POST /api/v1/overlays
// @access   Private
exports.createOverlay = asyncHandler(async (req, res, next) => {
  const overlay = await Overlay.create(req.body);

  res.status(201).json({
    success: true,
    data: overlay,
  });
});

// @desc     Update overlay
// @route    PUT /api/v1/overlays/:id
// @access   Private
exports.updateOverlay = asyncHandler(async (req, res, next) => {
  const overlay = await Overlay.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!overlay) {
    return next(
      new ErrorResponse(`Overlay not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: overlay });
});

// @desc     Delete overlay
// @route    DELETE /api/v1/overlays/:id
// @access   Private
exports.deleteOverlay = asyncHandler(async (req, res, next) => {
  const overlay = await Overlay.findByIdAndDelete(req.params.id);
  if (!overlay) {
    return next(
      new ErrorResponse(`Overlay not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: {} });
});

// @desc     Upload overlay image (Cloudinary via server)
// @route    PUT /api/v1/overlays/:id/image
// @access   Private
exports.overlayImageUpload = asyncHandler(async (req, res, next) => {
  const overlay = await Overlay.findById(req.params.id);
  if (!overlay) {
    return next(
      new ErrorResponse(`Overlay not found with id of ${req.params.id}`, 404)
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
  file.name = `overlay_${overlay._id}${path.parse(file.name).ext}`;

  // Save file to server
  file.mv(
    `./${process.env.OVERLAY_IMAGE_UPLOAD_PATH}/${file.name}`,
    async (err) => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse(`Problem with file upload`, 500));
      }

      await Overlay.findByIdAndUpdate(req.params.id, { image: file.name });
    }
  );

  console.log(`https://picturestapi.herokuapp.com/overlays/${file.name}`)

  // Upload file to Cloudinary
  await cloudinary.v2.uploader.upload(
    // `./${process.env.OVERLAY_IMAGE_UPLOAD_PATH}/${file.name}`,
    `https://picturestapi.herokuapp.com/overlays/${file.name}`,
    {
      public_id: path.parse(file.name).name,
      folder: 'templates',
    },
    function (error, result) {
      console.log(result)
      res.status(200).json({
        success: true,
        data: result.url,
      });
    }
  );

  // Update overlay image path in database
  await Overlay.findByIdAndUpdate(req.params.id, {
    new: true,
    runValidators: true,
    image: `${process.env.CLOUDINARY_IMAGE_UPLOAD_PATH}/${file.name}`,
  });

  //Remove file from server
  const imagePath = `${process.env.OVERLAY_IMAGE_UPLOAD_PATH}/${file.name}`;
  await unlinkFile(imagePath);
});
