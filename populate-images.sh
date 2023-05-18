#!/bin/bash
# Populate images

# Redis
podman pull docker.io/library/redis:latest 
# MongoDB
podman pull docker.io/library/mongo:latest
# Quarkus
podman pull quay.io/quarkus/ubi-quarkus-native-s2i:19.3.1-java11
# HTTPD
podman pull quay.io/centos7/httpd-24-centos7:centos7
# Go
podman pull docker.io/library/golang:latest
# Python
podman pull quay.io/fedora/python-310

# Java Red Hat
podman pull registry.access.redhat.com/redhat-openjdk-18/openjdk18-openshift:latest


