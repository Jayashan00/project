#!/bin/sh
set -e

# Check if the development server is responding
nc -z localhost 3000 || exit 1
