import fs from 'fs'
import path from 'path'

const ytPath = path.join(process.cwd(), 'public/yt')

export function dirListing() {
  	const filenames = fs.readdirSync(ytPath)
  	const filesList = filenames.map(filename => {
	const id = filename.replace(/\.mp3$/, '')
	const dlPath = 'yt/' + filename
    return {
		id,
		dlPath,
		filename
    }
  })
  return filesList
}
