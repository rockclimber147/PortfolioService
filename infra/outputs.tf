output "rds_endpoint" {
  value = aws_db_instance.dev_db.endpoint
}

output "database_url" {
  value     = "postgresql://dbadmin:${random_password.db_master_password.result}@${aws_db_instance.dev_db.endpoint}/portfolio"
  sensitive = true
}

