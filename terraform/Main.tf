terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "ap-south-1"   # Mumbai
}

# 1. DYNAMIC AMI LOOKUP (Finds the correct Ubuntu image for Mumbai)
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# 2. SECURITY GROUP (Renamed to v3 to avoid "Duplicate" error)
resource "aws_security_group" "app_sg" {
  name        = "srilanka_project_sg_v4"
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

# 3. EC2 INSTANCE (Using t3.micro for compatibility)
resource "aws_instance" "srilanka_server" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"

  key_name = "mykeypair"

  vpc_security_group_ids = [aws_security_group.app_sg.id]

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