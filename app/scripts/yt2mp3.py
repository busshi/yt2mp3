#!/usr/bin/env python3

import youtube_dl
import sys, os, glob, urllib, shutil
#from youtube_dl.postprocessor.ffmpeg import FFmpegMetadataPP
#import eyed3
#import eyed3.id3
#from get_cover_art import CoverFinder


#def addThumb(filename):
 #   finder = CoverFinder({'verbose': True})
  #  finder.scan_file(filename)
    #finder.scan_folder('/usr/app/public/yt/')


def setOptions(quality):
    if not quality:
        quality = '320'

    return {
            'writethumbnail': True,
            'cachedir': '/tmp/',
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                  'preferredcodec': 'mp3',
                  'preferredquality': quality},{
                'key': 'FFmpegMetadata'},{
                'key': 'EmbedThumbnail'}
        ],
    }

#def updateTag(filename, thumb, artist, title, duration, genre, release_year):
 #   file = eyed3.load(filename)
  #  IMAGES = file.tag.images
   # IMAGES.set(3, open(thumb, 'rb').read(), "img/jpeg", u"cover")

    #file.tag.artist = artist
    #file.tag.title = title
    #file.tag.duration = duration
    #file.tag.genre = genre
    #file.tag.year = release_year
    #file.tag.save(encoding='utf-8', version=eyed3.id3.ID3_V2_4)

#    addThumb(filename)


#def move(thumb_url, artist, title, duration, genre, release_year):
def move(thumb_url, title):
	workdir = os.getcwd()
	print('[+] Moving downloaded file to public/yt/')
	files = glob.glob(workdir + '/*mp3')

	for file in files:
                pos = file.rfind('-')
                tmp = file[:pos] + file[-4:]
                newname = tmp.replace(" (Audio)", "").replace(" (Official Audio)", "").replace(" (Clip Officiel)", "").replace(" (Clip officiel)", "").replace(" (Official Music Video)", "").replace(" (HD)", "").replace(" (HQ)", "").replace("HQ", "").replace(" (Son Officiel)", "").replace("Feat.", "ft.").replace("feat.", "ft.").replace("Ft.", "ft.")
                print ('[+] Renaming file ', file, ' -> ', newname)
                pos2 = newname.rfind('/')
                tmp2 = newname[pos2:]
                print ('[+] Moving file ', newname, ' to /usr/app/public/yt')
                os.rename(file, "/usr/app/public/yt" + tmp2)
             #   print ('[+] Copying file for the cloud...')
               # print (workdir + "/publoc/yt" + tmp2)
                #print (workdir + "/uploads" + tmp2)
            #    shutil.copyfile(workdir + "/public/yt" + tmp2, workdir + '/uploads' + tmp2)
                print ('[+] Downloading thumb: ', '/usr/app/public/thumb{}.jpeg'.format(tmp2[:-4]))
                urllib.request.urlretrieve(thumb_url, 'public/thumb' + tmp2[:-4] + '.jpeg')
#                thumb = '/usr/app/public/thumb{}.jpeg'.format(tmp2[:-4])
#                updateTag('/usr/app/public/yt' + tmp2, '/usr/app/public/thumb{}.jpeg'.format(tmp2[:-4]), artist, title, duration, genre, release_year)

#class FFmpegMP3MetadataPP(FFmpegMetadataPP):

 #   def __init__(self, downloader=None, metadata=None):
  #      self.metadata = metadata or {}
   #     super(FFmpegMP3MetadataPP, self).__init__(downloader)

    #def run(self, information):
     #   information = self.purge_metadata(information)
      #  information.update(self.metadata)
       # return super(FFmpegMP3MetadataPP, self).run(information)

#    def purge_metadata(self, info):
 #       info.pop('title', None)
  #      info.pop('track', None)
   #     info.pop('upload_date', None)
    #    info.pop('description', None)
     #   info.pop('webpage_url', None)
      #  info.pop('track_number', None)
       # info.pop('artist', None)
        #info.pop('creator', None)
        #info.pop('uploader', None)
        #info.pop('uploader_id', None)
        #info.pop('genre', None)
        #info.pop('album', None)
        #info.pop('album_artist', None)
        #info.pop('disc_number', None)
        #return info



if __name__ == "__main__":
    if (len(sys.argv) < 2):
        print ("Usage: ./yt2mp3.py [Encoding Quality] [URL]")
        exit(1)
    else:
        if (sys.argv[1] == 'get_filename'):
            options = setOptions('320')
            with youtube_dl.YoutubeDL(options) as ydl:
                info_dict = ydl.extract_info(sys.argv[2], download=False)
                filename = info_dict.get('title') or self._og_search_title(webpage)
                print (filename)

        else:
            quality = sys.argv[1]
            link = sys.argv[2:]
            options = setOptions(quality)
            with youtube_dl.YoutubeDL(options) as ydl:
                info_dict = ydl.extract_info(sys.argv[2], download=False)
                thumb_url = info_dict.get("thumbnail")
                title = info_dict.get('title') or self._og_search_title(webpage)
                #duration = info_dict.get('duration')
#                release_year = ''
 #               try:
                #release_year = info_dict.get('release_year')
  #              except:
   #                 release_year = '2022'
 #               genre = ''
  #              try:
                #genre = info_dict.get('genre')
   #             except:
    #                genre = 'unknown'
     #           artist = ''
        #        try:
                #artist = info_dict.get('artist')
      #          except:
       #             artist = title

         #       metadata = {
          #          'title': title.replace(" (Clip Officiel)", "").replace(" (Clip officiel)", "").replace(" (HD)", ""),
           #         'artist': artist.replace(" (Clip Officiel)", "").replace(" (Clip officiel)", "").replace(" (HD)", ""),
            #        'upload_date': release_year,
             #       'genre': genre,
              #      'duration': duration,
               # }
#                ffmpeg_mp3_metadata_pp = FFmpegMP3MetadataPP(ydl, metadata)
 #               ydl.add_post_processor(ffmpeg_mp3_metadata_pp)
                ydl.download(link)
                move(thumb_url, title)
    #            move(thumb_url, title, artist, duration, genre, release_year)
