# This new block tells Terraform to use the 'kreuzwerker/docker' provider
# when it sees the "docker" provider name, and locks it to version 3.0.2.
terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.2"
    }
  }
}

provider "docker" {
  host = "unix:///var/run/docker.sock"
}

# MongoDB container
resource "docker_container" "mongo" {
  name  = "srilanka-mongo"
  image = "mongo:7.0"
  ports {
    internal = 27017
    external = 27017
  }
  env = [
    "MONGO_INITDB_ROOT_USERNAME=admin",
    "MONGO_INITDB_ROOT_PASSWORD=password123",
    "MONGO_INITDB_DATABASE=srilankatravel"
  ]
}

# Backend
resource "docker_image" "backend" {
  name = "project_backend"
  build {
    context    = "../server"
    dockerfile = "Dockerfile"
  }
}

resource "docker_container" "backend" {
  name  = "srilanka-backend"
  image = docker_image.backend.image_id
  ports {
    internal = 5000
    external = 5000
  }
  depends_on = [docker_container.mongo]
}

# Frontend
resource "docker_image" "frontend" {
  name = "project_nginx"
  build {
    context    = ".."
    dockerfile = "Dockerfile"
  }
}

resource "docker_container" "frontend" {
  name  = "srilanka-nginx"
  image = docker_image.frontend.image_id
  ports {
    internal = 80
    external = 3001
  }
  depends_on = [docker_container.backend]
}