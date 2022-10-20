## Intro

- we start from the following repository: https://github.com/wkrzywiec/kanban-board

## Initial Demo: Run the application with 3 different containers

### Step1: Start Postgres container

```bash
podman run --rm -p 5432:5432 -v kanban-data:/var/lib/postgresql/data -e POSTGRES_DB=kanban -e POSTGRES_USER=kanban -e POSTGRES_PASSWORD=kanban --name kanban-postgres postgres:9.6-alpine
```

TODO: upgrade to a newer version of Postgres

### Step2: Start the backend

#### Build the container for the backend

Build the container from the UI, or use the following command:

```bash
cd kanban-app
podman build -t kanban-app -f ./Dockerfile
```

#### Discover the IP address of the Postgres container

In order to make sure that the backend can connect to the database, we need to discover the IP address of the Postgres container. We can do it by running the following command:

```bash
podman inspect kanban-postgres | jq '.[0].NetworkSettings.IPAddress'
```

#### Run the backend

```bash
podman run --rm -p 8080:8080 -e POSTGRES_DB=kanban -e POSTGRES_USER=kanban -e POSTGRES_PASSWORD=kanban -e DB_SERVER={postgres-ipaddress} --name kanban-app kanban-app
```
replace `{postgres-ipaddress}` with the IP address of the Postgres container

### Step3: Start the frontend

#### Edit the NGNIX configuration to be able to reach out to the backend

First, you need to gather the IP address of the backend container. You can do it by running the following command:

```bash
podman inspect kanban-app | grep '.[0].NetworkSettings.IPAddress'
```

Then, you need to edit the `default.conf` file and replace the URL of the services with the IP address of the backend container. If your backend is running at 10.88.0.14, then you need to replace the following lines:

```bash
server {
    listen 80;
    server_name kanban-ui;
    root /usr/share/nginx/html;
    index index.html index.html;

    location /api/kanbans {
        proxy_pass http://10.88.0.14:8080/api/kanbans;
    }

    location /api/tasks {
        proxy_pass http://10.88.0.14:8080/api/tasks;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

TODO: Make that configurable at run time of the container (so it would be possible to pass the IP address of the backend as an environment variable)

#### Build the container for the frontend

```bash
cd kanban-ui
podman build -t kanban-ui -f ./Dockerfile
```

#### Run the kanban frontend

```bash
podman run --rm -p 4200:80 --name kanban-ui kanban-ui
```

### Step4: Open the application in the browser

Open the following URL in the browser: http://localhost:4200

## Run this application in a Pod

### Prerequisites

**Make sure you are running a podman machine with at least CPU 2 and Memory 4GB.**

### Start PostGreSQL in a pod

Here we declare all the ports that we need for the application. It has to be done before hand. Or in an interactive manner, by each time creating a new pod.

```bash
podman run -dt --pod new:kanban-pod -p 5432:5432 -p 8080:8080 -p 4200:80 -v kanban-data:/var/lib/postgresql/data -e POSTGRES_DB=kanban -e POSTGRES_USER=kanban -e POSTGRES_PASSWORD=kanban --name kanban-postgres postgres:9.6-alpine
```

### Start the Kanban App in a pod

#### Build the image before hand

```bash
podman build -t kanban-app -f ./kanban-app/Dockerfile
```

#### Add the container of Kaban App to the pod

```bash
podman run -dt --pod kanban-pod -e POSTGRES_DB=kanban -e POSTGRES_USER=kanban -e POSTGRES_PASSWORD=kanban -e DB_SERVER=kanban-postgres --name kanban-app kanban-app
```

### Start the Kanban App in a pod

#### Build the image before hand

```bash
podman build -t kanban-ui -f ./kanban-ui/Dockerfile
```

#### Add the container of Kaban App to the pod

```bash
podman run -dt --pod kanban-pod --name kanban-ui kanban-ui
```







