#!/bin/bash
# Start Pods

# Create a Simple Pod
podman pod create --name simple-pod
podman pod start simple-pod

# Create a Pod with Volume
podman pod create --name pod-with-volume -p 8099:8080 -v demo-earthly:/www/html
podman pod start pod-with-volume

# Start HTTP Pod from YAML
podman play kube ./pods/httpd-pod.yaml

