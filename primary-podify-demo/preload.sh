#bash 
podman run -d -p 6379:6379 --name redis quay.io/centos7/redis-5-centos7
podman run -d -p 8080:5000 --add-host=redis:$(podman inspect redis | jq -r '.[0].NetworkSettings.IPAddress') --name python-app quay.io/slemeur/python-app

