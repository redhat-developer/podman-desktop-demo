#!/bin/bash

if ! podman network exists podify; then
  podman network create podify
fi

if podman container exists redis; then
  podman rm -f redis
fi
podman run -d -p 6379:6379 --net podify --name redis quay.io/podman-desktop-demo/podify-demo-backend:v1

if podman container exists python-frontend; then
  podman rm -f python-frontend
fi
podman run -d -p 8088:5000 --net podify --name python-frontend quay.io/podman-desktop-demo/podify-demo-frontend:v1
