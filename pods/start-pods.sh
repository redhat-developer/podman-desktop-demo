#!/bin/bash
# Start Pods

# Create a Simple Pod
podman pod create --name simple-pod

# Create a Pod with Volume
podman pod create --name pod-with-volume -p 8080:8080 -v demo-earthly:/www/html

# Start NGINX Pod from YAML
podman play kube ./pods/httpd-pod.yaml

