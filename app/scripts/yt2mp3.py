#!/usr/bin/env python3

import youtube_dl
import sys, os, glob

def setOptions(quality):
    if not quality:
        quality = '320'

    return {
	    'quiet': 'true',
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': quality,
        }],
    }

def move():
	workdir = os.getcwd()
	print('[+] Moving downloaded file to public/yt/')
	files = glob.glob(workdir + '/*mp3')
	
	for file in files:
		pos = file.rfind('-')
		tmp = file[:pos] + file[-4:]
		newname = tmp.replace(" (Clip Officiel)", "")
		newname = newname.replace(" (Clip officiel)", "")
		newname = newname.replace(" (HD)", "")
		print ('[+] Renaming file ', file, ' -> ', newname)
		pos2 = newname.rfind('/')
		tmp2 = newname[pos2:]
		print ('[+] Moving file ', newname, ' to /usr/app/public/yt')
		print (tmp2)
		os.rename(file, "/usr/app/public/yt" + tmp2)

if __name__ == "__main__":
    if (len(sys.argv) < 2):
        print ("Usage: ./yt2mp3.py [Encoding Quality] [URL]")
        exit(1)
    else:
        if (sys.argv[1] == 'get_filename'):
            with youtube_dl.YoutubeDL() as ydl:
                info_dict = ydl.extract_info(sys.argv[2], download=False)
                print (info_dict['title'])
            
        else:
            quality = sys.argv[1]
            link = sys.argv[2:]
            options = setOptions(quality)
            with youtube_dl.YoutubeDL(options) as ydl:
                ydl.download(link)
                move()

