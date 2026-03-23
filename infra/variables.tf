variable "developer_ingress_cidr" {
  description = "IPv4 CIDR allowed to reach RDS on port 5432 (use your public IP as /32, e.g. 203.0.113.50/32). Update when your ISP changes your address."
  type        = string

  validation {
    condition     = can(cidrhost(var.developer_ingress_cidr, 0))
    error_message = "developer_ingress_cidr must be a valid IPv4 CIDR (e.g. 198.51.100.7/32)."
  }
}
