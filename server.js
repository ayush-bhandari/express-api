"use strict";
let express = require('express');
let app = express();
let PORT = process.env.PORT || 3000;
let HOST = process.env.HOST || "localhost";
let morgan = require('morgan');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let cors = require('cors');
let jwt = require('jsonwebtoken');
let http = require('http');
let fs = require('fs');
let path = require('path');
let rfs = require('rotating-file-stream');


// let seeder = require('mongoose-seeder');
// let dat = require('./seeder/data.json'); 
// seeder.seed(dat, (err,data) => {
// });

let corsOptions = {
  // origin: 'http://example.com',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));
app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc) 

let RateLimit = require('express-rate-limit');
let limiter = new RateLimit({
  windowMs: 15*60*1000, // 15 minutes 
  max: 900, // limit each IP to 100 requests per windowMs 
  delayMs: 0 // disable delaying - full speed until the max limit is reached 
});
//  apply to all requests 
app.use(limiter);

let schedule = require('node-schedule');
let averageRating = require('./middleware/averageRating');

let j = schedule.scheduleJob('*/5 * * * *', function(){
  averageRating();
});

let configDB = require('./config/database.js');
mongoose.connect(configDB.url);

let logDirectory = path.join(__dirname, 'logs/accessLog/');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
let accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory
});
app.use(morgan('combined', {stream: accessLogStream}));
app.use(morgan('combined'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

require('./routes/routes.js')(app);

http.createServer(app).listen(PORT, () => {
	console.log("Listening on port " + PORT);
});

module.exports = app;