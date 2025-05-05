# Demo Using MINC (MicroShift IN Container)

## Prerequisites

- Install the MINC extension:  
  `ghcr.io/minc-org/minc-extension:next` (for the current development version)
- Install the demo extension:  
  `quay.io/podman-desktop-demo/podman-desktop-extension`
- Clone this demo repository.
- Go to the **Resources** tab and click **Create new...** under the **MicroShift** entry  
  (depending on the configuration, select ports 443 and 80 as local ports).
- Ensure the current Kubernetes namespace is set to `microshift`.
- Check the existing Kubernetes resources:
  - In **Kubernetes > Pods**, ensure no pod from the app is currently running.
  - In **Kubernetes > Services**, remove any service from a previous deployment.
  - In **Ingresses/Routes**, remove the `my-pod` route if it exists.

## Podify / Kubify Demo

### Podify

1. Initialize the frontend and backend containers by clicking on the status bar.
1. Once the status bar displays `Podify Demo ready`, navigate to the **Containers** view.
1. Verify that both containers are running. Click the kebab menu (`⋮`) on `python-frontend` and select **Open Browser**.
1. Pod creation steps:
   - Select the checkboxes for `python-frontend` and `redis`.
   - Click the **Create Pod** button near the container search bar.
   - Uncheck port `6379` for Redis (we don't want to expose it externally).
   - Click **Create Pod**.
   - Open the pod details and click the `↗️` icon to open the browser to the exposed port.

### Kubify

1. Ensure `microshift` is still the selected Kubernetes namespace (check in the bottom-left status bar).
1. In the **Pods** view, click the kebab menu for your pod and select **Deploy to Kubernetes**.
1. Make sure the checkboxes for:
   - **Kubernetes Services**
   - **Create OpenShift Routes**  
   are selected.
1. Click **Deploy**.
1. At the bottom, under **Endpoints**, you should see:  
   `Port 5000 is reachable with route my-pod-8088` — click the link.
1. Confirm in the dialog to open:  
   `https://my-pod-8088-default.apps.127.0.0.1.nip.io`
1. If your MINC configuration uses a different port (not 443), append the port to the URL like `:9443`.
   - To verify the port, open the `microshift` container from the Containers view — it lists the exposed ports.

## Local Mode

1. Go to the **Images** section in the left navigation bar.
1. Click the **Build** button in the top right.
1. Set the **Containerfile path** to:  
   `minc-extension/frontend-test/Containerfile` (from this repository).
1. Keep the default value for **Build context directory**.
1. Enter `my-local-httpd` as the **Image Name**.
1. Click **Build**, and then **Done** once the build completes.
1. Verify that the `my-local-httpd` image appears under **Images** (e.g., `docker.io/my-local-httpd`).
1. Check that the image is available inside MicroShift by running the following in the `microshift` container:
   ```bash
   crictl images | grep my-local
   ```
   in the `microshift` container.
1. Start the container from the image by clicking the ▶️ icon. Keep default options.
1. Verify the app is working by clicking the `↗️` icon to open it in a browser.
1. Convert the running container to a pod:
    - Select the container.
    - Click the **Create Pod** button near the container search.
    - Use `my-custom-image-pod` as the name.
    - Expose only port `8080`.
    - Click **Create Pod**.
1. In the pod’s kebab menu, click **Deploy to Kubernetes**, then click the `nip.io` link.
    - You may need to append `:9443` to the link if that's the configured port.

> 📝 Note: The image is **not** on Docker Hub — it's a **local image**.  
> No step is required to copy or import the image.