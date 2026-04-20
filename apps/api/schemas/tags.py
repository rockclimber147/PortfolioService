from pydantic import BaseModel
from uuid import UUID
from typing import List, Optional

class TagBase(BaseModel):
    name: str
    slug: str
    is_draft: bool = False

class TagCreate(TagBase):
    pass

class TagUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    is_draft: Optional[bool] = None

class TagRead(TagBase):
    id: UUID
