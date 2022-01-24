export default function handler(req, res) {

	const link = req.body.link;
	let title;

	const {spawn} = require('child_process');
	const child = spawn('python3', ['scripts/yt2mp3.py', 'get_filename', link]);

	child.stdout.on('data', function (data) {
		console.log(data.toString());
		title = data.toString();
	});

	child.stderr.on('data', (data) => {
  		console.error(`stderr: ${data}`); 
	});

	child.on('close', (code) => {
		let title_status;
		console.log(`child process exit with status code ${code}`);
		if (code == 0)
			title_status = 'found';
		else
			title_status = 'error';
		res.status(200).json({link: link, title: title, state: title_status});
	});
}
