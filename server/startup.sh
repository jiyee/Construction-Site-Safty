#!/bin/bash

mongod --dbpath=mongo &
nodemon -w ./ app.js
#pm2 start ecosystem.json
#pm2 logs
#node app.js
