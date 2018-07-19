let mongoose = require('mongoose');

let foodImageSchema = mongoose.Schema({
	restaurant_id: String,
	food_id: String,
	user_id: String,
	image_url: String,
	timestamp: {type: Date, default: Date.now()}
});

foodImageSchema.pre('save', function (next) {
  if (this.isNew) this.timestamp = Date.now();
  next();
})

let foodImage = module.exports = mongoose.model('foodImage', foodImageSchema);

let addImage = (data, callback) => {
	foodImage.create(data, callback);
}
let all = (data, callback) => {
	foodImage.find(data, callback);
}
// Find User
let getImageByFoodId = (id, callback) => {
	foodImage.find({ 'food_id': id }, callback);
}

let getImageByUserId = (id, callback) =>{
	foodImage.find({ 'user_id': id }, callback);
}
let getImageByRestaurantId = (id, callback) =>{
	foodImage.find({ 'restaurant_id': id }, callback);
}
module.exports = { addImage, getImageByFoodId, getImageByUserId, getImageByRestaurantId,all };