// Middleware
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

const path = require('path');
const Overlay = require('../models/Overlay');



// @desc     Get all overlays
// @route    GET /api/v1/overlays
// @access   Public
exports.getOverlays = asyncHandler(async (req, res, next) => {

    let query

    // Copy req.query
    const reqQuery = { ...req.query }

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit']

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param])

    // Create query string
    let queryStr = JSON.stringify(reqQuery)

    // Posibility to create additional operators (e.g. $gt, $gte, etc.)
    // queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

    // Finding resource
    query = Overlay.find(JSON.parse(queryStr))

    // Select Fields
    if(req.query.select) {
      const fields = req.query.select.split(',').join(' ')
      query = query.select(fields)
    }

    // Sort 
    if(req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy)
    } else {
      query = query.sort('-createdAt')
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Overlay.countDocuments()

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const overlays = await Overlay.find(query);

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      }
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      }
    }

    res
      .status(200)
      .json({ success: true, count: overlays.length, pagination, data: overlays });
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

    // Check file size
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
