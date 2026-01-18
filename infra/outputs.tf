output "ecr_repo_url" {
  value = aws_ecr_repository.app.repository_url
}

output "instance_id" {
  value = aws_instance.web.id
}

output "public_ip" {
  value = aws_eip.web.public_ip
}

output "gha_role_arn" {
  value = aws_iam_role.gha_role.arn
}

output "account_id" {
  value = data.aws_caller_identity.me.account_id
}
