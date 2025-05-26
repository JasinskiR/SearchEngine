from elastic_config import es, RECIPE_INDEX
from typing import Dict, Any, Optional

def basic_search(query: str, filters: Dict[str, str] = None, page: int = 1, page_size: int = 12):
    from_ = (page - 1) * page_size
    
    if query.lower() == 'popular':
        base_query = {
            "function_score": {
                "query": {"match_all": {}},
                "functions": [
                    {
                        "filter": {"exists": {"field": "rating"}},
                        "random_score": {}
                    }
                ]
            }
        }
    else:
        base_query = {
            "multi_match": {
                "query": query,
                "fields": ["title^3", "description", "ingredients^2", "category", "cuisine"],
                "fuzziness": "AUTO"
            }
        }
    
    must_filters = []
    if filters:
        for field, value in filters.items():
            if field in ["category", "cuisine"] and value:
                must_filters.append({"match": {field: value}})
            elif field == "minRating" and value:
                try:
                    rating_value = float(value)
                    must_filters.append(
                        {"range": {"ratings": {"gte": rating_value}}}
                    )
                except ValueError:
                    pass
    
    if must_filters:
        final_query = {
            "bool": {
                "must": [base_query],
                "filter": must_filters
            }
        }
    else:
        final_query = base_query
    
    result = es.search(index=RECIPE_INDEX, body={
        "query": final_query,
        "from": from_,
        "size": page_size
    })
    
    return {
        "hits": result["hits"],
        "total_results": result["hits"]["total"]["value"] if isinstance(result["hits"]["total"], dict) else result["hits"]["total"]
    }

def advanced_search(query: str, filters: Dict[str, str] = None, page: int = 1, page_size: int = 12):
    from_ = (page - 1) * page_size
    
    base_query = {
        "query_string": {
            "query": query,
            "fields": ["title^3", "description", "ingredients^2", "category", "cuisine"],
            "default_operator": "AND"
        }
    }
    
    must_filters = []
    if filters:
        for field, value in filters.items():
            if field in ["category", "cuisine"] and value:
                must_filters.append({"match": {field: value}})
            elif field == "minRating" and value:
                try:
                    rating_value = float(value)
                    must_filters.append(
                        {"range": {"ratings": {"gte": rating_value}}}
                    )
                except ValueError:
                    pass
    
    if must_filters:
        final_query = {
            "bool": {
                "must": [base_query],
                "filter": must_filters
            }
        }
    else:
        final_query = base_query
    
    result = es.search(index=RECIPE_INDEX, body={
        "query": final_query,
        "from": from_,
        "size": page_size
    })
    
    return {
        "hits": result["hits"],
        "total_results": result["hits"]["total"]["value"] if isinstance(result["hits"]["total"], dict) else result["hits"]["total"]
    }

def filter_search(filters: Dict[str, str], page: int = 1, page_size: int = 12):
    from_ = (page - 1) * page_size
    must_filters = []

    for field, value in filters.items():
        if field in ["category", "cuisine"] and value:
            must_filters.append({"match": {field: value}})
        elif field == "minRating" and value:
            try:
                rating_value = float(value)
                must_filters.append(
                    {"range": {"ratings": {"gte": rating_value}}}
                )
            except ValueError:
                pass

    if not must_filters:
        result = es.search(index=RECIPE_INDEX, body={
            "query": {"match_all": {}},
            "from": from_,
            "size": page_size
        })
    else:
        result = es.search(index=RECIPE_INDEX, body={
            "query": {
                "bool": {
                    "must": must_filters
                }
            },
            "from": from_,
            "size": page_size
        })
    
    return {
        "hits": result["hits"],
        "total_results": result["hits"]["total"]["value"] if isinstance(result["hits"]["total"], dict) else result["hits"]["total"]
    }