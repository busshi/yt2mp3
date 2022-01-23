export default function handler(req, res) {

	const link = req.body.link;

	const {spawn} = require('child_process');
	const child = spawn('python3', ['scripts/yt2mp3.py', link]);

	child.stdout.on('data', function (data) {
		console.log(data.toString());
	});

	child.stderr.on('data', (data) => {
  		console.error(`stderr: ${data}`); 
	});

	child.on('close', (code) => {
		var convert_status;
		console.log(`child process exit with status code ${code}`);
		if (code == 0)
			convert_status = 'converted';
		else
			convert_status = 'conversion error';
		res.status(200).json({link: link, state: convert_status});
	});
}
