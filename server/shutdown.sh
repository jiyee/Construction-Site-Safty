#!/bin/bash

killall -9 mongod 2>/dev/null 1>/dev/null
killall -9 node 2>/dev/null 1>/dev/null

echo 'mongod & node service have shutdown.'
