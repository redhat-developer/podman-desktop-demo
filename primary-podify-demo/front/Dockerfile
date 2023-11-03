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

# create rootfs directory where to copy the final filesystem
RUN mkdir -p /mnt/rootfs

# install runtime tools (including python)
RUN yum install --installroot /mnt/rootfs coreutils-single curl shadow-utils \
   findutils python3.11 pip \
    --releasever 8 --nodocs -y && \
    yum --installroot /mnt/rootfs clean all && \
    rm -rf /mnt/rootfs/var/cache/* /mnt/rootfs/var/log/dnf* /mnt/rootfs/var/log/yum.*

# use the final root filesystem as default directory
WORKDIR /mnt/rootfs

COPY ./start.sh /mnt/rootfs
RUN chmod +x /mnt/rootfs/start.sh

FROM scratch as python-builder
COPY --from=ubi-builder /mnt/rootfs/ /
# Create frontend user
RUN groupadd -g 1000 frontend && useradd -u 1000 -g frontend -G root frontend

# Install python dependencies for the app
COPY requirements.txt /app/requirements.txt
RUN pip install -r /app/requirements.txt

# copy the app
COPY app.py /app/app.py
COPY templates /app/templates
COPY static /app/static

RUN find /app -exec sh -c "chgrp 0 {}; chmod g+rwX {}" \;


# Use scratch image and then copy python app fs
FROM scratch
COPY --from=python-builder / /

# expose frontend port
EXPOSE 5000

USER 1000

WORKDIR /app

ENV FLASK_APP=app.py FLASK_RUN_HOST=0.0.0.0

# start flask
ENTRYPOINT ["/start.sh"]
