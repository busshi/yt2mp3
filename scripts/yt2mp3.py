#!/usr/bin/env python3

import youtube_dl
import sys

options = {
    'format': 'bestaudio/best',
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'mp3',
        'preferredquality': '320',
    }],
}

if __name__ == "__main__":
	if (len(sys.argv) < 2):
		print ("Usage: ./yt2mp3.py [URL]")
	with youtube_dl.YoutubeDL(options) as ydl:
		link = sys.argv[1:]
		ydl.download(link)
