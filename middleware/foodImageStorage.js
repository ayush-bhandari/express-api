let foodImage = require('../models/foodImage');
let mime = require('mime');

let bucketName = "tastingspoon";
let AWS = require("aws-sdk");
AWS.config.loadFromPath('./config/aws.json');
let s3Bucket = new AWS.S3( { params: {Bucket: bucketName} } );

let moment = require("moment");

module.exports = (req,res) => {
	let file_ext = mime.extension(req.file.mimetype);
	let keyName = req.file.fieldname+ '-' + req.body.food_id + '-' + moment() +'.'+file_ext;
	let file = req.file.buffer;
	let s3UploadData = {
		Key: keyName,
		Body: file,
		ACL: 'public-read'
	};
	s3Bucket.putObject(s3UploadData, (err, data) => {
		if (err){
			throw err;
		}
		// let url = s3Bucket.getSignedUrl('getObject', {Bucket: bucketName, Key: keyName});
		let url = 'https://'+ bucketName +'.s3.amazonaws.com/'+ keyName;
		let storeData = {
			restaurant_id: req.body.restaurant_id,
			food_id: req.body.food_id,
			user_id: req.decoded.id,
			image_url: url
		}
		foodImage.addImage(storeData, (e,d) =>{
			if (e) {
				throw e;
			}
			res.status(201).json({
		        success: true,
		        data: d,
		        message: 'Created. Image Successfully Uploaded.'
		    })
		})
	});
}