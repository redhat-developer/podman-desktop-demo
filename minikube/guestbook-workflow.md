# Guestbook example with the developer workflow

### pre-requisites: working minikube/share images setup
if not, please follow:

1. create a podman machine in rootful mode (should be the default) and add more CPU/memory (it still work with defaults)
2. ensure you don't have any minikube instance (--> `minikube delete` in CLI for example)
3. Ensure you have the minikube extension (if not go to featured extensions and click on install for minikube)
3. Create the k8s cluster in Resources page, with Minikube. Use the following options:
 driver: `podman`
 container-runtime:`cri-o`
 custom base image: `quay.io/fbenoit/kicbase:multiarch-2023-11-06`
 custom mount: `/var/lib/containers:/host-containers`
 
 ### Ensuring kubernetes cluster is working:
 
clone repository https://github.com/kubernetes/examples

Go to guestbook-go folder

edit redis-master-controller.yaml and replace image with only 'redis' if you're using arm64 (probably if you're a macOS user else you'll see a exec error as image is amd64)
edit redis-replica-controller.yaml and replace image with only 'redis' if you're using arm64 (probably if you're a macOS user else you'll see a exec error as image is amd64)
 
build the frontend

`podman build -t my-local-frontend:v1 .`


edit guestbook-controller.yaml and use your local image name (`my-local-frontend:v1`)

create all controllers/services following the README.md

check your pods/controllers/replicas are working fine 
in pods view, all pods are green ?
![image](https://github.com/redhat-developer/podman-desktop-demo/assets/436777/c6ff2bb4-e00e-49b6-aaa6-a7d3a679faa6)



(hint: `kubectl get all --all-namespaces` : all in running mode ? )


now check that you've guestbook service:


```
 kubectl get service                                                                                                                                                       ✔  minikube ⎈
NAME            TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
guestbook       LoadBalancer   10.96.56.171    <pending>     8080:30149/TCP   92m
kubernetes      ClusterIP      10.96.0.1       <none>        443/TCP          123m
redis-master    ClusterIP      10.98.26.62     <none>        6379/TCP         31m
redis-replica   ClusterIP      10.105.10.177   <none>        6379/TCP         30m
```

see the pending external ip for guestbook ?

now run the command `minikube tunnel`

and execute again the `kubectl get service` command

```
NAME            TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
guestbook       LoadBalancer   10.96.56.171    127.0.0.1     8080:30149/TCP   93m
kubernetes      ClusterIP      10.96.0.1       <none>        443/TCP          124m
redis-master    ClusterIP      10.98.26.62     <none>        6379/TCP         32m
redis-replica   ClusterIP      10.105.10.177   <none>        6379/TCP         31m
```

there is now an external IP

On your host, connect to http://localhost:8080

you should see your working guestbook example
