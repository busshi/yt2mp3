export default function handler(req, res) {

	var fs = require('fs');
	var files = fs.readdirSync('public/yt/');

	res.status(200).json({available_links: files})
}
