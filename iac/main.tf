resource "supabase_project" "portfolio" {
  organization_id   = var.supabase_org_id
  name              = "Daylen-Portfolio-Dev" # Updated display name for clarity
  database_password = var.db_password
  region            = "ca-central-1"
}

resource "supabase_project" "portfolio_prod" {
  organization_id   = var.supabase_org_id
  name              = "Daylen-Portfolio-Prod"
  database_password = var.db_password
  region            = "ca-central-1"
}

output "dev_db_host" {
  value = "db.${supabase_project.portfolio.id}.supabase.co"
}

output "prod_db_host" {
  value = "db.${supabase_project.portfolio_prod.id}.supabase.co"
}