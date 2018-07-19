let request = require('request');
let config = require('../config/config');
let Review = require('../models/reviews');
let User = require('../models/users');

module.exports = (req,res) => {
	 let restaurant_name = null;
     let food_name = null;

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
        restaurant_name = JSON.parse(response.body).restaurant.name;
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
        let menu = JSON.parse(response.body);

        // Menu parsing to get food_name from food_id 
        for (let i=0; i<menu.length; i++){
        	for(let j=0; j<menu[i].items.length; j++){
        		if(req.body.food_id === menu[i].items[j].apiKey){
        			food_name = menu[i].items[j].name;
        		}
        	}
        }


        User.getUserByDBId(req.decoded.id, (e,d) =>{
        if (e){
            throw e;
        }
        if (d.length != 0 ){
        let user_data = {
            restaurant_id: req.body.restaurant_id,
            restaurant_name: restaurant_name,
            food_id: req.body.food_id,
            food_name: food_name,
            user_id: req.decoded.id,
            user: d,
            review: req.body.review
        }
    Review.getReviewById(user_data, (err, data) => {
        if(err){
            throw err;
        }else if (!(data.length != 0)){
        Review.addReview(user_data, (err, data) => {
            if(err) {
               throw err;
            }else if (data.length != 0){
                    res.status(201).json({
                        success: true,
                        data: data,
                        message: 'Created. Review Stored Succesfully'
                    }) 
                } else if (!data) {
                res.status(404).json({
                    success: false,
                    message: 'Reviews not found.'
                }); 
                }else if (!(data.length != 0)) {
                res.status(404).json({
                    success: false,
                    message: 'Reviews not found.'
                }); 
                }else{
                res.status(400).json({
                    success: false,
                    message: 'Bad Request.'
                }); 
                }
            
        });
    }else if (data.length != 0){
        res.status(400).json({
                    success: false,
                    message: 'Bad Request. Reviews Already stored for this user, restaurant and food.'
                });
    }else{
        res.status(400).json({
                    success: false,
                    message: 'Bad Request.'
                });
    }
    });
        }

});
});
});
}