from elastic_config import es, RECIPE_INDEX

def basic_search(query: str):
    return es.search(index=RECIPE_INDEX, body={
        "query": {
            "multi_match": {
                "query": query,
                "fields": ["title^3", "description", "ingredients", "category", "cousine"]
            }
        }
    })

def filter_search(filters: dict):
    must_filters = []

    for field, value in filters.items():
        must_filters.append({"match": {field: value}})

    return es.search(index=RECIPE_INDEX, body={
        "query": {
            "bool": {
                "must": must_filters
            }
        }
    })

def advanced_search(query: str):
    return es.search(index=RECIPE_INDEX, body={
        "query": {
            "query_string": {
                "query": query
            }
        }
    })
