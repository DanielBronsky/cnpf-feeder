#!/bin/bash
# Запускает Docker Desktop (если не запущен) и поднимает backend + frontend через compose.

set -e

echo "Checking Docker..."
if docker info >/dev/null 2>&1; then
  echo "Docker is already running."
else
  echo "Starting Docker Desktop..."
  open -a Docker
  echo "Waiting for Docker to be ready (first start can take 1-2 min)..."
  for i in $(seq 1 60); do
    if docker info >/dev/null 2>&1; then
      echo "Docker is ready."
      break
    fi
    printf "."
    sleep 2
  done
  echo ""
  if ! docker info >/dev/null 2>&1; then
    echo "Error: Docker did not start in 2 minutes. Try launching Docker Desktop manually, then run: yarn compose:up"
    exit 1
  fi
fi

cd "$(dirname "$0")/.."
export AUTH_SECRET="${AUTH_SECRET:-change_this_to_a_long_random_string}"
docker compose up --build --force-recreate -d
echo "Done. Frontend: http://localhost:3000 | Backend: http://localhost:4000"
