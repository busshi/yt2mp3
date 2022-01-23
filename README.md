# yt2mp3

### Description:
A simple web app using NextJS framework to download a mp3 from yt

### Usage:
- ```cd yt2mp3/app && npm run dev``` Run the [app](http://localhost:3000) localy on port 3000 in dev mode
- ```make dev``` Run the [app](http://localhost:3000) inside a docker container
- ```make prod``` Build for deploy, run the [app](http://localhost:4242) inside a docker container
- ```make stop``` Stop containers

### Note:
yt3mp3.py need youtube_dl to work. You can install it with ```pip install youtube_dl```

### Linux/MacOS ARM users:
You need to keep the .babelrc file inside the /app folder in order to build the containers. If you are running on other systems, you can remove the .babelrc file to increase performance (17x using SWC)
