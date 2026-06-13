variable "aws_region" {
  type        = string
  description = "AWS region to deploy resources"
  default     = "us-east-1"
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR block for the VPC"
  default     = "10.0.0.0/16"
}

variable "public_subnet_1_cidr" {
  type        = string
  description = "CIDR block for the first public subnet"
  default     = "10.0.1.0/24"
}

variable "public_subnet_2_cidr" {
  type        = string
  description = "CIDR block for the second public subnet"
  default     = "10.0.2.0/24"
}

variable "ecr_client_repo_name" {
  type        = string
  description = "Name of the Client ECR Repository"
  default     = "my-client-repo"
}

variable "ecr_server_repo_name" {
  type        = string
  description = "Name of the Server ECR Repository"
  default     = "my-server-repo"
}

variable "ecs_cluster_name" {
  type        = string
  description = "Name of the ECS Cluster"
  default     = "my-application-cluster"
}

variable "database_url" {
  type        = string
  description = "The pooled connection string for the Neon database"
  sensitive   = true
}
