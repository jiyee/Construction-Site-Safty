#!/bin/bash

mongod --dbpath=mongo &
pm2 start ecosystem.json
pm2 logs
#node app.js
