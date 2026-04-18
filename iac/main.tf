resource "supabase_project" "portfolio" {
  organization_id   = var.supabase_org_id # Use the Org Slug here
  name              = "Daylen-Portfolio"
  database_password = var.db_password
  region            = "ca-central-1" # Canada (Central) is best for BC
}

output "supabase_url" {
  value = "https://${supabase_project.portfolio.id}.supabase.co"
}

# Output the DB Host for our connection string
output "db_host" {
  value = "db.${supabase_project.portfolio.id}.supabase.co"
}