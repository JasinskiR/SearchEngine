from pydantic import BaseModel
from typing import List, Optional

class Recipe(BaseModel):
    title: str
    url: str
    image: str
    description: str
    prep_time: str
    cook_time: str
    total_time: str
    servings: str
    ingredients: List[str]
    instructions: List[str]
    rating: Optional[str] = None
    category: Optional[str] = None
    cousine: Optional[str] = None
