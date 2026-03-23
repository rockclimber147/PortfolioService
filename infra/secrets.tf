# 1. Generate a random password
resource "random_password" "db_master_password" {
  length           = 20
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?" # Exclude '@' or '"' which can break connection strings
}

# 2. Create the Secret 'Container'
resource "aws_secretsmanager_secret" "db_password" {
  name        = "portfolio/dev/db-password"
  description = "Master password for the Dev RDS instance"
  
  # This allows you to delete and recreate the secret quickly during testing
  recovery_window_in_days = 0 
}

# 3. Store the password in the Secret Container
resource "aws_secretsmanager_secret_version" "db_password_val" {
  secret_id     = aws_secretsmanager_secret.db_password.id
  secret_string = random_password.db_master_password.result
}