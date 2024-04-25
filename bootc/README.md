# Pre-requisites

- Mac with Apple Silicon (M1/M2/M3). All of the steps will work on Windows or Intel Macs until you get to the section on 'Testing the Disk Image', and there is a link there to find instructions for other platforms.
- Podman 5.0.1 or later.
- Podman Desktop 1.10.0 or later.
- At least 5Gb of available disk space.
- A good internet connection (over 2.5Gb will be downloaded).

This demo can be done offline. If you will not have internet connectivity later,
run through steps 1-4 now, then start at step 5. Also run step 3 of the 'Testing the Disk Image'
section (installing qemu) if you intend to do that.

## Demo Script

1. Open Podman Desktop.

2. Create a new Rootful Podman Machine. Go to Settings > Resources and click on Create New.

![machine-create](https://github.com/redhat-developer/podman-desktop-demo/blob/main/bootc/assets/machine-create.png)

3. Make sure the rootful option is enabled (should be the default). Scroll down and click Create.

![machine-rootless](https://github.com/redhat-developer/podman-desktop-demo/blob/main/bootc/assets/machine-rootless.png)

4. Install the Bootable Containers Extension. Select Extensions in the left navigation, go to the
Catalog tab, and click on the Install button.

![install](https://github.com/redhat-developer/podman-desktop-demo/blob/main/bootc/assets/install.png)

5. After installation the extension will appear in the left navigation. Click on it.

![installed](https://github.com/redhat-developer/podman-desktop-demo/blob/main/bootc/assets/installed.png)

6. We've now ready to build our first image, but we need something to build!
Click on the button to pull the sample quay.io/bootc-extension/httpd:latest container image.

![pull-httpd](https://github.com/redhat-developer/podman-desktop-demo/blob/main/bootc/assets/pull-httpd.png)

7. This image is 1.5Gb so will take some time. Use this opportunity to explain what bootable container images are:
an entire operating system in a regular container image. This makes them a little bigger than average, but you can
use all your familiar container tools like Podman to build, push, pull, start, stop just like any other container image.

What makes them unique is that you can turn bootable container images into bootable disk images - which can be 
deployed as bootable OSes or run as full virtual machines.

8. Once the image is pulled, the button will change to a link to build the image. Click the button (just opens the Build page).

![build-httpd](https://github.com/redhat-developer/podman-desktop-demo/blob/main/bootc/assets/build-httpd.png)

9. Select the httpd image (should be auto-selected if you don't have any other images).

10. Choose an output folder to create the disk image in, e.g. /Users/deboer/bootc.

11. We can create several types of disk images depending on the intended use, e.g. an ISO would be used to
burn a bootable USB drive, or an AMI to deploy to Amazon. Since we intend to run locally on a Mac, select
the RAW image type.

![build-options](https://github.com/redhat-developer/podman-desktop-demo/blob/main/bootc/assets/build-options.png)

12. Depending on the source container image or manifest, we can also build for different architectures.
In this case it will be preselected based on the httpd image that was pulled for our platform, so we don't
need to (and can't) change it.

13. Scroll down if necessary and click Build.

![build-start](https://github.com/redhat-developer/podman-desktop-demo/blob/main/bootc/assets/build-start.png)

14. The build has started. Click `Go back` to return to the Bootable Containers homepage.

![build-started](https://github.com/redhat-developer/podman-desktop-demo/blob/main/bootc/assets/build-started.png)

15. Building the disk image will take about 2 minutes. Take this opportunity to explain that the
bootc image builder is itself just a container image that runs locally. Go to the Containers tab to
see it running.

![containers-bib](https://github.com/redhat-developer/podman-desktop-demo/blob/main/bootc/assets/containers-bib.png)

16. If we're interested we can watch the logs to view progress. Select the container.

![containers-bib-log](https://github.com/redhat-developer/podman-desktop-demo/blob/main/bootc/assets/containers-bib-log.png)

17. After about 2 minutes, the build will be finished! Click OK.

![success](https://github.com/redhat-developer/podman-desktop-demo/blob/main/bootc/assets/success.png)

18. If you haven't already done so, return to the Bootable Containers homepage. Here you can see the history of
your bootable containers, the details of each build, and open the folder on disk.

![built-images](https://github.com/redhat-developer/podman-desktop-demo/blob/main/bootc/assets/built-images.png)

## Testing the Disk Image

We've built a disk image, but we haven't proven that it actually worked! Depending on the image type you may need
to take different steps or use different tools, but here is how to show the RAW image we built above running as
a virtual machine on a Mac.

Additional information (including tools to use on other OSes) is here:
https://github.com/containers/podman-desktop-extension-bootc/blob/main/docs/vm_guide.md

If you plan to run later in a disconnected environment, run step 2 now.

1. Explain that at the moment we do not have any built-in/one-click tools to test your disk image.
You may want to try [podman-bootc CLI](https://gitlab.com/bootc-org/podman-bootc-cli) for this, but
for this demo we will use qemu.

2. Open a Terminal window.

3. Install qemu.
```
> brew install qemu
```

4. Use curl to show there is nothing running.
```
> curl localhost:8080
```

5. Open a second terminal to start the image. Export the location of your image (just makes the following step easier).
```
> export DISK_IMAGE=/Users/myusername/bootc/image/disk.raw
```

6. Launch the virtual machine.
```
> qemu-system-aarch64 \
    -m 8G \
    -M virt \
    -accel hvf \
    -cpu host \
    -smp 4 \
    -serial mon:stdio \
    -nographic \
    -netdev user,id=usernet,hostfwd=tcp::8080-:80 \
    -device virtio-net,netdev=usernet \
    -drive file=/opt/homebrew/share/qemu/edk2-aarch64-code.fd,format=raw,if=pflash,readonly=on \
    -drive file=$DISK_IMAGE,if=virtio,cache=writethrough,format=raw
```

This will boot the machine.

![qemu-booted](https://github.com/redhat-developer/podman-desktop-demo/blob/main/bootc/assets/qemu-booted.png)

7. Go back to the first terminal and curl again to show the VM is running and responding to requests.
```
> curl localhost:8080
```

8. That's it! To exit the qemu terminal, type `Ctrl+a` then `x`.


## Cleanup to demo again

If you are going to run the demo again you can remove the built disk image
for a cleaner demo:

1. From the Bootable Containers homepage, delete the disk image build.

2. On your local filesystem, remove the 2Gb disk image (images folder or disk.raw).

## Final cleanup

If you are totally finished with bootc, you can also remove the container images.

3. In Podman Desktop, go to the Images tab. Delete the 
quay.io/centos-bootc/bootc-image-builder (850Mb)
and quay.io/bootc-extension/httpd (1.6Gb) images.
