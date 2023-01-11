#!/bin/bash

# Populate Images
sh ./populate-images.sh

# Start Containers
sh ./run-containers.sh

# Start Pods
sh ./pods/start-pods.sh

# OPTIONNAL docker-compose
# sh ./compose/compose-demo.sh
