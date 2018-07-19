let mime = require('mime');
let _ = require('lodash');

module.exports = (req, res, next) => {
	let supported_extensions = ['jpeg','jpg','png'];
	let file_ext = mime.extension(req.file.mimetype);

	if(_.includes(supported_extensions, file_ext)){
		next();
	}else{
		return res.status(400).json({ success: false, message: 'Bad Request. File Extension not supported. Supported extensions are jpeg, jpg and png.' });
	}
}