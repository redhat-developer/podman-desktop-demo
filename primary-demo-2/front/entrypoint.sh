#!/bin/bash
APP_HOST=$(grep redis /etc/hosts | cut -f 1)
if [ -z "$APP_HOST" ]
then
      export APP_SERVER="localhost"
else
      export APP_SERVER="$APP_HOST"
fi
sed -i "s/{APP_SERVER}/${APP_SERVER}/" app.py
flask run