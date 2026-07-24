# Copyright (C) 2026 Red Hat, Inc.
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

FROM docker.io/library/golang@sha256:013ebb36af72d90db0175b077ffa6469ecccfe10ba2a2389cbbc4c1010a83b96
WORKDIR /app

# Copy the entire project which includes the public directory, vendoring, etc.
COPY . .

# Build your application
RUN CGO_ENABLED=0 GOOS=linux go build -o /frontend

EXPOSE 8080
CMD ["/frontend"]