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

# --- NEW: Automatically find the latest Ubuntu 22.04 AMI for this region ---
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical (Official Ubuntu Owner ID)

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}
# -------------------------------------------------------------------------

resource "aws_security_group" "app_sg" {
  # ... (keep your existing Security Group code exactly as it is) ...
  # Make sure the name is "srilanka_project_sg" or whatever you renamed it to
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

resource "aws_instance" "srilanka_server" {
  # --- UPDATED: Use the dynamic ID we found above ---
  ami           = data.aws_ami.ubuntu.id

  # Note: In Mumbai, sometimes t2.micro is unavailable in specific zones.
  # If this fails again, change this to "t3.micro"
  instance_type = "t2.micro"

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