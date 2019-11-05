#!/usr/bin/env bash

echo
FaasLog=warn node node_modules/.bin/faas server -r server/raw -c &
pid=$!

sleep 2

curl -s http://localhost:3000/ > /dev/null

echo 'FaasJS:'
wrk 'http://localhost:3000/' \
  -d 3 \
  -c 50 \
  -t 8 \
  | grep 'Requests/sec'

kill $pid

echo
FaasLog=warn node node_modules/.bin/faas server -r server/raw -c &
pid=$!

sleep 2

curl -s http://localhost:3000/http > /dev/null

echo 'FaasJS with http plugin:'
wrk 'http://localhost:3000/http' \
  -d 3 \
  -c 50 \
  -t 8 \
  | grep 'Requests/sec'

kill $pid

echo
node server/koa.js &
pid=$!

sleep 2

echo 'Koa:'
wrk 'http://localhost:3000/' \
  -d 3 \
  -c 50 \
  -t 8 \
  | grep 'Requests/sec'

kill $pid

echo
node server/express.js &
pid=$!

sleep 2

echo 'Express:'
wrk 'http://localhost:3000/' \
  -d 3 \
  -c 50 \
  -t 8 \
  | grep 'Requests/sec'

kill $pid
