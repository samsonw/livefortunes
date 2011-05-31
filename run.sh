#!/bin/bash

LF_ROOT="/home/samson/code/livefortunes"
exec /usr/local/bin/node $LF_ROOT/server.js 2>&1>> $LF_ROOT/log/server.log
