const Jimp = require('jimp');

// @desc     Get manipulated image with passed parameters
// @route    GET /api/v1/images/
// @access   Public
exports.getImages = async function (req, res) {
  // Get base image URL
  // If URL contains special characters such as '?' or '&' then URL has to be converted into a valid ASCII format
  // const imgUrl = decodeURIcomponent(req.query.imgUrl);
  const imgUrl = req.query.imgUrl;

  // Get overlay id and load overlay
  let overlayId = '';
  let overlay = '';
  if (req.query.overlayId) {
    overlayId = decodeURIComponent(req.query.overlayId);
    overlay = await Jimp.read(`test-overlay-${overlayId}.png`);
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

  // Read base image, process nd generate new without saving
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
      res.status(200).send('<img src="' + img64 + '">');
      // res
      //   .status(200)
      //   .send(
      //     '<img src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg">'
      //   );
    });
  });
};
