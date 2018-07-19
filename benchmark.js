var apiBenchmark = require('api-benchmark');
var fs = require('fs');
var service = {
  server: "http://ec2-54-148-142-92.us-west-2.compute.amazonaws.com/"
};

var routes = {
		home: {
			method: 'get',
			route: 'api/'
		},
		// skip: {
		// 	method: 'post',
		// 	route: 'api/v1/skip'
		// }
		restaurantList: {
			method: 'post',
			route: 'api/v1/restaurant/list',
			headers:{
				'Content-Type':'Application/JSON',
				'ts-backend-token':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Imd1ZXN0IiwiaWF0IjoxNTAxNzY3MDIxLCJleHAiOjE1MDQzNTkwMjF9.pQ2IXKmlLEue13cqZiXclOLLvJEGwIaHE2fc94VaUAE'
			},
			data: JSON.stringify({
				"city_address":"New York",
				"search_params":"pizza"
			})
		},
		restaurantDetail: {
			method: 'post',
			route: 'api/v1/restaurant/detail',
			headers:{
				'Content-Type':'Application/JSON',
				'ts-backend-token':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Imd1ZXN0IiwiaWF0IjoxNTAxNzY3MDIxLCJleHAiOjE1MDQzNTkwMjF9.pQ2IXKmlLEue13cqZiXclOLLvJEGwIaHE2fc94VaUAE'
			},
			data: JSON.stringify({
				"restaurant_id":"8281b9237d8a5333144247b91fbcb2f3d548bfb0fbc2a739"
			})
		},
		rate: {
			method: 'post',
			route: 'api/v1/restaurant/rate',
			headers:{
				'Content-Type':'Application/JSON',
				'ts-backend-token':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Imd1ZXN0IiwiaWF0IjoxNTAxNzY1NTU0LCJleHAiOjE1MDQzNTc1NTR9.1TutXE4TwkHjP2jOFSHNgmI_1NRpZIELjztRUclxu9c'
			},
			data: JSON.stringify({
				"restaurant_id":"8281b9237d8a5333144247b91fbcb2f3d548bfb0fbc2a739",
				"food_id":"8663790",
    			"ratings_value":4 
			})
		},
		review: {
			method: 'post',
			route: 'api/v1/restaurant/review',
			headers:{
				'Content-Type':'Application/JSON',
				'ts-backend-token':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Imd1ZXN0IiwiaWF0IjoxNTAxNzY1NTU0LCJleHAiOjE1MDQzNTc1NTR9.1TutXE4TwkHjP2jOFSHNgmI_1NRpZIELjztRUclxu9c'
			},
			data: JSON.stringify({
				"restaurant_id":"8281b9237d8a5333144247b91fbcb2f3d548bfb0fbc2a739",
				"food_id": "8663790",
			    "food_name": "Garlic Knots Catering - Half",
			    "review":"Very tasty"
			})
		},
		userProfile: {
			method: 'get',
			route: 'api/v1/user_profile',
			headers:{
				'Content-Type':'Application/JSON',
				'ts-backend-token':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Imd1ZXN0IiwiaWF0IjoxNTAxNzY1NTU0LCJleHAiOjE1MDQzNTc1NTR9.1TutXE4TwkHjP2jOFSHNgmI_1NRpZIELjztRUclxu9c'
			}
		}
	};

apiBenchmark.measure(service, routes, {debug: false,
			runMode: 'parallel',
			maxConcurrentRequests: 5,
			delay: 0,
			maxTime: 100000,
			minSamples: 100,
			stopOnError: false}, function(err, results){
	apiBenchmark.getHtml(results, function(error, html){
    fs.writeFileSync('benchmarks.html', html);
  });
});