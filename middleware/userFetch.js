let Users = require('../models/users');
let restaurantImage = require('../models/restaurantImage');
let foodImage = require('../models/foodImage');
let review = require('../models/reviews');
let Ratings = require('../models/ratings');

module.exports = (req, res) => {
 if (req.body.user_id === "guest"){
 		res.status(204).json({
	        success: true,
	        message: 'No Content. This is a guest profile.'
	    })
 }
	let responseData = {};
	if (req.body.user_id !== null) {
		Users.getUserByDBId(req.body.user_id, (err,data) =>{
			if(err){
				res.status(404).json({
			        success: false,
			        message: 'User Profile not found.'
			    })
			}
			if (data.length !== 0){
				responseData.user = data;
			}
			restaurantImage.getImageByUserId(req.body.user_id, (e,d) => {
				if (e){
					res.status(404).json({
				        success: false,
				        message: 'User Profile not found.'
				    })
				}
				if (d.length !== 0 ){
					responseData.restaurantImage = d;
				}
				foodImage.getImageByUserId(req.body.user_id, (er,da) => {
					if(er){
						res.status(404).json({
					        success: false,
					        message: 'User Profile not found.'
					    })
					}
					if(da.length !== 0){
						responseData.foodImage = da;
					}
					review.getReviewByUserId(req.body.user_id, (error, response) =>{
						if(error){
							res.status(404).json({
						        success: false,
						        message: 'User Profile not found.'
						    })
						}
						if(response.length !==0 ){
							responseData.review = response;
						}
					Ratings.getRatingByUser(req.body.user_id, (error, response) =>{
							if(error){
								throw error;
							}
							if(response.length !==0 ){
								responseData.ratings = response;
							}
							res.status(200).json({
						        success: true,
						        data: responseData,
						        message: 'Ok. User Profile'
						    })
						})
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