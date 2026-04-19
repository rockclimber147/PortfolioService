from fastapi import APIRouter, Depends, HTTPException
from schemas import UploadRequest
from services import StorageService

router = APIRouter()

@router.post("/upload-url")
async def get_upload_url(
    request: UploadRequest,
    storage: StorageService = Depends()
):
    """
    Generates a pre-signed S3 URL for direct-to-bucket uploads.
    """
    data = storage.generate_presigned_upload_url(
        file_name=request.file_name,
        content_type=request.content_type
    )
    
    if not data:
        raise HTTPException(status_code=500, detail="Could not generate upload URL")
        
    return data