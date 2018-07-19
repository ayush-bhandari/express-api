let Joi = require('joi');

let login = {
  body: {
    fb_id: Joi.string().required()
  }
}

let signup = {
  body: {
    name: Joi.string().required(),
    email: Joi.string().required(),
    gender: Joi.string().required(),
    age: Joi.string().required(),
    fb_id: Joi.string().required(),
    profile_pic: Joi.string().required()
  }
}

let restaurantList = {
  body: {
    lat: Joi.number(),
    long: Joi.number(),
    city_address: Joi.string(),
    search_params: Joi.string()
  }
}

let restaurantDetail = {
  body: {
    restaurant_id: Joi.string().required()
  }
}

let rate_create = {
  body: {
    restaurant_id: Joi.string().required(),
    food_id: Joi.string().required(),
    ratings_value: Joi.number().required()
  }
}

let restaurant_image_upload = {
  body: {
    restaurant_id: Joi.string().required()
  }
}

let food_image_upload = {
  body: {
    restaurant_id: Joi.string().required(),
    food_id: Joi.string().required()
  }
}

let review_create = {
  body: {
    restaurant_id: Joi.string().required(),
    food_id: Joi.string().required(),
    review: Joi.string().required()
  }
}
let review_fetch = {
  body: {
    restaurant_id: Joi.string().required()
  }
}
let food_review_fetch = {
  body: {
    food_id: Joi.string().required()
  }
}

let rating_fetch = {
  body: {
    food_id: Joi.string().required(),
    restaurant_id: Joi.string().required()
  }
}

let menu = {
  body: {
    restaurant_id: Joi.string().required()
  }
}

let food_rating_fetch = {
  body: {
    food_id: Joi.string().required()
  }
}

let user = {
  body:{
    user_id: Joi.string().required()
  }
}

let food = {
  body: {
    food_id: Joi.string().required(),
    restaurant_id: Joi.string().required()
  }
}

module.exports = { login, signup, restaurantList, restaurantDetail, rate_create, review_create, restaurant_image_upload, food_image_upload, review_fetch,food_review_fetch, rating_fetch,menu, food_rating_fetch, food,user }