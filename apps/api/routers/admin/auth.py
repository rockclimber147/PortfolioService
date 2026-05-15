from fastapi import APIRouter, Depends, Response, Body
from services import AuthService

router = APIRouter()

@router.post("/login")
async def login(response: Response, api_key: str = Body(..., embed=True)):
    return AuthService.login(response, api_key)

@router.post("/logout")
async def logout(response: Response):
    return AuthService.logout(response)

@router.post("/verify")
async def verify(is_admin: bool = Depends(AuthService.verify_admin)):
    return {"status": "success", "message": "Session is valid"}