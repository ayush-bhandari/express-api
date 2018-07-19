let mongoose = require('mongoose');

let foodAverageRatingSchema = mongoose.Schema({
	restaurant_id: String,
	restaurant_name: String,
	food_id: String,
	food_name: String,
	food_price: String,
	number: {type: Number, default: 0},
	average: {type: Number, default: 0},
  	timestamp: {type: Date, default: Date.now()}
});

foodAverageRatingSchema.pre('save', function (next) {
  if (this.isNew) this.timestamp = Date.now();
  next();
})

let foodAverageRating = module.exports = mongoose.model('foodAverageRating', foodAverageRatingSchema);

// Add Rating
let addFoodAverageRating = (rating, callback) => {
	foodAverageRating.create(rating, callback);
}

let all = (data,callback) => {
  foodAverageRating.find(data,callback);
}

// Find Rating by ID
let getRatingById = (data, callback) => {
	foodAverageRating.find({'food_id':data.food_id,'restaurant_id':data.restaurant_id}, callback);
}

let getRatingByRestaurantId = (data, callback) => {
	foodAverageRating.find({'restaurant_id':data}, callback);
}
// update existing rating
let updateFoodAverageRating = (data, callback) => {
  foodAverageRating.update({'food_id':data.food_id,'restaurant_id':data.restaurant_id}, { $set: { number: data.number, average: data.average }}, callback);
}

module.exports = { addFoodAverageRating, getRatingById, updateFoodAverageRating, all,getRatingByRestaurantId };