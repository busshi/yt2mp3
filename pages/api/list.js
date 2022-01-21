export default function handler(req, res) {

	const filesList = ['1', '2'];

	res.status(200).json({files: filesList})
}
