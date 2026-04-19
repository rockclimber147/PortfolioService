import os
import uuid
import boto3
from botocore.config import Config
from botocore.exceptions import ClientError
from typing import Optional, Dict

from envconfig import EnvironmentConfig

class StorageService:
    def __init__(self):
        self.bucket_name = EnvironmentConfig.S3_BUCKET_NAME
        self.region = os.getenv(EnvironmentConfig.AWS_REGION, "us-west-2")
        
        # signature_version='s3v4' is required for newer regions like ca-central-1
        self.s3_client = boto3.client(
            's3',
            region_name=self.region,
            config=Config(signature_version='s3v4')
        )

    def generate_presigned_upload_url(
        self, 
        file_name: str, 
        content_type: str, 
        folder: str = "projects",
        expiration: int = 3600
    ) -> Optional[Dict[str, str]]:
        """
        Generates a signed URL for the frontend to upload a file directly to S3.
        """
        # Create a unique key to prevent collisions: e.g., "projects/a1b2-image.png"
        file_extension = os.path.splitext(file_name)[1]
        object_key = f"{folder}/{uuid.uuid4()}{file_extension}"

        try:
            url = self.s3_client.generate_presigned_url(
                'put_object',
                Params={
                    'Bucket': self.bucket_name,
                    'Key': object_key,
                    'ContentType': content_type
                },
                ExpiresIn=expiration
            )
            
            # The permanent public URL the Client site will use to view the image
            public_url = f"https://{self.bucket_name}.s3.{self.region}.amazonaws.com/{object_key}"
            
            return {
                "upload_url": url,
                "public_url": public_url,
                "object_key": object_key
            }
        except ClientError as e:
            print(f"Error generating presigned URL: {e}")
            return None