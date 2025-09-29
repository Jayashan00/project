#!/bin/sh

# Wait for host and port to become available
wait_for_host_port() {
    local host=$1
    local port=$2
    local max_attempts=30
    local attempt=1

    while ! nc -z $host $port >/dev/null 2>&1; do
        if [ $attempt -ge $max_attempts ]; then
            echo "Host $host:$port never became available"
            exit 1
        fi
        attempt=$((attempt + 1))
        echo "Waiting for $host:$port... (attempt $attempt/$max_attempts)"
        sleep 2
    done
}

# Wait for backend to be ready
wait_for_host_port localhost 5000

# Start Vite dev server
exec npm run dev -- --host 0.0.0.0 --port 3000
