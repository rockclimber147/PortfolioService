output "dev_db_host" {
  value = "db.${supabase_project.portfolio.id}.supabase.co"
}

output "prod_db_host" {
  value = "db.${supabase_project.portfolio_prod.id}.supabase.co"
}

output "s3_bucket_dev" {
  value = aws_s3_bucket.portfolio_assets_dev.id
}

output "s3_bucket_prod" {
  value = aws_s3_bucket.portfolio_assets_prod.id
}