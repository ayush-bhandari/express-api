let config = require('../config/config');
let jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

  // check header or url parameters or post parameters for token
  var token = req.headers['ts-backend-token'];
  let secret = config.secret;

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, secret, function(err, decoded) {      
      if (err) {
        throw err;
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;  
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(400).send({ 
        success: false, 
        message: 'Bad Request. No token provided.' 
    });
    
  }
}
