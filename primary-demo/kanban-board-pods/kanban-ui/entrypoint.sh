#!/bin/bash
APP_HOST=$(grep kanban-app /etc/hosts | cut -f 1)
if [ -z "$APP_HOST" ]
then
      export APP_SERVER="localhost"
else
      export APP_SERVER="$APP_HOST"
fi
sed -i "s/{APP_SERVER}/${APP_SERVER}/" ${NGINX_DEFAULT_CONF_PATH}/default.conf
nginx -g "daemon off;"