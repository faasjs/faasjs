#!/usr/bin/env bash

FaasLog=error tsx node_modules/.bin/faas server -r server/raw &
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
FaasLog=error tsx node_modules/.bin/faas server -r server/raw &
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
node server/koa.cjs &
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
node server/express.cjs &
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
