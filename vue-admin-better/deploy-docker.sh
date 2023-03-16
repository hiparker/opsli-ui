#!/bin/bash

npm run build

docker build -t opsli-ui .

docker run --name opsli-ui --restart=always -p 80:80 -v /var/nginx:/var/data -d opsli-ui
