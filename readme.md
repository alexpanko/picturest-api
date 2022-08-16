# Picturest - On-demand Image Generation API
Picturest is a rest API which allows inline image overlay generation to improve brand recognition and drive the performance of Dynamic Ads on Facebook, Snapchat or any other channel.

Extensive API documentation with examples: [here](https://documenter.getpostman.com/view/10852837/UVsQsPPe)

The API is live at [picturest.io](https://picturestapi.herokuapp.com/)

![Demo image](https://res.cloudinary.com/picturest/image/upload/v1659964141/documentation_images/picturest_api_example_2_x68bus.png)

## Functionality
- Picturest API doesn't save the image after manipulation. Instead, it's responding with a new image.
- Picturest API has a CRUD (create, read, update, delete) functionality to manage dynamic creative templates and users.
- All dynamic data, such as price, etc., must be passed as query parameters as key-value pairs in the GET request.
- With Picturest API, you can also crop and resize images.
- Picturest API supports basic typography using BMFont format (.fnt), even in different languages (see list of available fonts below).


## Usage
Create "config/config.env" and add values/ settings to your own.

### Install Dependencies
```
npm install
```

### Run App
```
# Run in dev mode
npm run dev

# Run in prod mode
npm start
```

## Tech stack 

To build this API I used folowing technology and packages:

### Tools
- NodeJS 
- Express Server
- GraphQL
- MongoDB noSQL data-base 
- Mongoose
- Postman

### Services
- Deployment - https://www.heroku.com/
- Database - https://www.mongodb.com/
- Image stogare - https://cloudinary.com/
- Documentation - https://www.postman.com/

### Packages
- dotenv - https://github.com/motdotla/dotenv#readme
- morgan - https://github.com/expressjs/morgan
- colors - https://github.com/Marak/colors.js
- slugify - https://github.com/simov/slugify
- node-geocoder - https://github.com/nchaulet/node-geocoder
- bcryptjs - https://github.com/dcodeIO/bcrypt.js#readme
- jsonwebtoken - https://github.com/auth0/node-jsonwebtoken
- nodemailer - https://nodemailer.com/about/
- express-mongo-sanitize - https://github.com/fiznool/express-mongo-sanitize#readme
- xss-clean - https://github.com/jsonmaur/xss-clean
- helmet - https://github.com/helmetjs/helmet
- hpp - https://github.com/analog-nico/hpp
- express-rate-limit - https://github.com/nfriedly/express-rate-limit
- cors - https://github.com/expressjs/cors
- pm2 - https://github.com/Unitech/pm2

### API Security
- Encrypt passwords and reset tokens
- Prevent cross site scripting - XSS
- Prevent NoSQL injections
- Add a rate limit for requests of 100 requests per 10 minutes
- Protect against http param polution
- Add headers for security (helmet)
- Use cors to make API public (for now)

### Author
[Alex Panko](https://www.linkedin.com/in/panko/)
