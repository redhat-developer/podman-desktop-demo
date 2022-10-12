#!/bin/bash

# Run of Redis Stack
podman run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest

# Run of HTTPD
podman run -dt -p 8080:80/tcp docker.io/library/httpd

# Run of with Volume
podman run --name nginx-earthly -d -p 8000:80 -v demo-earthly:/usr/share/nginx/html nginx