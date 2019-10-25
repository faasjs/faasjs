#!/usr/bin/env bash

echo
FaasLog=warn yarn faas server -r funcs &
pid=$!

sleep 2

echo 'Server without cache:'
wrk 'http://localhost:3000/' \
  -d 3 \
  -c 50 \
  -t 8 \
  | grep 'Requests/sec' \
  | awk '{ print "  " $2 }'

kill $pid

echo
FaasLog=warn yarn faas server -r funcs -c &
pid=$!

sleep 2

echo 'Server with cache:'
wrk 'http://localhost:3000/' \
  -d 3 \
  -c 50 \
  -t 8 \
  | grep 'Requests/sec' \
  | awk '{ print "  " $2 }'

kill $pid
