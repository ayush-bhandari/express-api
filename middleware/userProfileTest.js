let Users = require('../models/users');
let restaurantImage = require('../models/restaurantImage');
let foodImage = require('../models/foodImage');
let review = require('../models/reviews');
let Ratings = require('../models/ratings');
let request = require('request');
let config = require('../config/config');

module.exports = (req, res) => {
 if (req.decoded.id === "guest"){
 		res.status(204).json({
	        success: true,
	        message: 'No Content. This is a guest profile.'
	    })
 }
	let responseData = {};
	if (req.decoded.id !== null) {
		Users.getUserByDBId(req.decoded.id, (err,data) =>{
			if(err){
				throw err;
			}
			if (data.length !== 0){
				responseData.user = data;
			}
			restaurantImage.getImageByUserId(req.decoded.id, (e,d) => {
				if (e){
					throw e;
				}
				if (d.length !== 0 ){
					responseData.restaurantImage = d;
				}
				foodImage.getImageByUserId(req.decoded.id, (er,da) => {
					if(er){
						throw er;
					}
					if(da.length !== 0){
						responseData.foodImage = da;
					}
					review.getReviewByUserId(req.decoded.id, (error, response) =>{
						if(error){
							throw error;
						}
						if(response.length !==0 ){
							// responseData.review = response;
							let queryData = _.map(response, 'restaurant_id');
							for (let i=0; i<response.length;i++){
								request({
							            method: 'GET',
							            uri: config.eatstreetAPI_baseURL + '/publicapi/v1/restaurant/' + response[i].restaurant_id +'/menu',
							            headers: {
							                "X-Access-Token": config.eatstreetAPI_key
							            }
							        },
							        (err, resp, body) => {
							        if (err) {
							            throw err;
							        }
							        let menu = JSON.parse(resp.body);
							        Ratings.all({}, (e, r) =>{
										if(e){
											throw e;
										}
							        for (let i = 0 ; i < menu.length; i++){
										for (let j = 0 ; j < menu[i].items.length; j++){					
											if (menu[i].items[j].apiKey === response[i].food_id){
												response.foodItem.food_id = menu[i].items[j].apiKey;
												response.foodItem.name = menu[i].items[j].name;
												response.foodItem.description = menu[i].items[j].description;
												response.foodItem.price = menu[i].items[j].basePrice;
												response.foodItem.ratings = [];
												count =0;
												for (let m=0; m<r.length;m++){
													if (menu[i].items[j].apiKey === r[m].food_id){
														response.foodItem.ratings[count] = r[m];
														count++;
													}
												}
											}
										}
									}

							    })
							    })
							}
						}
						responseData.review = response;
					// 	Ratings.getRatingByUser(req.decoded.id, (error, response) =>{
					// 	if(error){
					// 		throw error;
					// 	}
					// 	if(response.length !==0 ){
					// 		responseData.ratings = response;
					// 	}
						res.status(200).json({
					        success: true,
					        data: responseData,
					        message: 'Ok. User Profile'
					    })
					// })
					})
				})
			})
		})	
	}else{
		res.status(404).json({
	        success: false,
	        message: 'User Profile not found.'
	    })
	}
	
}