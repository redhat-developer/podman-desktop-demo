#!/bin/bash
POSTGRES_HOST=$(grep postgres /etc/hosts | cut -f 1)
if [ -z "$POSTGRES_HOST" ]
then
      export DB_SERVER="localhost"
else
      export DB_SERVER="$POSTGRES_HOST"
fi
java -jar /home/jboss/app.jar