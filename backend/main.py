from fastapi import FastAPI, Query, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, Dict, Any
from pydantic import BaseModel

from search import basic_search, filter_search, advanced_search
from models import SearchQuery, FilterQuery, AdvancedQuery, SearchResponse
from elastic_config import es, RECIPE_INDEX

# Inicjalizacja aplikacji FastAPI
app = FastAPI(
    title="Recipe Search API",
    description="API for searching recipes using Elasticsearch",
    version="1.0.0"
)

# Dodanie middleware CORS do obsługi żądań z frontendu
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Można ograniczyć do konkretnych domen w produkcji
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Główny endpoint API"""
    return {"message": "Recipe Search API is running"}

@app.get("/health")
async def health_check():
    """Endpoint do sprawdzenia stanu API i połączenia z Elasticsearch"""
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

@app.get("/search", response_model_exclude_none=True)
async def search_recipes(query: str = Query(..., description="Fraza do wyszukania")):
    """
    Wyszukiwanie przepisów po frazie.
    Domyślnie przeszukuje tytuły, opisy, składniki i kategorie.
    """
    try:
        results = basic_search(query)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during search: {str(e)}")

@app.post("/filter", response_model_exclude_none=True)
async def filter_recipes(filters: FilterQuery):
    """
    Filtrowanie przepisów po różnych kryteriach:
    - category: kategoria przepisu (np. 'dessert', 'dinner')
    - cuisine: kuchnia (np. 'italian', 'french')
    - maxTime: maksymalny czas przygotowania (np. '30 min')
    """
    try:
        # Konwersja modelu Pydantic na słownik i usunięcie pustych wartości
        filter_dict = {k: v for k, v in filters.dict().items() if v is not None and v != ""}
        results = filter_search(filter_dict)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during filtering: {str(e)}")

@app.get("/advanced", response_model_exclude_none=True)
async def expert_query(q: str = Query(..., description="Zapytanie w formacie Elasticsearch Query String")):
    """
    Zaawansowane wyszukiwanie z użyciem składni Elasticsearch Query String.
    Pozwala na użycie operatorów AND, OR, NOT, nawiasów itp.
    
    Przykłady:
    - kurczak AND imbir
    - "sos sojowy" OR "sos ostrygowy"
    - (włoska OR francuska) AND makaron NOT "sos pomidorowy"
    """
    try:
        results = advanced_search(q)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during advanced search: {str(e)}")

@app.get("/categories")
async def get_categories():
    """Pobieranie dostępnych kategorii przepisów"""
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
    """Pobieranie dostępnych typów kuchni"""
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