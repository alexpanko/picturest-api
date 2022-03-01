// @desc     Get all overlays
// @route    GET /api/v1/overlays
// @access   Public
exports.getOverlays = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: 'Show all overlays' });
};

// @desc     Get single overlays
// @route    GET /api/v1/overlays/:id
// @access   Public
exports.getOverlay = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Show overlay ${req.params.id}` });
};

// @desc     Create new overlay
// @route    POST /api/v1/overlays
// @access   Private
exports.createOverlay = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Create new overlay' });
};

// @desc     Update overlay
// @route    PUT /api/v1/overlays/:id
// @access   Private
exports.updateOverlay = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Update overlay ${req.params.id}` });
};

// @desc     Delete overlay
// @route    DELETE /api/v1/overlays/:id
// @access   Private
exports.deleteOverlay = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete overlay ${req.params.id}` });
};
