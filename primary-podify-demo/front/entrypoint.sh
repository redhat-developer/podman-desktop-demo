#!/bin/bash

# use redis hostname if available, otherwise use localhost
if getent hosts redis 1>/dev/null;
then
      export APP_SERVER="redis"
else
      export APP_SERVER="localhost"
fi
echo Using redis host ${APP_SERVER}
sed -i "s/{APP_SERVER}/${APP_SERVER}/" /app/app.py
flask run
