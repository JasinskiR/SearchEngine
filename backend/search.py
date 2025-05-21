from elastic_config import es, RECIPE_INDEX
from typing import Dict, Any, Optional

def basic_search(query: str):
    """
    Podstawowe wyszukiwanie przepisów po różnych polach z wagami.
    """
    # Specjalny przypadek dla pobierania początkowych przepisów
    if query.lower() == 'popular':
        return es.search(index=RECIPE_INDEX, body={
            "query": {
                "function_score": {
                    "query": {
                        "match_all": {}
                    },
                    "functions": [
                        {
                            "filter": {"exists": {"field": "rating"}},
                            "random_score": {}
                        }
                    ]
                }
            },
            "size": 12
        })
    
    # Standardowe wyszukiwanie
    return es.search(index=RECIPE_INDEX, body={
        "query": {
            "multi_match": {
                "query": query,
                "fields": ["title^3", "description", "ingredients^2", "category", "cousine"],
                "fuzziness": "AUTO"
            }
        },
        "size": 24
    })

def filter_search(filters: Dict[str, str]):
    """
    Wyszukiwanie z filtrowaniem po różnych kryteriach.
    """
    must_filters = []

    # Przetwarzanie filtrów kategorii i kuchni
    for field, value in filters.items():
        if field in ["category", "cousine"] and value:
            must_filters.append({"match": {field: value}})
    
    # Specjalne przetwarzanie dla filtru czasu
    if "maxTime" in filters and filters["maxTime"]:
        # Ekstrahowanie liczby minut z ciągu (np. "30 min" -> 30)
        time_str = filters["maxTime"]
        try:
            minutes = int(''.join(filter(str.isdigit, time_str)))
            # Dodawanie filtru dla całkowitego czasu
            must_filters.append(
                {"range": {"total_time": {"lte": f"{minutes} min"}}}
            )
        except ValueError:
            # Jeśli nie można przekonwertować na liczbę, ignoruj filtr czasu
            pass
    
    # Jeśli brak filtrów, zwróć popularne przepisy
    if not must_filters:
        return es.search(index=RECIPE_INDEX, body={
            "query": {
                "match_all": {}
            },
            "size": 12
        })
    
    # Wyszukiwanie z filtrami
    return es.search(index=RECIPE_INDEX, body={
        "query": {
            "bool": {
                "must": must_filters
            }
        },
        "size": 24
    })

def advanced_search(query: str):
    """
    Zaawansowane wyszukiwanie z wykorzystaniem Elasticsearch Query String.
    Pozwala na użycie operatorów logicznych AND, OR, NOT oraz grupowania.
    """
    return es.search(index=RECIPE_INDEX, body={
        "query": {
            "query_string": {
                "query": query,
                "fields": ["title^3", "description", "ingredients^2", "category", "cousine"],
                "default_operator": "AND"
            }
        },
        "size": 24
    })