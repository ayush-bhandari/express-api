let Users = require('../models/users');
let restaurantImage = require('../models/restaurantImage');
let foodImage = require('../models/foodImage');
let review = require('../models/reviews');
let Ratings = require('../models/ratings');

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
							responseData.review = response;
						}
						Ratings.getRatingByUser(req.decoded.id, (error, response) =>{
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