FROM		node:16

RUN			apt update && apt install -y ffmpeg

RUN			wget https://bootstrap.pypa.io/get-pip.py -O /tmp/get-pip.py && python3 /tmp/get-pip.py

RUN			pip3 install youtube-dl

WORKDIR		/usr/app

ENTRYPOINT	[ "/bin/bash", "prod.sh" ]
