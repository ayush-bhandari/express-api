let foodAverageRating = require('../models/foodAverageRating');
let Reviews = require('../models/reviews');
let restaurantImage = require('../models/restaurantImage');
let foodImage = require('../models/foodImage');
let Ratings = require('../models/ratings');
let _ = require('lodash');

module.exports = (menu, restaurant_id, res) => {
	let reviews = null;
	let ratings = null;
	let top_rated_food = null;
	let food_images = null;
	let restaurant_images = null;

foodAverageRating.all({}, (err, data) => {
	if(err){
		throw err;
	}
		if (data.length > 0 ){
			for (let i = 0 ; i < menu.length; i++){
				for (let j = 0 ; j < menu[i].items.length; j++){
					for (let m = 0; m < data.length; m++){
					if (menu[i].items[j].apiKey === data[m].food_id){
						menu[i].items[j].ratings = data[m];
					}
				}
			}
		}
		}
		Reviews.getReviewByRestaurantId(restaurant_id, (err,data) => {
			if(err){
				throw err;
			}
			if (data.length > 0){
				reviews = data;
			}
			restaurantImage.getImageByRestaurantId(restaurant_id, (err,data) => {
				if(err){
					throw err;
				}
				if (data.length > 0){
					restaurant_images = data;
				}
				foodImage.getImageByRestaurantId(restaurant_id, (err,data)=>{
					if(err){
						throw err;
					}
					if (data.length > 0){
						food_images = data;
					}
					foodAverageRating.getRatingByRestaurantId(restaurant_id, (err,data) => {
						if(err){
							throw err;
						}
						if (data.length > 0){
							top_rated_food = _.take(_.orderBy(data, ['average'], ['desc']), 3);
						}
						Ratings.getRatingByRestaurant(restaurant_id, (err,data) => {
						if(err){
							throw err;
						}
						if (data.length > 0){
							ratings = data;
						}
						let returnData = {
							menu: menu,
							reviews: reviews,
							ratings: ratings,
							food_images: food_images,
							restaurant_images: restaurant_images,
							top_rated_food: top_rated_food
						}
						res.status(200).json({
					        success: true,
					        data: returnData,
					        message: 'Ok. Restaurant Menu, top_rated_food, each food item ratings.'
					    })
					})	
					})	
				})
			})
		})
	
})
}