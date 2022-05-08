FROM		node:16

RUN			apt update && apt install -y ffmpeg

WORKDIR		/usr/app

COPY        app/ .

RUN			wget https://bootstrap.pypa.io/get-pip.py -O /tmp/get-pip.py && \
			python3 /tmp/get-pip.py && \
#			pip3 install -r requirements.txt
			pip3 install youtube-dl

RUN			mkdir -p /usr/app/public/yt /usr/app/public/thumb

RUN			npm install

ENTRYPOINT	[ "npm", "run", "dev" ]

#ENTRYPOINT [ "/bin/sh", "dev.sh" ]
