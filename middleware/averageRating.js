let Rating = require('../models/ratings');
let foodAverageRating = require('../models/foodAverageRating');
let restaurantAverageRating = require('../models/restaurantAverageRating');
let _ = require('lodash');
let moment = require('moment');

module.exports = () => {
	Rating.all({}, (err, allData) =>{
		if (err){
			throw err;
		}

		let uniqueFoodIdTest = _.uniqBy(allData,'food_id');
		let uniqueFoodId = [];
		for (let j = 0; j< uniqueFoodIdTest.length; j++){
			uniqueFoodId[j] = _.pick(uniqueFoodIdTest[j], [ 'restaurant_id','food_id']);
		}
		let uniqueRestaurantId = _.map(_.uniqBy(allData,'restaurant_id'),'restaurant_id');

		for(let i=0;i<uniqueFoodId.length;i++){

			Rating.getRatingByRestaurantAndFood(uniqueFoodId[i], (err, data) => {
			if (err){
				throw err;
			}
			if(data.length > 0){
				let total =0;
				for (let j = 0; j<data.length; j++){
					total = total + data[j].ratings_value;
				}
				let storeData = {
					restaurant_id: uniqueFoodId[i].restaurant_id,
					restaurant_name: data[0].restaurant_name,
					food_id: uniqueFoodId[i].food_id,
					food_name: data[0].food_name,
					food_price: data[0].food_price,
					number: data.length,
					average: (total/data.length).toFixed(1)
				}
				foodAverageRating.getRatingById(uniqueFoodId[i], (err, responseData) => {
					if (err){
						throw err;
					}
					if(responseData.length > 0){
						foodAverageRating.updateFoodAverageRating(storeData);
				    }else{
						foodAverageRating.addFoodAverageRating(storeData);
					}				
				});
			}
		});
		}

		for(let i=0;i<uniqueRestaurantId.length;i++){
			Rating.getRatingByRestaurant(uniqueRestaurantId[i], (err, data) => {
			if (err){
				throw err;
			}
			if(data.length > 0){
				let total =0;
				for (let j = 0; j<data.length; j++){
					total = total + data[j].ratings_value;
				}
				let storeData = {
					restaurant_id: uniqueRestaurantId[i],
					number: data.length,
					average: (total/data.length).toFixed(1)
				}
				restaurantAverageRating.getRatingById(uniqueRestaurantId[i], (err, responseData) => {
					if (err){
						throw err;
					}
					if(responseData.length > 0){
						restaurantAverageRating.updateRestaurantAverageRating(storeData);
					}else{
						restaurantAverageRating.addRestaurantAverageRating(storeData);
					}				
				});
			}
		});
		}
	});
}
