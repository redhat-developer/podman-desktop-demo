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

# UBI Builder
FROM registry.access.redhat.com/ubi9/ubi:9.2-755 AS ubi-builder

# REDIS version to use and the origin
ENV REDIS_VERSION 7.2.1
ENV REDIS_DOWNLOAD_URL http://download.redis.io/releases/redis-${REDIS_VERSION}.tar.gz

# create rootfs directory where to copy the final filesystem
RUN mkdir -p /mnt/rootfs

# install redis
RUN curl -sSL ${REDIS_DOWNLOAD_URL} -o /redis.tar.gz \
    && mkdir -p /usr/src/redis \
    && tar -xzf redis.tar.gz -C /usr/src/redis --strip-components=1 \
    && rm /redis.tar.gz

# install make tools
RUN yum install -y make gcc 

# install runtime tools
RUN yum install --installroot /mnt/rootfs coreutils-single curl shadow-utils \
    --releasever 8 --nodocs -y && \
    yum --installroot /mnt/rootfs clean all && \
    rm -rf /mnt/rootfs/var/cache/* /mnt/rootfs/var/log/dnf* /mnt/rootfs/var/log/yum.*

# use the final root filesystem as default directory
WORKDIR /mnt/rootfs

# apply permissions to later change these files (entrypoint update_extension_vsx_references)
RUN make -C /usr/src/redis -j "$(nproc)" all && make -C /usr/src/redis install

# Display the CLI's version
RUN redis-cli --version && redis-server --version

# Copy redis binaries to the rootfs
RUN cp /usr/local/bin/redis-server /mnt/rootfs/usr/local/bin/redis-server

# Configure quickly redis
RUN echo -e "port 6379\nprotected-mode no\ndir /tmp\nalways-show-logo yes\n" > /mnt/rootfs/etc/redis.conf

# Use scratch image and then copy ubi fs
FROM scratch
COPY --from=ubi-builder /mnt/rootfs/ /
# Create redis user
RUN groupadd -g 1000 redis && useradd -u 1000 -g redis -G root redis
USER 1000
# start the database as entrypoint
ENTRYPOINT ["/usr/local/bin/redis-server", "/etc/redis.conf"]
