resource "supabase_project" "portfolio" {
  organization_id   = var.supabase_org_id
  name              = "Daylen-Portfolio-Dev"
  database_password = var.db_password
  region            = "ca-central-1"
}

resource "supabase_project" "portfolio_prod" {
  organization_id   = var.supabase_org_id
  name              = "Daylen-Portfolio-Prod"
  database_password = var.db_password
  region            = "ca-central-1"
}