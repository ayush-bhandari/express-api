let haversine = require('haversine');

let multiple = (req,res) => {
		let data = JSON.parse(res.body);
        if ((req.body.lat !== undefined) && (req.body.long !== undefined) && (req.body.lat !== null) && (req.body.long !== null) && (req.body.lat.length !== 0) && (req.body.long.length !== 0)){
            
            for (let i = 0; i < data.restaurants.length; i++){
                let start = {
                    latitude: req.body.lat,
                    longitude: req.body.long
                }
                let end = {
                    latitude: data.restaurants[i].latitude,
                    longitude: data.restaurants[i].longitude
                }
                data.restaurants[i].distance = haversine(start, end, {unit: 'meter'});
            }
        }
        return data;
}

let single = (req,res) => {
		let data = JSON.parse(res.body);
        if ((req.body.lat !== undefined) && (req.body.long !== undefined) && (req.body.lat !== null) && (req.body.long !== null) && (req.body.lat.length !== 0) && (req.body.long.length !== 0)){
            
                let start = {
                    latitude: req.body.lat,
                    longitude: req.body.long
                }
                let end = {
                    latitude: data.restaurant.latitude,
                    longitude: data.restaurant.longitude
                }
                data.restaurant.distance = haversine(start, end, {unit: 'meter'});
            
        }
        return data;
}

module.exports = { multiple, single}