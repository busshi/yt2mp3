import fs from 'fs'
import path from 'path'

const ytPath = path.join(process.cwd(), './yt')

export function dirListing() {
  	const filenames = fs.readdirSync(ytPath)
  	const filesList = filenames.map(filename => {
	const id = filename.replace(/\.mp3$/, '')
    const fullPath = path.join(ytPath, filename)
	console.log(fullPath);
    return {
		id,
      	fullPath
    }
  })
	console.log(filesList)
  return filesList
}
