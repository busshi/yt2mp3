#!/bin/sh

mkdir -p /usr/app/public/yt
mkdir -p /usr/app/public/thumb

cd /usr/app

npm install

npm run dev

