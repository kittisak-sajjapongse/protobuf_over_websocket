#!/usr/bin/env bash

set -e

# Check if default profile for awscli exists
if ! aws configure list --profile default; then
    echo "AWS profile configuration not found or invalid. Please configure AWS."
    aws configure
else
    echo "AWS profile 'default' is already configured."
fi
aws s3 sync s3://jojjiw-webgis/images/animals .
