#!/usr/bin/env bash

pid=''

cleanup() {
  if [ -n "$pid" ] && kill -0 "$pid" 2> /dev/null; then
    kill "$pid"
  fi

  pid=''
}

trap cleanup EXIT
trap 'cleanup; exit 130' INT
trap 'cleanup; exit 143' TERM

run_benchmark() {
  local label="$1"
  local server="$2"
  local url="$3"

  node "$server" &
  pid=$!

  curl -s http://localhost:3000/ > /dev/null
  sleep 2

  echo "$label"
  wrk "$url" \
    -d 3 \
    -c 50 \
    -t 8 \
    | grep 'Requests/sec'

  cleanup
}

run_benchmark 'FaasJS:' server/faasjs-server.mjs 'http://localhost:3000/'

echo
run_benchmark 'FaasJS with http plugin:' server/faasjs-server.mjs 'http://localhost:3000/http'

echo
run_benchmark 'FaasJS with defineApi:' server/faasjs-server.mjs 'http://localhost:3000/api'

echo
run_benchmark 'Koa:' server/koa.mjs 'http://localhost:3000/'

echo
run_benchmark 'Express:' server/express.mjs 'http://localhost:3000/'
