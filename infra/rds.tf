resource "aws_security_group" "rds_sg" {
  name   = "portfolio-rds-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    description = "PostgreSQL from configured CIDR"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = [var.developer_ingress_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "portfolio-rds-sg" }
}

resource "aws_db_instance" "dev_db" {
  allocated_storage    = 20
  db_name              = "portfolio"
  engine               = "postgres"
  engine_version       = "16"
  instance_class       = "db.t3.micro"
  username             = "dbadmin"
  password             = random_password.db_master_password.result
  parameter_group_name = "default.postgres16"
  apply_immediately    = true

  db_subnet_group_name   = aws_db_subnet_group.default.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  publicly_accessible      = true
  skip_final_snapshot      = true

  depends_on = [
    aws_route_table_association.public_a,
    aws_route_table_association.public_b,
    aws_secretsmanager_secret_version.db_password_val,
  ]
}
