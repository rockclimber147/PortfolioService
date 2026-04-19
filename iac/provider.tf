terraform {
  required_providers {
    supabase = {
      source  = "supabase/supabase"
      version = "~> 1.0"
    }
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "supabase" {
  access_token = var.supabase_access_token
}

provider "aws" {
  region = "us-west-2"
}