let mongoose = require('mongoose');

let ratingSchema = mongoose.Schema({
	restaurant_id: String,
	restaurant_name: String,
	food_id: String,
	food_name: String,
	food_price: String,
	ratings_value: {type: Number, default: 0},
	user_id: String,
	user: Object,
	timestamp: {type: Date, default: Date.now()}
});

ratingSchema.pre('save', function (next) {
  if (this.isNew) this.timestamp = Date.now();
  next();
})
let Ratings = module.exports = mongoose.model('Ratings', ratingSchema);

// Add Rating
let addRating = (data, callback) => {
	Ratings.create(data, callback);
}

//Find Rating by ID
let getRatingById = (data, callback) => {
	Ratings.find({'restaurant_id':data.restaurant_id,'food_id':data.food_id, 'user_id': data.user_id}, callback);
}

// Find all ratings 
let all = (data,callback) => {
	Ratings.find(data,callback);
}

//Find Rating by food and restaurant
let getRatingByFood = (data, callback) => {
	Ratings.find({'food_id':data}, callback);
}

//Find Rating by Restaurant
let getRatingByRestaurant = (data, callback) => {
	Ratings.find({'restaurant_id':data}, callback);
}

let getRatingByRestaurantAndFood = (data, callback) => {
	Ratings.find({'restaurant_id':data.restaurant_id,'food_id':data.food_id}, callback);
}

let getRatingByFoodAndUser = (data, callback) => {
	Ratings.find({'user_id':data.user_id,'food_id':data.food_id}, callback);
}

let getRatingByUser = (id, callback) => {
	Ratings.find({'user_id':id}, callback);
}
module.exports = { addRating, getRatingById, all, getRatingByFood, getRatingByRestaurant, getRatingByRestaurantAndFood, getRatingByFoodAndUser,getRatingByUser };