## Initial Demo: Run the application with 3 different containers

### Step1: Start Postgres container

```bash
podman run --rm -p 5432:5432 -e POSTGRESQL_DATABASE=kanban -e POSTGRESQL_USER=kanban -e POSTGRESQL_PASSWORD=kanban --name postgres quay.io/centos7/postgresql-13-centos7
```

### Step2: Start the backend

#### Discover the IP address of the Postgres container

In order to make sure that the backend can connect to the database, we need to discover the IP address of the Postgres container. We can do it by running the following command:

```bash
podman inspect postgres | jq '.[0].NetworkSettings.IPAddress'
```

#### Run the backend

```bash
podman run --rm --add-host=postgres:10.88.0.2 -p 4000:4000 -e POSTGRES_DB=kanban -e POSTGRES_USER=kanban -e POSTGRES_PASSWORD=kanban --name kanban-app quay.io/slemeur/kanban-app-entrypoint:latest
```

### Step3: Start the frontend

```bash
podman inspect kanban-app | jq '.[0].NetworkSettings.IPAddress'
```

#### Run the frontend

```bash
podman run --rm --add-host=kanban-app:10.88.0.3 -p 5200:8080 --name kanban-ui quay.io/slemeur/kanban-ui-entrypoint:latest
```
