#!/usr/bin/env python3

import youtube_dl
import sys, os, glob, urllib

def setOptions(quality):
    if not quality:
        quality = '320'

    return {
	    'quiet': 'false',
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': quality,
        }],
    }

def move(title, thumb_url):
	workdir = os.getcwd()
	print('[+] Moving downloaded file to public/yt/')
	files = glob.glob(workdir + '/*mp3')
	
	for file in files:
		pos = file.rfind('-')
		tmp = file[:pos] + file[-4:]
		newname = tmp.replace(" (Clip Officiel)", "").replace(" (Clip officiel)", "").replace(" (HD)", "")
		print ('[+] Renaming file ', file, ' -> ', newname)
		pos2 = newname.rfind('/')
		tmp2 = newname[pos2:]
		print ('[+] Moving file ', newname, ' to /usr/app/public/yt')
		os.rename(file, "/usr/app/public/yt" + tmp2)
		print ('[+] Downloading thumb')
		print (tmp2[-4:])
		urllib.request.urlretrieve(thumb_url, 'public/thumb' + tmp2[:-4] + '.jpeg')
 
if __name__ == "__main__":
    if (len(sys.argv) < 2):
        print ("Usage: ./yt2mp3.py [Encoding Quality] [URL]")
        exit(1)
    else:
        if (sys.argv[1] == 'get_filename'):
            with youtube_dl.YoutubeDL() as ydl:
                info_dict = ydl.extract_info(sys.argv[2], download=False)
                filename = info_dict['title']
                print (filename)
                
        else:
            quality = sys.argv[1]
            link = sys.argv[2:]
            options = setOptions(quality)
            with youtube_dl.YoutubeDL(options) as ydl:
                info_dict = ydl.extract_info(sys.argv[2], download=True)
                ydl.download(link)
                thumb_url = info_dict["thumbnail"]
                title = info_dict['title']
                move(title, thumb_url)