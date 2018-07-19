let mongoose = require('mongoose');

let restaurantImageSchema = mongoose.Schema({
	restaurant_id: String,
	user_id: String,
	image_url: String,
	timestamp: {type: Date, default: Date.now()}
});

restaurantImageSchema.pre('save', function (next) {
  if (this.isNew) this.timestamp = Date.now();
  next();
})

let restaurantImage = module.exports = mongoose.model('restaurantImage', restaurantImageSchema);

let addImage = (data, callback) => {
	restaurantImage.create(data, callback);
}

// Find User
let getImageByRestaurantId = (id, callback) => {
	restaurantImage.find({ 'restaurant_id': id }, callback);
}

let getImageByUserId = (id, callback) =>{
	restaurantImage.find({ 'user_id': id }, callback);
}
module.exports = { addImage, getImageByRestaurantId, getImageByUserId };