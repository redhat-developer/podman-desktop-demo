# syntax=docker/dockerfile:1
FROM registry.access.redhat.com/ubi8/python-38
WORKDIR /code
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
USER root
# RUN yum install -y gcc
# RUN yum install kernel-headers --disableexcludes=all
# RUN apk add --no-cache gcc musl-dev linux-headers
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
EXPOSE 5000
COPY . .
RUN find /code -exec sh -c "chgrp 0 {}; chmod g+rwX {}" \;

# Entrypoint
COPY ./entrypoint.sh /
RUN chmod +x /entrypoint.sh
USER 1001
ENTRYPOINT ["/entrypoint.sh"]
