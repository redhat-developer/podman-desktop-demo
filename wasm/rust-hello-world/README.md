# Hello world in Rust

Inspired from https://doc.rust-lang.org/rust-by-example/hello.html
and the C podman hello https://github.com/containers/PodmanHello/blob/main/podman_hello_world.c

It's displaying a Hello World with some ascii art from Máirín Duffy @mairin

In the Containerfile, we build using wasm32-wasi and the target platform of the image is `wasi/wasm`
Then the .wasm binary is copied in a scratch image with architecture `wasi/wasm`



## Build command:

### prerequisites

- A recent podman version (not the v3.x for example on Ubuntu LTS)


### instructions

podman build --platform=wasi/wasm  -t wasm-rust-hello-world .


## Run command

### prerequisites

crun-wasm/wasmedge-rt packages need to be installed in the podman machine/host

# on Windows, this is the default now
# on macOS: need to initialize a podman machine using next channel


### running from the previous build step

podman run wasm-rust-hello-world

### running from quay.io image

podman run --platform wasi/wasm quay.io/podman-desktop-demo/wasm-rust-hello-world
