terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "ap-south-1"   # Mumbai (closest to Sri Lanka)
}

# ----------------------------
# 1. Create Security Group
# ----------------------------
resource "aws_security_group" "app_sg" {
  name        = "srilanka_project_sg"
  description = "Allow backend and frontend ports"

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

  ingress {
    from_port   = 22
    to_port     = 22
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

# ----------------------------
# 2. Create EC2 Instance
# ----------------------------
resource "aws_instance" "srilanka_server" {
  ami           = "ami-0a0f1259dd1c90938"   # Ubuntu 22.04
  instance_type = "t2.micro"

  key_name = "mykeypair"  # your AWS key pair

  vpc_security_group_ids = [aws_security_group.app_sg.id]

  # Install Docker + run your containers
  user_data = <<-EOF
    #!/bin/bash
    apt update -y
    apt install docker.io -y
    systemctl start docker
    systemctl enable docker

    docker pull jayashan00/srilanka-backend:latest
    docker pull jayashan00/srilanka-frontend:latest

    docker run -d -p 5000:5000 --name backend jayashan00/srilanka-backend:latest
    docker run -d -p 3001:80 --name frontend jayashan00/srilanka-frontend:latest
  EOF

  tags = {
    Name = "SriLankaTravelProject"
  }
}

output "public_ip" {
  value = aws_instance.srilanka_server.public_ip
}
