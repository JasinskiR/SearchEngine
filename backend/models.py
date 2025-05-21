from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

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

class SearchQuery(BaseModel):
    query: str

class AdvancedQuery(BaseModel):
    q: str

class FilterQuery(BaseModel):
    category: Optional[str] = None
    cousine: Optional[str] = None
    maxTime: Optional[str] = None

class SearchResponse(BaseModel):
    hits: Dict[str, Any]