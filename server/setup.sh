#!/usr/bin/env bash

# Fetch images from an AWS bucket and copy to build folder
cd images; ./fetch_images.sh
cd ..; cp images/*.jpg build

# Generate self-signed certificates for secure websocket and copy to build folder
cd certs; ./generate.sh
cd ..; cp certs/server.* build

npm install
npm run proto
npm run build