const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const fileupload = require('express-fileupload');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route files
const newimage = require('./routes/newimage');
const templates = require('./routes/templates');
const overlays = require('./routes/overlays');
const images = require('./routes/images');
const auth = require('./routes/auth');

const app = express();

// Body parser
app.use(express.json());

// Dev loggin middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File uploading
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/newimage', newimage);
app.use('/api/v1/templates', templates);
app.use('/api/v1/overlays', overlays);
app.use('/api/v1/images', images);
app.use('/api/v1/auth', auth);

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const host = '0.0.0.0';

const server = app.listen(
  PORT,
  host,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //Close server & exit process
  server.close(() => process.exit(1));
});
