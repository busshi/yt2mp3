#!/usr/bin/env python3

import youtube_dl
import sys, os, shutil, glob

options = {
    'format': 'bestaudio/best',
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'mp3',
        'preferredquality': '320',
    }],
}

def move():
	workdir = os.getcwd()
	print('[+] Moving downloaded file to public/yt/')
	files = glob.glob(workdir + '/*mp3')
	
	for file in files:
		pos = file.rfind('-')
		newname = file[:pos] + file[-4:]
		print ('[+] Renaming file ', file, ' -> ', newname)
		os.rename(file, newname)
		print ('[+] Moving file ', newname);
		shutil.move(newname, workdir + '/public/yt/')


if __name__ == "__main__":
	if (len(sys.argv) < 2):
		print ("Usage: ./yt2mp3.py [URL]")
		exit(1)
	else:
		with youtube_dl.YoutubeDL(options) as ydl:
			link = sys.argv[1:]
			print("[+] Downloading from URL: ", sys.argv[1])
			ydl.download(link)
			move()
