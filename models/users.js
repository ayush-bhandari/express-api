let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
	name: String,
	email: String,
	gender: String,
	age: String,
	fb_id: String,
	profile_pic: String,
	timestamp: {type: Date, default: Date.now()}
});
userSchema.pre('save', function (next) {
  if (this.isNew) this.timestamp = Date.now();
  next();
})
let Users = module.exports = mongoose.model('Users', userSchema);

// Add User
let addUser = (user, callback) => {
	Users.create(user, callback);
}

// Find User
let getUserById = (id, callback) => {
	Users.find({ 'fb_id': id }, callback);
}

let getUserByDBId = (id, callback) => {
	Users.find({ '_id': id }, callback);
}
module.exports = { addUser, getUserById, getUserByDBId };