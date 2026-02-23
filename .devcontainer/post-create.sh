#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

run_npm() {
  if command -v mise >/dev/null 2>&1; then
    mise exec -- npm "$@"
  else
    npm "$@"
  fi
}

cd "$ROOT_DIR"

if command -v mise >/dev/null 2>&1; then
  mise install
fi

echo "==> Installing workspace dependencies"
run_npm install

for example_dir in examples/*; do
  if [ -f "$example_dir/package.json" ]; then
    echo "==> Installing $example_dir dependencies"
    (
      cd "$example_dir"
      run_npm install
    )
  fi
done

cat <<'EOF'

FaasJS examples bootstrap complete.

Try one example:
  cd examples/01-hello-api
  npm run test
  npm run dev

Knex example:
  cd examples/04-knex-crud
  npm run migrate:latest
  npm run dev
EOF
