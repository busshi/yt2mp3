import fs from 'fs'
import path from 'path'

const ytPath = path.join(process.cwd(), 'public/yt')

export function dirListing() {
  	const filenames = fs.readdirSync(ytPath)
  	const filesList = filenames.map(filename => {
	const id = filename.replace(/\.mp3$/, '')
//    const fullPath = path.join(ytPath, filename)
//	const smallPath = fullPath.substring(fullPath.lastIndexOf('/')).substring(1)
	const dlPath = 'yt/' + filename
//	console.log(dlPath)
    return {
		id,
		dlPath,
		filename
    }
  })
  return filesList
}
