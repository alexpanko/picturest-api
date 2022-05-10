const path = require('path');
const Overlay = require('../models/Overlay');
const ErrorResponse = require('../utils/errorResponse');

// @desc     Get all overlays
// @route    GET /api/v1/overlays
// @access   Public
exports.getOverlays = async (req, res, next) => {
  try {
    const overlays = await Overlay.find();

    res
      .status(200)
      .json({ success: true, count: overlays.length, data: overlays });
  } catch (err) {
    next(err)
  }
};

// @desc     Get single overlays
// @route    GET /api/v1/overlays/:id
// @access   Public
exports.getOverlay = async (req, res, next) => {
  try {
    const overlay = await Overlay.findById(req.params.id);

    if (!overlay) {
      return next(new ErrorResponse(`Overlay not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({ success: true, data: overlay });
  } catch (err) {
    next(err)
  }
};

// @desc     Create new overlay
// @route    POST /api/v1/overlays
// @access   Private
exports.createOverlay = async (req, res, next) => {
  try {
    const overlay = await Overlay.create(req.body);

    res.status(201).json({
      success: true,
      data: overlay,
    });
  } catch (err) {
    next(err)
  }
};

// @desc     Update overlay
// @route    PUT /api/v1/overlays/:id
// @access   Private
exports.updateOverlay = async (req, res, next) => {
  try {
    const overlay = await Overlay.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!overlay) {
      return next(new ErrorResponse(`Overlay not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: overlay });
  } catch (err) {
    next(err)
  }
};

// @desc     Delete overlay
// @route    DELETE /api/v1/overlays/:id
// @access   Private
exports.deleteOverlay = async (req, res, next) => {
  try {
    const overlay = await Overlay.findByIdAndDelete(req.params.id);
    if (!overlay) {
      return next(new ErrorResponse(`Overlay not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err)
  }
};

// @desc     Upload image overlay
// @route    PUT /api/v1/overlays/:id/image
// @access   Private
exports.overlayImageUpload = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err)
  }
};
