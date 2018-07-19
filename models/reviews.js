let mongoose = require('mongoose');

let reviewSchema = mongoose.Schema({
	restaurant_id: String,
	restaurant_name: String,
	food_id: String,
	food_name: String,
	review: String,
	user_id: String,
	user: Object,
	timestamp: {type: Date, default: Date.now()}
});

reviewSchema.pre('save', function (next) {
  if (this.isNew) this.timestamp = Date.now();
  next();
})

let Review = module.exports = mongoose.model('Review', reviewSchema);

// Add Review
let addReview = (data, callback) => {
	Review.create(data, callback);
}

let getReviewById = (data, callback) => {
	Review.find({'restaurant_id':data.restaurant_id,'food_id':data.food_id, 'user_id': data.user_id}, callback);
}

let getReviewByUserId = (id, callback) => {
	Review.find({'user_id': id}, callback);
}
let getReviewByRestaurantId = (id, callback) => {
	Review.find({'restaurant_id': id}, callback);
}
let getReviewByFoodId = (id, callback) => {
	Review.find({'food_id': id}, callback);
}
module.exports = { addReview, getReviewById, getReviewByUserId, getReviewByRestaurantId,getReviewByFoodId };