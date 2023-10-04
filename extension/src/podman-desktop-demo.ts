/**********************************************************************
 * Copyright (C) 2023 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ***********************************************************************/

import * as extensionApi from '@podman-desktop/api';

export class PodmanDesktopDemo {
  private statusBarItem: extensionApi.StatusBarItem | undefined;

  readonly SETUP_COMMAND = 'podman-desktop-demo.podify-run-containers';

  readonly FRONTEND_IMAGE = 'quay.io/podman-desktop-demo/podify-demo-frontend:v1';
  readonly BACKEND_IMAGE = 'quay.io/podman-desktop-demo/podify-demo-backend:v1';

  private debounceTimeout: NodeJS.Timeout | undefined;

  constructor(private readonly extensionContext: extensionApi.ExtensionContext) {}

  getPodmanConnection(): extensionApi.ContainerProviderConnection {
    // get all engines
    const providerConnections = extensionApi.provider.getContainerConnections();

    // keep only the podman engine
    const podmanConnection = providerConnections.filter(
      providerConnection => providerConnection.connection.type === 'podman',
    );

    // engine running
    if (podmanConnection.length < 1) {
      throw new Error('No podman engine running. Cannot preload images');
    }

    // get the podman engine
    return podmanConnection[0].connection;
  }

  statusInProgress(title: string, titleEnd?: string): () => void {
    if (this.statusBarItem) {
      const currentTitle = this.statusBarItem?.text;
      this.statusBarItem.iconClass = 'fa fa-sync~spin';
      this.statusBarItem.text = title;

      return () => {
        if (this.statusBarItem) {
          this.statusBarItem.iconClass = 'fa fa-check';
          this.statusBarItem.text = titleEnd ? titleEnd : currentTitle;
        }
      };
    }
  }

  async getFrontendImage(): Promise<extensionApi.ImageInfo | undefined> {
    const images = await extensionApi.containerEngine.listImages();
    const frontendImages = images.filter(image => image.RepoTags?.[0] === this.FRONTEND_IMAGE);

    if (frontendImages.length < 1) {
      return undefined;
    }
    return frontendImages[0];
  }

  async getBackendImage(): Promise<extensionApi.ImageInfo | undefined> {
    const images = await extensionApi.containerEngine.listImages();
    const backendImages = images.filter(image => image.RepoTags?.[0] === this.BACKEND_IMAGE);

    if (backendImages.length < 1) {
      return undefined;
    }
    return backendImages[0];
  }

  setStatusMissing(title: string, tooltip?: string): void {
    if (this.statusBarItem) {
      this.statusBarItem.iconClass = 'fa fa-times-circle';
      if (tooltip) {
        this.statusBarItem.tooltip = tooltip;
      }
      this.statusBarItem.text = title;
    }
  }

  async getPodifyNetwork(): Promise<extensionApi.NetworkInspectInfo | undefined> {
    // search if podify network exists
    const networks = await extensionApi.containerEngine.listNetworks();
    const podifyNetwork = networks.filter(network => network.Name === 'podify' && network.engineType === 'podman');

    if (podifyNetwork.length < 1) {
      return undefined;
    }
    return podifyNetwork[0];
  }

  async getFrontendContainer(): Promise<extensionApi.ContainerInfo | undefined> {
    const containers = await extensionApi.containerEngine.listContainers();

    const frontendContainers = containers.filter(
      container =>
        container.Image === this.FRONTEND_IMAGE &&
        container.engineType === 'podman' &&
        container.Names?.[0] === '/python-frontend',
    );
    if (frontendContainers.length < 1) {
      return undefined;
    }
    return frontendContainers[0];
  }

  async getBackendContainer(): Promise<extensionApi.ContainerInfo | undefined> {
    const containers = await extensionApi.containerEngine.listContainers();
    const backendContainers = containers.filter(
      container =>
        container.Image === this.BACKEND_IMAGE &&
        container.engineType === 'podman' &&
        container.Names?.[0] === '/redis',
    );
    if (backendContainers.length < 1) {
      return undefined;
    }
    return backendContainers[0];
  }

  async getBackendContainerPodified(): Promise<extensionApi.ContainerInfo | undefined> {
    const containers = await extensionApi.containerEngine.listContainers();
    const backendContainers = containers.filter(
      container =>
        container.Image === this.BACKEND_IMAGE &&
        container.engineType === 'podman' &&
        container.Names?.[0] === '/redis-podified',
    );
    if (backendContainers.length < 1) {
      return undefined;
    }
    return backendContainers[0];
  }

  async getFrontendContainerPodified(): Promise<extensionApi.ContainerInfo | undefined> {
    const containers = await extensionApi.containerEngine.listContainers();

    const frontendContainers = containers.filter(
      container =>
        container.Image === this.FRONTEND_IMAGE &&
        container.engineType === 'podman' &&
        container.Names?.[0] === '/python-frontend-podified',
    );
    if (frontendContainers.length < 1) {
      return undefined;
    }
    return frontendContainers[0];
  }

  checkCurrentStateInBackground(): void {
    this.checkCurrentState().catch((error: unknown) => {
      console.error('Error while checking current state', error);
    });
  }

  // check the current state of the demo if we are ready or not
  async checkCurrentState(): Promise<void> {
    // backend image exists ?
    const backendImage = await this.getBackendImage();
    if (!backendImage) {
      this.setStatusMissing(
        'Backend image not pulled',
        `The image ${this.BACKEND_IMAGE} is not pulled. Please run the preload command`,
      );
      return;
    }

    const frontendImage = await this.getFrontendImage();
    if (!frontendImage) {
      this.setStatusMissing(
        'Frontend image not pulled',
        `The image ${this.FRONTEND_IMAGE} is not pulled. Please run the preload command`,
      );
      return;
    }

    // network exists ?
    const podifyNetwork = await this.getPodifyNetwork();
    if (!podifyNetwork) {
      this.setStatusMissing(
        'Podify network not created',
        `The network podify is not created. Please run the preload command`,
      );
      return;
    }

    // frontend container exists ?
    const frontendContainer = await this.getFrontendContainer();
    const frontendPodifiedContainer = await this.getFrontendContainerPodified();
    if (!frontendContainer && !frontendPodifiedContainer) {
      this.setStatusMissing(
        'Frontend container does not exists',
        `The frontend container is not found. Please run the preload command`,
      );
      return;
    }
    if (frontendContainer?.State !== 'running' && !frontendPodifiedContainer) {
      this.setStatusMissing(
        'Frontend container is not running',
        `The frontend container is not running. Please run the preload command`,
      );
      return;
    }
    if (frontendPodifiedContainer?.State !== 'running' && frontendContainer?.State !== 'running') {
      this.setStatusMissing('At least one frontend container should be running', `Please run the preload command`);
      return;
    }

    // frontend container exists ?
    const backendContainer = await this.getBackendContainer();
    const backendPodifiedContainer = await this.getBackendContainerPodified();

    if (!backendContainer && !backendPodifiedContainer) {
      this.setStatusMissing(
        'Backend container does not exists',
        `The backend container is not found. Please run the preload command`,
      );
      return;
    } else {
      if (backendContainer?.State !== 'running' && !backendPodifiedContainer) {
        this.setStatusMissing(
          'Backend container is not running',
          `The backend container is not running. Please run the preload command`,
        );
        return;
      }

      if (backendPodifiedContainer?.State !== 'running' && backendContainer?.State !== 'running') {
        this.setStatusMissing('At least one backend container should be running', `Please run the preload command`);
        return;
      }
    }

    // looks like all is good
    if (this.statusBarItem) {
      this.statusBarItem.iconClass = 'fa fa-check';
      this.statusBarItem.text = 'Podify Demo ready';
    }
  }

  init() {
    if (!this.statusBarItem) {
      // create a status bar item
      this.statusBarItem = extensionApi.window.createStatusBarItem(extensionApi.StatusBarAlignLeft, 100);
      this.statusBarItem.text = 'Podify Demo';
      this.statusBarItem.command = this.SETUP_COMMAND;
      this.statusBarItem.show();
      this.extensionContext.subscriptions.push(this.statusBarItem);
    }

    this.checkCurrentStateInBackground();

    // trigger the check on any change
    this.extensionContext.subscriptions.push(
      extensionApi.containerEngine.onEvent(() => {
        // cancel previous timeout
        if (this.debounceTimeout) {
          clearTimeout(this.debounceTimeout);
        }

        // handle it after a while
        this.debounceTimeout = setTimeout(() => {
          this.checkCurrentStateInBackground();
        }, 1000);
      }),
    );

    // register the command to preload images
    this.extensionContext.subscriptions.push(
      extensionApi.commands.registerCommand('podman-desktop-demo.podify-preload', async () => {
        const podmanEngine = this.getPodmanConnection();

        const inProgressEndCallback = this.statusInProgress('Pulling images...');
        try {
          // pull all images
          const promise1 = extensionApi.containerEngine.pullImage(podmanEngine, this.BACKEND_IMAGE, () => {
            console.log('backend image pulled');
          });
          const promise2 = extensionApi.containerEngine.pullImage(podmanEngine, this.FRONTEND_IMAGE, () => {
            console.log('Frontend image pulled');
          });

          await Promise.all([promise1, promise2]);
        } catch (e) {
          await extensionApi.window.showErrorMessage('Images preloaded failed' + String(e));
        } finally {
          inProgressEndCallback();
        }
      }),
    );

    // register the command to run containers images
    this.extensionContext.subscriptions.push(
      extensionApi.commands.registerCommand('podman-desktop-demo.podify-run-containers', async () => {
        try {
          // pull images if not already done
          await extensionApi.commands.executeCommand('podman-desktop-demo.podify-preload');

          const backendImage = await this.getBackendImage();

          if (!backendImage) {
            await extensionApi.window.showErrorMessage('Backend image not found. Cannot run containers');
            return;
          }

          const frontendImage = await this.getFrontendImage();

          if (!frontendImage) {
            await extensionApi.window.showErrorMessage('Frontend image not found. Cannot run containers');
            return;
          }

          // search if podify network exists
          const podifyNetwork = await this.getPodifyNetwork();
          if (!podifyNetwork) {
            // create it
            await extensionApi.containerEngine.createNetwork(this.getPodmanConnection(), { Name: 'podify' });
          }

          // search if frontend container exists
          const frontendContainer = await this.getFrontendContainer();
          if (frontendContainer) {
            // remove it
            await extensionApi.containerEngine.deleteContainer(frontendContainer.engineId, frontendContainer.Id);
          }

          // search if podified frontend container exists
          const frontendPodifiedContainer = await this.getFrontendContainerPodified();
          if (frontendPodifiedContainer) {
            // remove it
            await extensionApi.containerEngine.deleteContainer(
              frontendPodifiedContainer.engineId,
              frontendPodifiedContainer.Id,
            );
          }

          // search if backend container exists
          const backendContainer = await this.getBackendContainer();
          if (backendContainer) {
            // remove it
            await extensionApi.containerEngine.deleteContainer(backendContainer.engineId, backendContainer.Id);
          }

          // search if podified frontend container exists
          const backendPodifiedContainer = await this.getBackendContainerPodified();
          if (backendPodifiedContainer) {
            // remove it
            await extensionApi.containerEngine.deleteContainer(
              backendPodifiedContainer.engineId,
              backendPodifiedContainer.Id,
            );
          }

          // run backend container using podify network
          await extensionApi.containerEngine.createContainer(backendImage.engineId, {
            name: 'redis',
            Image: this.BACKEND_IMAGE,
            HostConfig: {
              PortBindings: {
                '6379/tcp': [
                  {
                    HostPort: '6379',
                  },
                ],
              },
              NetworkMode: 'podify',
            },
          });

          // then the frontend container using podify network
          await extensionApi.containerEngine.createContainer(backendImage.engineId, {
            name: 'python-frontend',
            Image: this.FRONTEND_IMAGE,
            HostConfig: {
              NetworkMode: 'podify',
              PortBindings: {
                '5000/tcp': [
                  {
                    HostPort: '8088',
                  },
                ],
              },
            },
          });
        } catch (error) {
          await extensionApi.window.showErrorMessage('Error while running containers' + String(error));
        }
      }),
    );

    // register the command to clean containers
    this.extensionContext.subscriptions.push(
      extensionApi.commands.registerCommand('podman-desktop-demo.podify-clean-containers', async () => {
        const backendContainer = await this.getBackendContainer();
        if (backendContainer) {
          await extensionApi.containerEngine.deleteContainer(backendContainer.engineId, backendContainer.Id);
        }

        const frontendContainer = await this.getFrontendContainer();
        if (frontendContainer) {
          await extensionApi.containerEngine.deleteContainer(frontendContainer.engineId, frontendContainer.Id);
        }
      }),
    );

    // register the command to clean containers
    this.extensionContext.subscriptions.push(
      extensionApi.commands.registerCommand('podman-desktop-demo.podify-clean-images', async () => {
        const backendImage = await this.getBackendImage();
        if (backendImage) {
          await extensionApi.containerEngine.deleteImage(backendImage.engineId, backendImage.Id);
        }

        const frontendImage = await this.getFrontendImage();
        if (frontendImage) {
          await extensionApi.containerEngine.deleteImage(frontendImage.engineId, frontendImage.Id);
        }
      }),
    );

    // register the command to clean containers
    this.extensionContext.subscriptions.push(
      extensionApi.commands.registerCommand('podman-desktop-demo.log-in-dev-sandbox', async () => {
        await extensionApi.env.openExternal(
          extensionApi.Uri.parse('https://cloud.redhat.com/openshift/token/podman-desktop'),
        );
      }),
    );
  }

  tearDown() {}
}
