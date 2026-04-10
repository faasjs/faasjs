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

for template_dir in templates/*; do
  if [ -f "$template_dir/package.json" ]; then
    echo "==> Installing $template_dir dependencies"
    (
      cd "$template_dir"
      run_npm install
    )
  fi
done

cat <<'EOF'

FaasJS templates bootstrap complete.

Try one template:
  cd templates/hello-api
  vp test
  vp run dev

React template:
  cd templates/react-client
  vp run build
  vp run start
EOF
