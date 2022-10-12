#!/bin/bash

# Populate Images
sh ./populate-images.sh

# Start Containers
sh ./run-containers.sh

# Start Pods
sh ./pods/start-pods.sh

# OPTION docker-compos
#sh ./compose/compose-demo.sh
