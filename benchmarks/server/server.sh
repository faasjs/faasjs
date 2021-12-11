#!/usr/bin/env bash

FaasLog=warn node node_modules/.bin/faas server -r server/raw -c &
pid=$!

curl -s http://localhost:3000/ > /dev/null

sleep 2

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

curl -s http://localhost:3000/ > /dev/null

sleep 2

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

curl -s http://localhost:3000/ > /dev/null

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

curl -s http://localhost:3000/ > /dev/null

sleep 2

echo 'Express:'
wrk 'http://localhost:3000/' \
  -d 3 \
  -c 50 \
  -t 8 \
  | grep 'Requests/sec'

kill $pid
