let mongoose = require('mongoose');

let restaurantAverageRatingSchema = mongoose.Schema({
	restaurant_id: String,
	number: {type: Number, default: 0},
	average: {type: Number, default: 0},
	timestamp: {type: Date, default: Date.now()}
});

restaurantAverageRatingSchema.pre('save', function (next) {
  if (this.isNew) this.timestamp = Date.now();
  next();
})

let restaurantAverageRating = module.exports = mongoose.model('restaurantAverageRating', restaurantAverageRatingSchema);

let all = (data,callback) => {
	restaurantAverageRating.find(data,callback);
}

// Add Rating
let addRestaurantAverageRating = (rating, callback) => {
	restaurantAverageRating.create(rating, callback);
}

// Find Rating by ID
let getRatingById = (data, callback) => {
	restaurantAverageRating.find({'restaurant_id':data}, callback);
}

// update existing rating
let updateRestaurantAverageRating = (data, callback) => {
  restaurantAverageRating.update({'restaurant_id':data.restaurant_id}, { $set: { number: data.number, average: data.average }}, callback);
}

module.exports = { all, addRestaurantAverageRating, getRatingById, updateRestaurantAverageRating };