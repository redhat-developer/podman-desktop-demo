#!/bin/bash
# Start Pods

# Create a Simple Pod
podman pod create --name simple-pod

# Create a Pod with Volume
podman pod create --name pod-with-volume -p 8000:80 -v demo-earthly:/usr/share/nginx/html

# Start NGINX Pod from YAML
podman play kube nginx-pod.yaml

