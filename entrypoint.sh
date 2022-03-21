#!/bin/bash

cd /opt/scrumblr
redis-server &
node server.js --server:port=8088