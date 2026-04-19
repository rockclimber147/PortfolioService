# --- DEV BUCKET ---
resource "aws_s3_bucket" "portfolio_assets_dev" {
  bucket = "daylen-portfolio-assets-dev"
  tags   = merge(local.common_tags, { Environment = "Dev" })
}

resource "aws_s3_bucket_ownership_controls" "assets_oc_dev" {
  bucket = aws_s3_bucket.portfolio_assets_dev.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "assets_access_dev" {
  bucket = aws_s3_bucket.portfolio_assets_dev.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_cors_configuration" "assets_cors_dev" {
  bucket = aws_s3_bucket.portfolio_assets_dev.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST", "GET"]
    allowed_origins = [
      "http://localhost:5173"
    ]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

# --- PROD BUCKET ---
resource "aws_s3_bucket" "portfolio_assets_prod" {
  bucket = "daylen-portfolio-assets-prod"
  tags   = merge(local.common_tags, { Environment = "Prod" })
}

resource "aws_s3_bucket_ownership_controls" "assets_oc_prod" {
  bucket = aws_s3_bucket.portfolio_assets_prod.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "assets_access_prod" {
  bucket = aws_s3_bucket.portfolio_assets_prod.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_cors_configuration" "assets_cors_prod" {
  bucket = aws_s3_bucket.portfolio_assets_prod.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST"]
    allowed_origins = ["https://admin.yourdomain.com"] # Replace with your actual Prod Admin URL
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket_policy" "allow_public_read_dev" {
  bucket = aws_s3_bucket.portfolio_assets_dev.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.portfolio_assets_dev.arn}/*"
      },
    ]
  })
  
  # Ensure the public access block is removed before applying the policy
  depends_on = [aws_s3_bucket_public_access_block.assets_access_dev]
}