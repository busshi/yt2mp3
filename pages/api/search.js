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
		console.log(`child process exit with status code ${code}`);
		if (code == 0)
			res.status(200).json({link: link, state: 'converted'});
		else
			res.status(200).json({link: link, state: 'not valid'});
	});
}
