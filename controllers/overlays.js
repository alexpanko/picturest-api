const Overlay = require('../models/Overlay');

// @desc     Get all overlays
// @route    GET /api/v1/overlays
// @access   Public
exports.getOverlays = async (req, res, next) => {
  try {
    const overlays = await Overlay.find();

    res
      .status(200)
      .json({ success: true, count: overlays.length, data: overlays });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

// @desc     Get single overlays
// @route    GET /api/v1/overlays/:id
// @access   Public
exports.getOverlay = async (req, res, next) => {
  try {
    const overlay = await Overlay.findById(req.params.id);

    if (!overlay) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: overlay });
  } catch (error) {
    res.status(400).json({ success: false });
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
  } catch (error) {
    res.status(400).json({ success: false });
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
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: overlay });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

// @desc     Delete overlay
// @route    DELETE /api/v1/overlays/:id
// @access   Private
exports.deleteOverlay = async (req, res, next) => {
  try {
    const overlay = await Overlay.findByIdAndDelete(req.params.id);
    if (!overlay) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
