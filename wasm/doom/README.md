# WASM Port of Doom game in browser

This is a port of the [Doom game](https://en.wikipedia.org/wiki/Doom_(1993_video_game)) to the web using [WebAssembly](https://webassembly.org/) and [Rust](https://www.rust-lang.org/).

## Podman Compose

To run the game, you need to have [Podman](https://podman.io/) installed, and the [`podman-compose`](https://github.com/containers/podman-compose) script available (included in Podman Desktop).

### Instructions

When in this directory, run the `podman-compose` command to bring up the container:

```bash
podman-compose up
```

Alternatively, just run the `ghcr.io/trisnol/doom-wasm:main` image directly with Podman.

### Access Doom

Accessing the game is done by opening a browser and going to [http://localhost:8080/](http://localhost:8080/)

## Credits

The code is largely based on [cloudflare/doom-wasm](https://github.com/cloudflare/doom-wasm) & [TrisNol](https://github.com/TrisNol/doom-wasm), and licensed under the [GNU General Public License v2.0](https://github.com/TrisNol/doom-wasm/blob/main/docs/LICENSE.md)