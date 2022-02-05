export default function handler(req, res) {

	const fs = require('fs-extra');

	fs.copy('./public/yt/', './uploads/', err =>{
  		if (err)
		  res.status(500).json(err);
		else {
			var files = fs.readdirSync('./public/yt/');
			res.status(200).json(files);
		}
	});
}