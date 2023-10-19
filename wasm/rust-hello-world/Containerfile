#
# Copyright (C) 2023 Red Hat, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# SPDX-License-Identifier: Apache-2.0

# Build using the host platform (and not target platform wasi/wasm)
FROM --platform=$BUILDPLATFORM docker.io/redhat/ubi9-minimal as builder

# install rust and wasm/wasi target
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y \
    && source "$HOME/.cargo/env" && rustup target add wasm32-wasi

# copy source code
COPY Cargo.toml /app/
COPY src /app/src 

# change working directory
WORKDIR /app

# Build
RUN source "$HOME/.cargo/env" && cd /app && cargo build --target wasm32-wasi --release

# now copy the wasm binary and flag it as the entrypoint
FROM scratch
ENTRYPOINT [ "/rust-hello-world.wasm" ]
COPY --from=builder /app/target/wasm32-wasi/release/rust-hello.wasm /rust-hello-world.wasm
