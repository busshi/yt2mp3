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
	print('[+] Moving downloaded file to public/yt/')
	files = glob.glob('/Users/busshi/Documents/Projets Github/www/yt2mp3/*mp3')
	
	for file in files:
		print ('Moving file ', file);
		shutil.move(file, '/Users/busshi/Documents/Projets Github/www/yt2mp3/public/yt/')


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
