# "Podify" using Podman Desktop 
   The purpose of this demo is to show how to convert containers into a Pod and deploy it to a kubernetes cluster.
   This demo is in the format of a podman desktop extension which will provide the setup for performing the "podify" operation by deploying 2 containers.

## Pre-requisites
   - Connect to a Kubernetes cluster using Podman-Desktop

## Installation
   - From Podman Desktop Settings/Extension page, click on Custom Installation 
   ![settings/extensions](./assets/install1.png)

   - Enter `quay.io/podman-desktop-demo/podman-desktop-extension` on the 'Install custom extension from OCI Image' form.
   ![custom_install](./assets/install_custom_extension.png)

   ![successful installation](./assets/install_custom_extension_1.png)

   - The status "Frontend container not running" is displayed in the taskbar on the bottom left.
   ![frontend not running](./assets/frontend_not_ready.png)

   - Click on it, this will pull 2 images for the containers

   - Within a few seconds, the status "Podify Demo Ready" will appear on the status bar.
   ![podify demo ready](./assets/podify_demo_ready.png)

   - Click on "Containers" in the navigation bar.

   - You should see two containers listed: one for the frontend and one for Redis.
   ![containers created](./assets/container_ready.png)

   - Start the containers.

   - Once the containers are started, view the Python frontend container by selecting "Export to Browser."
   ![view on browser](./assets/view_local.png)

   - A webpage is displayed running on localhost.
   ![local webpage](./assets/local_webpage.png)

   - Use these two containers to create a pod
   ![create pod](./assets/create_my_pod1.png)
   ![create pod 1](./assets/create_my_pod.png)

   - Export this pod to the Kubernetes cluster that is connected to the Podman desktop
   ![deploy pod on cluster](./assets/deploy_my_pod_kube.png)
   ![deploy on cluster 1](./assets//deploy_kube1.png)
   ![deploy on cluster 2](./assets/kube_pod_generated.png)

   - View these 2 containers deployed on the cluster.
   ![pod on cluster](./assets/pod_on_cluster.png)

   - Click the route to the frontend pod.
   ![view on cluster](./assets/route.png)

   - View the same webpage but running on the cluster.
   ![webpage on cluster](./assets/web-page-from-cluster-route.png)

   - Stop the containers and delete them from Podman Desktop 


