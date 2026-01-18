terraform {
  required_version = ">= 1.5.7"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
    tls = { source = "hashicorp/tls", version = "~> 4.0" }
  }
}

provider "aws" { region = var.region }

data "aws_caller_identity" "me" {}
data "aws_region" "current" {}

# --- Default VPC/subnet (simple demo) ---
data "aws_vpc" "default" { default = true }
data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# --- ECR repo (hardened) ---
resource "aws_ecr_repository" "app" {
  name                 = "${var.name}-repo"
  image_tag_mutability = "IMMUTABLE"

  image_scanning_configuration { scan_on_push = true }

  encryption_configuration { encryption_type = "AES256" }
}

resource "aws_ecr_lifecycle_policy" "cleanup" {
  repository = aws_ecr_repository.app.name
  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Expire untagged images after 7 days"
        selection = {
          tagStatus   = "untagged"
          countType   = "sinceImagePushed"
          countUnit   = "days"
          countNumber = 7
        }
        action = { type = "expire" }
      },
      {
        rulePriority = 2
        description  = "Keep last 30 sha- tagged images"
        selection = {
          tagStatus     = "tagged"
          tagPrefixList = ["sha-"]
          countType     = "imageCountMoreThan"
          countNumber   = 30
        }
        action = { type = "expire" }
      }
    ]
  })
}

# --- Security group: only HTTP(S). No SSH. ---
resource "aws_security_group" "web_sg" {
  name   = "${var.name}-web-sg"
  vpc_id = data.aws_vpc.default.id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS (optional if you add TLS termination later)"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# --- IAM for EC2: SSM + ECR pull only ---
resource "aws_iam_role" "ec2_role" {
  name = "${var.name}-ec2-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Action = "sts:AssumeRole",
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ssm_core" {
  role       = aws_iam_role.ec2_role.name
  policy_arn  = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_policy" "ecr_pull" {
  name = "${var.name}-ecr-pull"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid: "ECRAuth",
        Effect: "Allow",
        Action: ["ecr:GetAuthorizationToken"],
        Resource: "*"
      },
      {
        Sid: "ECRPullSpecificRepo",
        Effect: "Allow",
        Action: [
          "ecr:BatchGetImage",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchCheckLayerAvailability",
          "ecr:DescribeImages"
        ],
        Resource: aws_ecr_repository.app.arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "attach_ecr_pull" {
  role      = aws_iam_role.ec2_role.name
  policy_arn = aws_iam_policy.ecr_pull.arn
}

resource "aws_iam_instance_profile" "profile" {
  name = "${var.name}-instance-profile"
  role = aws_iam_role.ec2_role.name
}

# --- Latest Amazon Linux (has SSM agent) ---
data "aws_ami" "al2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
}

# --- User data: install docker + create a deploy script used by SSM ---
locals {
  user_data = <<-EOF
    #!/bin/bash
    set -euo pipefail
    yum update -y
    yum install -y docker
    systemctl enable docker
    systemctl start docker
    usermod -aG docker ec2-user

    cat > /usr/local/bin/app-deploy.sh <<'SCRIPT'
    #!/bin/bash
    set -euo pipefail
    IMAGE_URI="$1"
    REGION="${var.region}"

    echo "Deploying $IMAGE_URI in $REGION"

    aws ecr get-login-password --region "$REGION" \
      | docker login --username AWS --password-stdin "$(echo "$IMAGE_URI" | cut -d/ -f1)"

    docker pull "$IMAGE_URI"

    # Stop old container if running
    docker rm -f app || true

    # Run container on port 80 -> 3000 (adjust if your app listens elsewhere)
    docker run -d --name app --restart=always -p 80:3000 "$IMAGE_URI"

    docker image prune -f || true
    SCRIPT

    chmod +x /usr/local/bin/app-deploy.sh
  EOF
}

resource "aws_instance" "web" {
  ami                    = data.aws_ami.al2023.id
  instance_type          = "t3.micro"
  subnet_id              = data.aws_subnets.default.ids[0]
  vpc_security_group_ids = [aws_security_group.web_sg.id]
  iam_instance_profile   = aws_iam_instance_profile.profile.name
  user_data              = local.user_data

  tags = { Name = "${var.name}-web" }
}

# --- Elastic IP (stable public IP) ---
resource "aws_eip" "web" {
  domain   = "vpc"
  instance = aws_instance.web.id
}

# --- GitHub OIDC provider + role for Actions (push to ECR + SSM deploy) ---
data "tls_certificate" "github" { url = "https://token.actions.githubusercontent.com" }

resource "aws_iam_openid_connect_provider" "github" {
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [data.tls_certificate.github.certificates[0].sha1_fingerprint]
}

resource "aws_iam_role" "gha_role" {
  name = "${var.name}-gha-oidc"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = { Federated = aws_iam_openid_connect_provider.github.arn },
      Action = "sts:AssumeRoleWithWebIdentity",
      Condition = {
        StringEquals = {
          "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
        },
        StringLike = {
          "token.actions.githubusercontent.com:sub" = "repo:${var.github_org}/${var.github_repo}:*"
        }
      }
    }]
  })
}

resource "aws_iam_policy" "gha_policy" {
  name = "${var.name}-gha-policy"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      # push to ECR repo
      {
        Effect = "Allow",
        Action = ["ecr:GetAuthorizationToken"],
        Resource = "*"
      },
      {
        Effect = "Allow",
        Action = [
          "ecr:BatchCheckLayerAvailability",
          "ecr:CompleteLayerUpload",
          "ecr:InitiateLayerUpload",
          "ecr:PutImage",
          "ecr:UploadLayerPart",
          "ecr:BatchGetImage",
          "ecr:DescribeImages"
        ],
        Resource = aws_ecr_repository.app.arn
      },

      # deploy via SSM
      {
        Effect = "Allow",
        Action = [
          "ssm:SendCommand",
          "ssm:GetCommandInvocation"
        ],
        Resource = "*"
      },

      # allow describing instance (optional convenience)
      {
        Effect = "Allow",
        Action = ["ec2:DescribeInstances"],
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "gha_attach" {
  role       = aws_iam_role.gha_role.name
  policy_arn  = aws_iam_policy.gha_policy.arn
}
