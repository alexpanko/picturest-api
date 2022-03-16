const Jimp = require('jimp');
const Overlay = require('../models/Overlay');

// @desc     Get manipulated image with passed parameters
// @route    GET /api/v1/images/
// @access   Public
exports.getImages = async function (req, res) {
  try {
    // Get base image URL
    const imgUrl = req.query.imgUrl;

    // Get overlay id and load overlay
    let overlay = '';
    if (req.query.overlayId) {
      const overlayObject = await Overlay.findById(req.query.overlayId);
      overlay = await Jimp.read(
        `${process.env.OVERLAY_IMAGE_UPLOAD_PATH}/${overlayObject.image}`
      );
    }

    // Get price (Use ASCII format to pass the crrency symbol)
    let price = '';
    if (req.query.price) {
      price = decodeURIComponent(req.query.price);
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

    // Load fonts
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE); // // need a default + use as paramater so user can upload custom find. Att current font doesn't support eur symbol, only usd

    // Read base image, process and generate new without saving
    Jimp.read(imgUrl, function (err, img) {
      if (err) throw err;
      if (resizex || resizey) {
        img.resize(resizex, resizey);
      }
      if (overlay) {
        img.composite(overlay, 0, 0, [Jimp.BLEND_DESTINATION_OVER]);
      }
      if (price) {
        img.print(font, 20, 530, price); // Starting coordinates need to pass also as parameters, for example pricex and pricey
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
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
