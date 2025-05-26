from fastapi import FastAPI, Query, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, Dict, Any
from pydantic import BaseModel

from search import basic_search, filter_search, advanced_search
from models import SearchQuery, FilterQuery, AdvancedQuery, SearchResponse
from elastic_config import es, RECIPE_INDEX

app = FastAPI(
    title="Recipe Search API",
    description="API for searching recipes using Elasticsearch",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchWithFiltersRequest(BaseModel):
    query: str
    filters: Optional[Dict[str, str]] = None

@app.get("/")
async def root():
    return {"message": "Recipe Search API is running"}

@app.get("/health")
async def health_check():
    try:
        es_info = es.info()
        return {
            "api_status": "ok",
            "elasticsearch_status": "ok",
            "elasticsearch_version": es_info["version"]["number"]
        }
    except Exception as e:
        return {
            "api_status": "ok",
            "elasticsearch_status": "error",
            "error": str(e)
        }

@app.post("/search", response_model_exclude_none=True)
async def search_recipes_with_filters(request: SearchWithFiltersRequest, page: int = Query(1, ge=1)):
    try:
        filters = request.filters or {}
        active_filters = {k: v for k, v in filters.items() if v is not None and v != ""}
        results = basic_search(request.query, active_filters, page)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during search: {str(e)}")

@app.get("/search", response_model_exclude_none=True)
async def search_recipes(query: str = Query(..., description="Fraza do wyszukania"), page: int = Query(1, ge=1)):
    try:
        results = basic_search(query, None, page)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during search: {str(e)}")

@app.post("/advanced", response_model_exclude_none=True)
async def expert_query_with_filters(request: SearchWithFiltersRequest, page: int = Query(1, ge=1)):
    try:
        filters = request.filters or {}
        active_filters = {k: v for k, v in filters.items() if v is not None and v != ""}
        results = advanced_search(request.query, active_filters, page)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during advanced search: {str(e)}")

@app.get("/advanced", response_model_exclude_none=True)
async def expert_query(q: str = Query(..., description="Zapytanie w formacie Elasticsearch Query String"), page: int = Query(1, ge=1)):
    try:
        results = advanced_search(q, None, page)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during advanced search: {str(e)}")

@app.post("/filter", response_model_exclude_none=True)
async def filter_recipes(filters: FilterQuery, page: int = Query(1, ge=1)):
    try:
        filter_dict = {k: v for k, v in filters.dict().items() if v is not None and v != ""}
        results = filter_search(filter_dict, page)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during filtering: {str(e)}")

@app.get("/categories")
async def get_categories():
    try:
        result = es.search(index=RECIPE_INDEX, body={
            "size": 0,
            "aggs": {
                "categories": {
                    "terms": {
                        "field": "category",
                        "size": 30
                    }
                }
            }
        })
        
        categories = [bucket["key"] for bucket in result["aggregations"]["categories"]["buckets"]]
        return {"categories": categories}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting categories: {str(e)}")

@app.get("/cuisines")
async def get_cuisines():
    try:
        result = es.search(index=RECIPE_INDEX, body={
            "size": 0,
            "aggs": {
                "cuisines": {
                    "terms": {
                        "field": "cuisine",
                        "size": 30
                    }
                }
            }
        })
        
        cuisines = [bucket["key"] for bucket in result["aggregations"]["cuisines"]["buckets"]]
        return {"cuisines": cuisines}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting cuisines: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)