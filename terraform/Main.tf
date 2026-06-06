terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "ap-south-1"
}


data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# ------------------ SECURITY GROUP ------------------
resource "aws_security_group" "app_sg" {
  name        = "srilanka_project_sg_v14 "
  description = "Allow SSH, Backend, Frontend"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3001
    to_port     = 3001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ------------------ EC2 ------------------
resource "aws_instance" "srilanka_server" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"
  key_name      = "project-key-2025"

  vpc_security_group_ids = [aws_security_group.app_sg.id]

  user_data = <<-EOF
    #!/bin/bash
    set -e

    apt update -y
    apt install -y docker.io
    systemctl start docker
    systemctl enable docker
    usermod -aG docker ubuntu

    sleep 15

    docker network create app-network || true

    docker run -d \
      --name mongo_db \
      --network app-network \
      mongo:latest

    docker pull jayashan00/srilanka-backend:latest
    docker run -d \
      --name backend \
      --network app-network \
      -p 5000:5000 \
      -e MONGODB_URI=mongodb://mongo_db:27017/travel \
      jayashan00/srilanka-backend:latest

    docker pull jayashan00/srilanka-frontend:latest
    docker run -d \
      --name frontend \
      -p 3001:80 \
      jayashan00/srilanka-frontend:latest
  EOF

  tags = {
    Name = "SriLankaTravelProject"
  }
}

output "public_ip" {
  value = aws_instance.srilanka_server.public_ip
}
