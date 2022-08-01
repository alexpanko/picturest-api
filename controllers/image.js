const Jimp = require('jimp');
const Template = require('../models/Template');

// Middleware
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc     Get manipulated image with passed parameters
// @route    GET /api/v1/newimage/
// @access   Public
exports.getNewImage = asyncHandler(async function (req, res, next) {
  // Get base image URL
  if (!req.query.baseimage)
    return next(
      new ErrorResponse(`Something went wrong, check your base image URL`, 500)
    );
  const baseimage = req.query.baseimage;

  // Get template overlay image
  let templateObject;
  let overlay;
  if (req.query.templateid) {
    templateObject = await Template.findById(req.query.templateid);
    overlay = await Jimp.read(templateObject.image);
  }

  // Get price (Use ASCII format to pass the crrency symbol)
  let price = '';
  let priceX = 0;
  let priceY = 0;
  // Set default font for price
  let priceFont = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
  // Check if price present in the template
  if (
    req.query.price &&
    templateObject.price.axisX &&
    templateObject.price.axisY
  ) {
    price = decodeURIComponent(req.query.price);
    priceX = parseInt(templateObject.price.axisX);
    priceY = parseInt(templateObject.price.axisY);
    // Load font for price from template
    if (templateObject.price.font) {
      priceFont = await Jimp.loadFont(
        `./public/fonts/${templateObject.price.font}.fnt`
      );
    }
  }

  // Get custom1 (Use ASCII format to pass special characters)
  let custom1 = '';
  let custom1X = 0;
  let custom1Y = 0;
  // Set default font for custom1
  let custom1Font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
  // Check if field is present in the template
  if (
    req.query.custom1 &&
    templateObject.custom1.axisX &&
    templateObject.custom1.axisY
  ) {
    custom1 = decodeURIComponent(req.query.custom1);
    custom1X = parseInt(templateObject.custom1.axisX);
    custom1Y = parseInt(templateObject.custom1.axisY);
    // Load font for custom1 from query params
    if (templateObject.custom1.font) {
      custom1Font = await Jimp.loadFont(
        `./public/fonts/${templateObject.custom1.font}.fnt`
      );
    }
  }

  // Get custom2 (Use ASCII format to pass special characters)
  let custom2 = '';
  let custom2X = 0;
  let custom2Y = 0;
  // Set default font for custom2
  let custom2Font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
  // Check if field is present in the template
  if (
    req.query.custom2 &&
    templateObject.custom2.axisX &&
    templateObject.custom2.axisY
  ) {
    custom2 = decodeURIComponent(req.query.custom2);
    custom2X = parseInt(templateObject.custom2.axisX);
    custom2Y = parseInt(templateObject.custom2.axisY);
    // Load font for custom2 from query params
    if (templateObject.custom2.font) {
      custom2Font = await Jimp.loadFont(
        `./public/fonts/${templateObject.custom2.font}.fnt`
      );
    }
  }

  // Get custom3 (Use ASCII format to pass special characters)
  let custom3 = '';
  let custom3X = 0;
  let custom3Y = 0;
  // Set default font for custom3
  let custom3Font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
  // Check if field is present in the template
  if (
    req.query.custom3 &&
    templateObject.custom3.axisX &&
    templateObject.custom3.axisY
  ) {
    custom3 = decodeURIComponent(req.query.custom3);
    custom3X = parseInt(templateObject.custom3.axisX);
    custom3Y = parseInt(templateObject.custom3.axisY);
    // Load font for custom3 from query params
    if (templateObject.custom3.font) {
      custom3Font = await Jimp.loadFont(
        `./public/fonts/${templateObject.custom3.font}.fnt`
      );
    }
  }

  // Get resize parameters
  let resizex = null;
  let resizey = null;
  if (templateObject.resize.x && templateObject.resize.y) {
    resizex = parseInt(templateObject.resize.x);
    resizey = parseInt(templateObject.resize.y);
  } else if (templateObject.resize.x && !templateObject.resize.y) {
    resizex = parseInt(templateObject.resize.x);
    resizey = Jimp.AUTO;
  } else if (!templateObject.resize.x && templateObject.resize.y) {
    resizex = Jimp.AUTO;
    resizey = parseInt(templateObject.resize.y);
  }

  // Get crop parameters
  let cropX = 0;
  let cropY = 0;
  let cropW = null;
  let cropH = null;
  if (templateObject.crop.x && templateObject.crop.y) {
    cropW = parseInt(templateObject.crop.x);
    cropH = parseInt(templateObject.crop.y);
  }

  // Read base image, process and generate new without saving
  Jimp.read(baseimage, function (err, img) {
    if (err)
      return next(
        new ErrorResponse(
          `Something went wrong, check your base image URL`,
          500
        )
      );

    if (resizex || resizey) {
      img.resize(resizex, resizey);
    }
    if (cropW || cropH) {
      img.crop(cropX, cropY, cropW, cropH);
    }
    if (overlay) {
      img.composite(overlay, 0, 0, [Jimp.BLEND_DESTINATION_OVER]);
    }
    if (price) {
      img.print(priceFont, priceX, priceY, price);
    }
    if (custom1) {
      img.print(custom1Font, custom1X, custom1Y, custom1);
    }
    if (custom2) {
      img.print(custom2Font, custom2X, custom2Y, custom2);
    }
    if (custom3) {
      img.print(custom3Font, custom3X, custom3Y, custom3);
    }

    img.getBase64(Jimp.AUTO, function (err, img64) {
      if (err) throw err;
      const base64Data = img64.replace(
        /^data:image\/(png|jpeg|jpg);base64,/,
        ''
      );
      const image = Buffer.from(base64Data, 'base64');
      res
        .writeHead(200, {
          'Content-Type': 'image/jpeg',
          'Content-Length': image.length,
        })
        .end(image);
    });
  });
});
