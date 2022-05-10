// Middleware
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

const path = require('path');
const Overlay = require('../models/Overlay');



// @desc     Get all overlays
// @route    GET /api/v1/overlays
// @access   Public
exports.getOverlays = asyncHandler(async (req, res, next) => {
    const overlays = await Overlay.find();

    res
      .status(200)
      .json({ success: true, count: overlays.length, data: overlays });
});

// @desc     Get single overlays
// @route    GET /api/v1/overlays/:id
// @access   Public
exports.getOverlay = asyncHandler(async (req, res, next) => {
    const overlay = await Overlay.findById(req.params.id);

    if (!overlay) {
      return next(new ErrorResponse(`Overlay not found with id of ${req.params.id}`, 404));
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
      return next(new ErrorResponse(`Overlay not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: overlay });
});

// @desc     Delete overlay
// @route    DELETE /api/v1/overlays/:id
// @access   Private
exports.deleteOverlay = asyncHandler(async (req, res, next) => {
    const overlay = await Overlay.findByIdAndDelete(req.params.id);
    if (!overlay) {
      return next(new ErrorResponse(`Overlay not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: {} });
});

// @desc     Upload image overlay
// @route    PUT /api/v1/overlays/:id/image
// @access   Private
exports.overlayImageUpload = asyncHandler(async (req, res, next) => {
    const overlay = await Overlay.findById(req.params.id);
    if (!overlay) {
      return next(new ErrorResponse(`Overlay not found with id of ${req.params.id}`, 404));
    }
    if (!req.files) {
      return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const file = req.files.file;

    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
      return next(new ErrorResponse(`Please upload an image file`, 400));
    }

    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(new ErrorResponse(`Please upload an image less then ${process.env.MAX_FILE_UPLOAD}`, 400));
    }

    // Create custom filename
    file.name = `overlay_${overlay._id}${path.parse(file.name).ext}`;

    file.mv(`./${process.env.OVERLAY_IMAGE_UPLOAD_PATH}/${file.name}`, async (err) => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse(`Problem with file upload`, 500));
      }

      await Overlay.findByIdAndUpdate(req.params.id, { image: file.name });

      res.status(200).json({
        success: true,
        data: file.name,
      });
    });
});
