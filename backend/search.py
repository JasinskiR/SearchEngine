from elastic_config import es, RECIPE_INDEX
from typing import Dict, Any

def basic_search(query: str, page: int = 1, page_size: int = 12):
    from_ = (page - 1) * page_size

    # Specjalny przypadek dla pobierania popularnych przepisów
    if query.lower() == 'popular':
        return es.search(index=RECIPE_INDEX, body={
            "query": {
                "function_score": {
                    "query": {"match_all": {}},
                    "functions": [
                        {
                            "filter": {"exists": {"field": "rating"}},
                            "random_score": {}
                        }
                    ]
                }
            },
            "from": from_,
            "size": page_size
        })

    # Standardowe wyszukiwanie
    return es.search(index=RECIPE_INDEX, body={
        "query": {
            "multi_match": {
                "query": query,
                "fields": ["title^3", "description", "ingredients^2", "category", "cuisine"],
                "fuzziness": "AUTO"
            }
        },
        "from": from_,
        "size": page_size
    })

def filter_search(filters: Dict[str, str], page: int = 1, page_size: int = 12):
    from_ = (page - 1) * page_size
    must_filters = []

    for field, value in filters.items():
        if field in ["category", "cuisine"] and value:
            must_filters.append({"match": {field: value}})

    if "maxTime" in filters and filters["maxTime"]:
        try:
            minutes = int(''.join(filter(str.isdigit, filters["maxTime"])))
            must_filters.append(
                {"range": {"total_time": {"lte": f"{minutes} min"}}}
            )
        except ValueError:
            pass

    if not must_filters:
        return es.search(index=RECIPE_INDEX, body={
            "query": {"match_all": {}},
            "from": from_,
            "size": page_size
        })

    return es.search(index=RECIPE_INDEX, body={
        "query": {
            "bool": {
                "must": must_filters
            }
        },
        "from": from_,
        "size": page_size
    })

def advanced_search(query: str, page: int = 1, page_size: int = 12):
    from_ = (page - 1) * page_size

    return es.search(index=RECIPE_INDEX, body={
        "query": {
            "query_string": {
                "query": query,
                "fields": ["title^3", "description", "ingredients^2", "category", "cuisine"],
                "default_operator": "AND"
            }
        },
        "from": from_,
        "size": page_size
    })
