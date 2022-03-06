const express = require('express');
const dotenv = require('dotenv');


// Route files
const overlays = require('./routes/overlays');
const images = require('./routes/images');

// Load env vars
dotenv.config({ path: './config/config.env' });

const app = express();

const logger = (req, res, next) => {
  console.log(
    `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`
  );
  next();
};

app.use(logger);

// Mount routers
app.use('/api/v1/overlays', overlays);

app.use('/api/v1/images', images);

const PORT = process.env.PORT || 5000;
const host = '0.0.0.0';

app.listen(
  PORT,
  host,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
