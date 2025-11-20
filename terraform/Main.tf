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


# ... (provider block remains the same) ...

# 1. RENAME THE SECURITY GROUP
resource "aws_security_group" "app_sg" {
  name        = "srilanka_project_sg_v3"  # <--- Update this to v3
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

# 2. UPDATE THE INSTANCE TYPE
resource "aws_instance" "srilanka_server" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"              # <--- Change t2.micro to t3.micro

  key_name = "mykeypair"

  vpc_security_group_ids = [aws_security_group.app_sg.id]

  # ... (Keep your user_data and tags exactly the same) ...
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