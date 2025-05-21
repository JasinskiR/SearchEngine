from fastapi import FastAPI, Query
from typing import Optional, Dict
from search import basic_search, filter_search, advanced_search
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/search")
def search_recipes(query: str = Query(...)):
    return basic_search(query)

@app.post("/filter")
def filter_recipes(filters: Dict[str, str]):
    return filter_search(filters)

@app.get("/advanced")
def expert_query(q: str):
    return advanced_search(q)
