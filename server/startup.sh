#!/bin/bash

mongod --dbpath=mongo &
nodemon -w ./ app.js
