let User = require('../models/users');
let controller = require('../controller/api/v1/controller');
let auth = require('../middleware/auth');
let validate = require('express-validation');
let validation = require('../validation/validation');
let image_validation = require('../middleware/ImageValidation');
let user_profile = require('../middleware/userProfile');
let RestaurantAndFoodNameFinder = require('../middleware/nameFinder');
let RestaurantAndFoodNameFinderRatings = require('../middleware/nameFinderRatings');
let userFetch = require('../middleware/userFetch');

let Multer  = require('multer');
let maxSize = 5000000; // 5 MB in bytes
let upload = Multer({limits: { fileSize: maxSize }});

module.exports = (app) => {

	app.route("/api").get(controller.home);

	app.route("/api/login").post(validate(validation.login),controller.login);
	app.route("/api/signup").post(validate(validation.signup),controller.signup);
	
	app.route("/api/v1/user").post(auth,validate(validation.user),userFetch);
	app.route("/api/v1/user_profile").get(auth,user_profile);

	app.route("/api/v1/restaurant/list").post(auth,validate(validation.restaurantList),controller.restaurantList);
	app.route("/api/v1/restaurant/detail").post(auth,validate(validation.restaurantDetail),controller.restaurantDetail);

	app.route("/api/v1/restaurant/menu").post(auth,validate(validation.menu),controller.menu);
	app.route("/api/v1/restaurant/food").post(auth,validate(validation.food),controller.food);
	
	app.route("/api/v1/restaurant/rate").post(auth,validate(validation.rate_create),RestaurantAndFoodNameFinderRatings);
	app.route("/api/v1/restaurant/review").post(auth,validate(validation.review_create),RestaurantAndFoodNameFinder);

	app.route("/api/v1/restaurant/review_fetch").post(auth,validate(validation.review_fetch),controller.review_fetch);
	app.route("/api/v1/food/review_fetch").post(auth,validate(validation.food_review_fetch),controller.food_review_fetch);
	
	app.route("/api/v1/restaurant/rate_fetch").post(auth,validate(validation.rating_fetch),controller.rating_fetch);
	app.route("/api/v1/restaurant/food_rate_fetch").post(auth,validate(validation.food_rating_fetch),controller.food_rating_fetch);
	
	app.route("/api/v1/restaurant/restaurant_image_upload").post(auth,upload.single('restaurant_image'),validate(validation.restaurant_image_upload),image_validation,controller.restaurant_image_upload);
	app.route("/api/v1/restaurant/food_image_upload").post(auth,upload.single('food_image'),validate(validation.food_image_upload),image_validation,controller.food_image_upload);
	
	app.route("/api/v1/skip").post(controller.skip);
}