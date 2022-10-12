#!/bin/bash
# Populate images

# Redis
podman pull docker.io/library/redis:latest 
# MongoDB
podman pull docker.io/library/mongo:latest
# Quarkus
podman pull quay.io/quarkus/ubi-quarkus-native-s2i:19.3.1-java11
# HTTPD
podman pull docker.io/library/httpd
# Go
podman pull docker.io/library/golang:latest
# Python
podman pull docker.io/library/python:latest

