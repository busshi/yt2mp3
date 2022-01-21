export default function handler(req, res) {
	const {spawn} = require('child_process');
	const link = req.query.link;
	const child = spawn('python3', ['scripts/yt2mp3.py', link]);
	var	standardOutput;

	child.stdout.on('data', function (data) {
		console.log('Pipe data from python script...');
		standardOutput= data.toString();
		console.log(standardOutput);
	});
	child.stderr.on('data', (data) => {
  		console.error(`stderr: ${data}`); 
	});
	child.on('close', (code) => {
		console.log(`child process exit with status code ${code}`);
		code == 0 ? res.status(200).json({link: link, state: 'converted'}) : res.status(200).json({link: link, state: 'not valid'});
	});
	//console.log({link});
	//res.status(200).json({link})
	//res.status(200).json({test: 'test'})
}
