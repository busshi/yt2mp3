#!/usr/bin/env python3

import youtube_dl
import sys, os, shutil, glob

options = {
	'quiet': 'true',
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
		tmp = file[:pos] + file[-4:]
		newname = tmp.replace(" (Clip Officiel)", "")
		print ('[+] Renaming file ', file, ' -> ', newname)
		os.rename(file, newname)
#		os.rename(file, tmp)
#		print ('[+] Moving file ', tmp);
#		shutil.move(tmp, workdir + '/public/yt/')
		print ('[+] Moving file ', newname);
		shutil.move(newname, workdir + '/public/yt/')


if __name__ == "__main__":
    if (len(sys.argv) < 2):
        print ("Usage: ./yt2mp3.py [URL]")
        exit(1)
    else:
        if (sys.argv[1] == 'get_filename'):
            with youtube_dl.YoutubeDL(options) as ydl:
                info_dict = ydl.extract_info(sys.argv[2], download=False)
                print (info_dict['title'])
            
        else:
            link = sys.argv[1:]
            with youtube_dl.YoutubeDL(options) as ydl:
                ydl.download(link)
                move()
#            print("[+] Extracting infos from URL: ", sys.argv[1])
#            info_dict = ydl.extract_info(sys.argv[1], download=False)
 #           print(info_dict['title'])
 #           setOptions(info_dict['title'])

  #      with youtube_dl.YoutubeDL(options) as ydl:
   #         ydl.download(link)
    #        move()
