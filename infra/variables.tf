variable region {
  type        = string
  default     = "us-east-2"
  description = "AWS Region"
}

variable name {
    type = string
    default = "discussion-app"
}

variable github_org  { type = string }
variable github_repo { type = string }
