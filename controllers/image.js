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
  let templateObject
  let overlay
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
  if (templateObject.price) {
    price = decodeURIComponent(req.query.price);
    priceX = parseInt(templateObject.price.axisX);
    priceY = parseInt(templateObject.price.axisY);
    // Load font for price from template
    priceFont = await Jimp.loadFont(
      `./public/fonts/${templateObject.price.font}.fnt`
    );
  }

  // Get custom1 (Use ASCII format to pass special characters)
  let custom1 = '';
  let custom1X = 0;
  let custom1Y = 0;
  // Set default font for custom1
  let custom1Font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
  if (req.query.custom1 && req.query.custom1X && req.query.custom1Y) {
    custom1 = decodeURIComponent(req.query.custom1);
    custom1X = parseInt(req.query.custom1X);
    custom1Y = parseInt(req.query.custom1Y);
    // Load font for custom1 from query params
    custom1Font = await Jimp.loadFont(
      `./public/fonts/${req.query.custom1Font}.fnt`
    );
  }

  // Get custom2 (Use ASCII format to pass special characters)
  let custom2 = '';
  let custom2X = 0;
  let custom2Y = 0;
  // Set default font for custom2
  let custom2Font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
  if (req.query.custom2 && req.query.custom2X && req.query.custom2Y) {
    custom2 = decodeURIComponent(req.query.custom2);
    custom2X = parseInt(req.query.custom2X);
    custom2Y = parseInt(req.query.custom2Y);
    // Load font for custom2 from query params
    custom2Font = await Jimp.loadFont(
      `./public/fonts/${req.query.custom2Font}.fnt`
    );
  }

  // Get custom1 (Use ASCII format to pass special characters)
  let custom3 = '';
  let custom3X = 0;
  let custom3Y = 0;
  // Set default font for custom3
  let custom3Font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
  if (req.query.custom3 && req.query.custom3X && req.query.custom3Y) {
    custom3 = decodeURIComponent(req.query.custom3);
    custom3X = parseInt(req.query.custom3X);
    custom3Y = parseInt(req.query.custom3Y);
    // Load font for custom3 from query params
    custom3Font = await Jimp.loadFont(
      `./public/fonts/${req.query.custom3Font}.fnt`
    );
  }

  // Get resize parameters
  let resizex = null;
  let resizey = null;
  if (req.query.resizex && req.query.resizey) {
    resizex = parseInt(req.query.resizex);
    resizey = parseInt(req.query.resizey);
  } else if (req.query.resizex && !req.query.resizey) {
    resizex = parseInt(req.query.resizex);
    resizey = Jimp.AUTO;
    console.log(resizex);
  } else if (!req.query.resizex && req.query.resizey) {
    resizex = Jimp.AUTO;
    resizey = parseInt(req.query.resizey);
  }

  // Get crop parameters
  let cropX = 0; // default for now, change to query params
  let cropY = 0;
  let cropW = null; // Both cropW and cropH are requered
  let cropH = null;
  if (req.query.cropW && req.query.cropH) {
    cropW = parseInt(req.query.cropW);
    cropH = parseInt(req.query.cropH);
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
