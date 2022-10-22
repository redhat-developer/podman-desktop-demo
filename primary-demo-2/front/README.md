#### Run the redis from rhel8

```bash
podman run -d -p 6379:6379 --name redis quay.io/centos7/redis-5-centos7
```

### Run the application

#### Build the container

(it is also published and public on quay.io)

```bash
podman build -t quay.io/slemeur/python-app -f ./Dockerfile
```

#### retrieve IP address of redis

```bash
podman inspect redis | jq '.[0].NetworkSettings.IPAddress'
```

#### Run the python app 

Replace the IP address of the redis container `--add-host=redis:{redis-ipaddress}` in the following command

```bash
podman run -d -p 8080:5000 --add-host=redis:10.88.0.8 --name python-app quay.io/slemeur/python-app
```


## Run this application in a Pod

### Prerequisites

**Make sure you are running a podman machine with at least CPU 2 and Memory 4GB.**

### Start Redis in a pod

Here we declare all the ports that we need for the application. It has to be done each time creating a new pod.

```bash
podman run -dt --pod new:python-pod -p 6379:6379 -p 8080:5000 --name redis quay.io/centos7/redis-5-centos7
```

### Start the Python Front App in a pod


#### Add the container of Kaban App to the pod

```bash
podman run -dt --pod python-pod python-app quay.io/slemeur/python-app
```



