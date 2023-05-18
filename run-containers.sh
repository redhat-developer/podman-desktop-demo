#!/bin/bash

# Run of Redis Stack
podman run -d --name redis-stack -p 6380:6379 -p 8001:8001 docker.io/redis/redis-stack:latest

# Run of HTTPD
podman run -dt -p 8082:80/tcp docker.io/library/httpd

# Run of with Volume
podman run --name nginx-earthly -d -p 8003:80 -v demo-earthly:/usr/share/nginx/html docker.io/nginx
