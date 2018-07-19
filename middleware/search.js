let config = require('../config/config');

module.exports = (req, res) => {
	let query = req.body;
	let api_url = config.eatstreetAPI_baseURL + '/publicapi/v1/restaurant/search?method=both';
	if ((query.search_params !== undefined) && (query.search_params !== null) && (query.search_params.length !== 0)){
		api_url = api_url + '&search=' + query.search_params;
	}

	if ((query.city_address !== undefined) && (query.city_address !== null) && (query.city_address.length !== 0)){
		if ((query.lat !== undefined) && (query.long !== undefined) && (query.lat !== null) && (query.long !== null) && (query.lat.length !== 0) && (query.long.length !== 0)){
			api_url = api_url + '&latitude=' + query.lat + '&longitude=' + query.long + '&street-address=' + query.city_address;
		}else{
			api_url = api_url + '&street-address=' + query.city_address;
		}
	}else{
		if ((query.lat !== undefined) && (query.long !== undefined) && (query.lat !== null) && (query.long !== null) && (query.lat.length !== 0) && (query.long.length !== 0)){
			api_url = api_url + '&latitude=' + query.lat + '&longitude=' + query.long;
		}else{
			return res.status(400).json({
                success: false,
                message: 'Bad Request. Request body must contain latitude and longitude or a valid city address.'
            });
		}
	}
	return api_url;
}