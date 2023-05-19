## Pre-requisites

### Podman Machine
In order to be sure to not run out of resources, we'll use Podman Machine with 4CPU and 10GB memory at least, to run the demo.

### Kind Cluster setup
In order to run the demo, you need to have a Kind cluster running.

You can do so from the UI of Podman Desktop, in the Settings:

![create-kind-cluster](https://github.com/redhat-developer/podman-desktop-demo/blob/main/kind-demo/assets/create-cluster-1.png)

And use the following settings:

![create-kind-cluster-2](https://github.com/redhat-developer/podman-desktop-demo/blob/main/kind-demo/assets/create-cluster-2.png)


## Demo Scenarios

### Play Kubernetes YAML Pod on Kind

Go to Pods and click on the "Play Kubernetes YAML" button.
Select `kind-demo/kind-kttpd-pod.yaml` and hit the button play.
The image is going to get pulled and the pod will start.
It is possible to go into the kind's container, and check the pod status by getting a terminal into the container:

```bash
kubectl get pods
```

![httpd-kind](https://github.com/redhat-developer/podman-desktop-demo/blob/main/kind-demo/assets/httpd-kind.png)

- Show that the pod is running and displayed in the UI


### Deploy Pod from Podman to Kind

- Reuse the "primary-podify-demo".
- Do a push of the image to Kind: From Images, python-app, click on the kebab menu to display the option to push to Kind.

![push-image-to-kind](https://github.com/redhat-developer/podman-desktop-demo/blob/main/kind-demo/assets/push-image-to-kind.png)

- Then back to list of Pods, and click on the "Deploy to Kubernetes" button on "my-pod".

![my-pod-to-kind-1](https://github.com/redhat-developer/podman-desktop-demo/blob/main/kind-demo/assets/my-pod-to-kind-1.png)

- Make sure to create the Ingress

![my-pod-to-kind-2](https://github.com/redhat-developer/podman-desktop-demo/blob/main/kind-demo/assets/my-pod-to-kind-2.png)

- Application should be accessible at localhost:9090


### Deploy Guestbook

Deploy the guestbook application
```bash
sh ./deploy-guestbook.sh
```

Once deployed, you can access to the application at http://localhost:6777
