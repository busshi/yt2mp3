FROM		node:16

RUN			apt update && apt install -y ffmpeg cron

RUN			wget https://bootstrap.pypa.io/get-pip.py -O /tmp/get-pip.py && python3 /tmp/get-pip.py

RUN			pip3 install youtube-dl

ADD			../crontab /etc/cron.d/hello-cron

RUN			chmod 0644 /etc/cron.d/hello-cron

RUN			touch /var/log/cron.log

CMD			cron

WORKDIR		/usr/app

ENTRYPOINT	[ "/bin/bash", "prod.sh" ]
