let mongoose = require('mongoose');
let User = require('../../../models/users');
let Rating = require('../../../models/ratings');
let Review = require('../../../models/reviews');
let request = require('request');
let jwt = require('jsonwebtoken');
let config = require('../../../config/config');
let search = require('../../../middleware/search');
let distance = require('../../../middleware/distance');
let filter = require('../../../middleware/filter');
let restaurant_image_store = require('../../../middleware/restaurantImageStorage');
let food_image_store = require('../../../middleware/foodImageStorage');
let menuFilter = require('../../../middleware/menu');

let foodAverageRating =require('../../../models/foodAverageRating');

let RestaurantAndFoodNameFinder = require('../../../middleware/nameFinder');

let home = (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to Tasting Spoon Backend.'
    });
}

let signup = (req, res) => {
    let user_data = req.body;
    User.getUserById(user_data.fb_id, (err, user) => {
        if(err){
            throw err;
        }
        else if(user.length != 0){
            res.status(302).json({
                success: false,
                message: 'Found. User Already Exists.'
            });
        } else if (!user){
            res.status(422).json({
                success: false,
                message: 'Unprocessable Entity. User Not Stored.'
            });
        } else if (!(user.length != 0)){
            User.addUser(user_data, (err, user) => {
            if(err){
            throw err;
            }else if (user.length != 0){
            res.status(201).json({
                success: true,
                data: user,
                message: 'Created. Sign up Successful.'
            }); 
            } else if (!user) {
            res.status(404).json({
                success: false,
                message: 'User Not Found.'
            }); 
            }else if (!(user.length != 0)) {
            res.status(404).json({
                success: false,
                message: 'User Not Found.'
            }); 
            }else{
            res.status(400).json({
                success: false,
                message: 'Bad Request'
            }); 
            }
            });
        } else{
            res.status(400).json({
                success: false,
                message: 'Bad Request'
            });
        }   
    });

    
}

let login = (req, res) => {
    User.getUserById(req.body.fb_id, (err, user) => {
        if(err){
            throw err;
        }
        else if(user.length != 0){
            let payload = {id: user[0]._id};
            let secret = config.secret;
            let token = jwt.sign(payload, secret,{
                expiresIn : 60*60*24*30 // expires in 24 hours
            });

            res.status(200).json({
                success: true,
                token: token,
                data: user,
                message: 'Ok. Login Successful.'
            });
        } else if (!user){
            res.status(404).json({
                success: false,
                message: 'Login Failed. User Not Found.'
            });
        } else if (!(user.length != 0)){
            res.status(404).json({
                success: false,
                message: 'Login Failed. User Not Found.'
            });
        } else{
            res.status(400).json({
                success: false,
                message: 'Bad Request.'
            });
        }   
    });
}

let restaurantList = (req, res) => {
        let api_url = search(req,res);

        request({
            method: 'GET',
            uri: api_url,
            headers: {
                "X-Access-Token": config.eatstreetAPI_key
            }
        },
        (error, response, body) => {
        if (error) {
            throw err;
        }
        response = distance.multiple(req,response);
        let data = filter.list(response,res);
    })
}
let restaurantDetail = (req, res) => {
        let detail = null;
        let menu = null;
        
        request({
            method: 'GET',
            uri: config.eatstreetAPI_baseURL + '/publicapi/v1/restaurant/' + req.body.restaurant_id +'?street-address=us',
            headers: {
                "X-Access-Token": config.eatstreetAPI_key
            }
        },
        (error, response, body) => {
        if (error) {
            throw error;
        }
        response = distance.single(req,response);
        detail = response;
        
        request({
            method: 'GET',
            uri: config.eatstreetAPI_baseURL + '/publicapi/v1/restaurant/' + req.body.restaurant_id +'/menu',
            headers: {
                "X-Access-Token": config.eatstreetAPI_key
            }
        },
        (error, response, body) => {
        if (error) {
            throw error;
        }
        menu = JSON.parse(response.body);
        
    let data = filter.detail({
        detail: detail.restaurant,
        menu: menu
    }, res);
    })
    })   
}

let restaurant_image_upload = (req,res) => {
    restaurant_image_store(req,res);
}

let food_image_upload = (req,res) => {
    food_image_store(req,res);
}
 
 let review_fetch = (req, res) => {
    Review.getReviewByRestaurantId(req.body.restaurant_id, (err,data) => {
        if (err){
            throw err;
        }
        if (data.length != 0){
            res.status(200).json({
                    success: true,
                    data: data,
                    message: 'Ok. Restaurant reviews'
                });
        }else{
            res.status(204).json({
                    success: false,
                    message: 'No Content. Data is null.'
                });
        }
    })
 }
let food_review_fetch = (req, res) => {
    Review.getReviewByFoodId(req.body.food_id, (err,data) => {
        if (err){
            throw err;
        }
        if (data.length != 0){
            res.status(200).json({
                    success: true,
                    data: data,
                    message: 'Ok. Food reviews'
                });
        }else{
            res.status(204).json({
                    success: false,
                    message: 'No Content. Data is null.'
                });
        }
    })
 }


 let rating_fetch = (req,res) => {
    Rating.getRatingByRestaurantAndFood(req.body, (err,data)=>{
        if (err){
            throw err;
        }
        if(data.length != 0){
            res.status(200).json({
                success: true,
                data:data,
                message: 'Ok. Ratings fetch'
            });
        }else{
            res.status(404).json({
                success: false,
                message: 'Not Found.'
            });
        }
    })
 }

let menu = (req,res) =>{
    let menu = null;
request({
            method: 'GET',
            uri: config.eatstreetAPI_baseURL + '/publicapi/v1/restaurant/' + req.body.restaurant_id +'/menu',
            headers: {
                "X-Access-Token": config.eatstreetAPI_key
            }
        },
        (error, response, body) => {
        if (error) {
            throw error; 
        }
        menu = JSON.parse(response.body);
        
   let data = menuFilter(menu,req.body.restaurant_id, res);
    })
}


let food_rating_fetch = (req,res) => {
    Rating.getRatingByFoodAndUser({user_id: req.decoded.id,food_id: req.body.food_id }, (err,data)=>{
        if (err){
            throw err;
        }
        if(data.length != 0){
            res.status(200).json({
                success: true,
                data:data,
                message: 'Ok. Ratings fetch for user and food'
            });
        }else{
            res.status(404).json({
                success: false,
                message: 'Not Found'
            });
        }
    })

}

let food = (req,res) => {

    let menu;
    let f;
    request({
            method: 'GET',
            uri: config.eatstreetAPI_baseURL + '/publicapi/v1/restaurant/' + req.body.restaurant_id +'/menu',
            headers: {
                "X-Access-Token": config.eatstreetAPI_key
            }
        },
        (error, response, body) => {
        if (error) {
            throw error; 
        }
        menu = JSON.parse(response.body);
        if (menu.length != 0 ){
            for (let i = 0 ; i < menu.length; i++){
                        for (let j = 0 ; j < menu[i].items.length; j++){
                                if (menu[i].items[j].apiKey === req.body.food_id){
                                    f = {
                                        food_id: menu[i].items[j].apiKey,
                                        name: menu[i].items[j].name,
                                        description: menu[i].items[j].description,
                                        price: menu[i].items[j].basePrice
                                    }
                                }
                        }
                    }
        }
            foodAverageRating.getRatingById({'food_id':req.body.food_id,'restaurant_id':req.body.restaurant_id},(err,data)=>{
                if (err) {
                    throw err;
                }
                Review.getReviewByFoodId(req.body.food_id,(e,d) => {
                    if (e) {
                        throw e;
                    }
                    let responseData = {
                        food: f,
                        ratings: data,
                        reviews: d
                    }
                    res.status(200).json({
                        success: true,
                        data: responseData,
                        message: 'Ok. Food details.'
                    });
    
                })
            })
    })
}

let skip = (req,res) => {
    var payload = {id: 'guest'};
    let secret = config.secret;
    var token = jwt.sign(payload, secret,{
        expiresIn : 60*60*24*30 // expires in 24 hours
    });

    res.status(200).json({
        success: true,
        token: token,
        message: 'Ok. Guest Login and Token'
    });
}
module.exports = { home, signup, login, restaurantList, restaurantDetail, restaurant_image_upload, food_image_upload,review_fetch,food_review_fetch,rating_fetch,menu,food_rating_fetch,food, skip };

