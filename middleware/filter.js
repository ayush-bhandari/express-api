let foodAverageRating = require('../models/foodAverageRating');
let restaurantAverageRating = require('../models/restaurantAverageRating');
let Reviews = require('../models/reviews');
let restaurantImage = require('../models/restaurantImage');
let foodImage = require('../models/foodImage');
let Ratings = require('../models/ratings');
let _ = require('lodash');

let list = (query,res) => {
	restaurantAverageRating.all({}, (err, data) =>{
		if (err) {
			throw err;
		}
		if (data.length > 0){
			for (let i=0; i< data.length; i++){
				for (let j = 0 ; j < query.restaurants.length; j++){
					if (data[i].restaurant_id === query.restaurants[j].apiKey){
						query.restaurants[j].rating= data[i];
					}
				}
			}
		}
		let dat = []; 
	for (let i = 0 ; i < query.restaurants.length; i++){
		let d = {
			id: query.restaurants[i].apiKey,
			name: query.restaurants[i].name,
			image_url: query.restaurants[i].logoUrl,
			food_types: query.restaurants[i].foodTypes,
			distance: query.restaurants[i].distance,
			contact: query.restaurants[i].phone,
			location: query.restaurants[i].streetAddress + ',' + query.restaurants[i].city + ',' + query.restaurants[i].state,
			zip: query.restaurants[i].zip,
			open_status: query.restaurants[i].open,
			rating: query.restaurants[i].rating,
			coordinates: {
				latitude: query.restaurants[i].latitude,
				longitude: query.restaurants[i].longitude
			}
		}
		dat[i] = d;
	}
	
	res.status(200).json({
            success: true,
            data: dat,
            message: 'Ok. Restaurant Lists.'
        });
	})


}

let detail = (query,res) => {
	foodImage.all({}, (err, data) => {
	if(err){
		throw err;
	}
		if (data.length > 0 ){
			for (let i = 0 ; i < query.menu.length; i++){
				for (let j = 0 ; j < query.menu[i].items.length; j++){
					let images = [];
					count = 0;
					for (let m = 0; m < data.length; m++){
						if ((query.menu[i].items[j].apiKey === data[m].food_id) && (query.detail.apiKey === data[m].restaurant_id)){
							images[count] = data[m];
							count++;
						}
					}
					if (images.length != 0){
						query.menu[i].items[j].images = images;
					}
				
			}
		}
		}
foodAverageRating.all({}, (err, data) => {
	if(err){
		throw err;
	}
		if (data.length > 0 ){
			for (let i = 0 ; i < query.menu.length; i++){
				for (let j = 0 ; j < query.menu[i].items.length; j++){
					for (let m = 0; m < data.length; m++){
					if (query.menu[i].items[j].apiKey === data[m].food_id){
						query.menu[i].items[j].ratings = data[m];
					}
				}
			}
		}
		}
		Reviews.getReviewByRestaurantId(query.detail.apiKey, (err,data) => {
			if(err){
				throw err;
			}
			if (data.length > 0){
				query.detail.reviews = data;
			}
			restaurantImage.getImageByRestaurantId(query.detail.apiKey, (err,data) => {
				if(err){
					throw err;
				}
				if (data.length > 0){
					query.detail.restaurant_images = data;
				}
				foodImage.getImageByRestaurantId(query.detail.apiKey, (err,data)=>{
					if(err){
						throw err;
					}
					if (data.length > 0){
						query.detail.food_images = data;
					}
					foodAverageRating.getRatingByRestaurantId(query.detail.apiKey, (err,data) => {
						if(err){
							throw err;
						}
						if (data.length > 0){
							query.detail.top_rated_food = _.take(_.orderBy(data, ['average'], ['desc']), 3);
						}
						let d = {
							id: query.detail.apiKey,
							name: query.detail.name,
							image_url: query.detail.logoUrl,
							distance: query.detail.distance,
							food_types: query.detail.foodTypes,
							contact: query.detail.phone,
							location: query.detail.streetAddress + ',' + query.detail.city + ',' + query.detail.state,
							zip: query.detail.zip,
							open_status: query.detail.open,
							menu: query.menu,
							opening_hours: query.detail.hours,
							delivery_options: query.detail.offersDelivery,
							coordinates: {
								latitude: query.detail.latitude,
								longitude: query.detail.longitude
							},
							reviews: query.detail.reviews,
							restaurant_images:query.detail.restaurant_images,
							food_images:query.detail.food_images,
							top_rated_food : query.detail.top_rated_food
						}
						res.status(200).json({
					        success: true,
					        data: d,
					        message: 'Ok. Restaurant Details and Menu.'
					    })
					})	
				})
			})
		})
	
})
})
}

module.exports = { list, detail }