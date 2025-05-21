import json
import os
import time
from elasticsearch import Elasticsearch, helpers
from elasticsearch.exceptions import ConnectionError

# Importuj konfigurację Elasticsearch
from elastic_config import es, RECIPE_INDEX

# Definicja mappingu indeksu
def create_index_mapping():
    """Tworzy mapping dla indeksu recipes"""
    mapping = {
        "mappings": {
            "properties": {
                "title": {"type": "text", "analyzer": "english", "fields": {"keyword": {"type": "keyword"}}},
                "url": {"type": "keyword"},
                "image": {"type": "keyword"},
                "description": {"type": "text", "analyzer": "english"},
                "prep_time": {"type": "text"},
                "cook_time": {"type": "text"},
                "total_time": {"type": "text"},
                "servings": {"type": "text"},
                "ingredients": {"type": "text", "analyzer": "english"},
                "instructions": {"type": "text", "analyzer": "english"},
                "rating": {"type": "text", "fields": {"float": {"type": "float", "null_value": 0}}},
                "category": {"type": "keyword"},
                "cousine": {"type": "keyword"}
            }
        },
        "settings": {
            "index": {
                "number_of_shards": 1,
                "number_of_replicas": 0
            },
            "analysis": {
                "analyzer": {
                    "ingredient_analyzer": {
                        "type": "custom",
                        "tokenizer": "standard",
                        "filter": ["lowercase", "stop"]
                    }
                }
            }
        }
    }
    
    # Utwórz indeks z mappingiem
    if not es.indices.exists(index=RECIPE_INDEX):
        es.indices.create(index=RECIPE_INDEX, body=mapping)
        print(f"Created index: {RECIPE_INDEX}")
    else:
        print(f"Index {RECIPE_INDEX} already exists")

def load_recipes(json_file_path: str):
    """Ładuje przepisy z pliku JSON do indeksu Elasticsearch"""
    try:
        # Otwarcie pliku JSON
        with open(json_file_path, 'r', encoding='utf-8') as file:
            recipes = json.load(file)
        
        # Przygotowanie akcji dla bulk indexing
        actions = []
        for i, recipe in enumerate(recipes):
            # Przekształć dane zgodnie z mappingiem
            transformed_recipe = recipe.copy()
            
            # Zapewnij, że każdy przepis ma wymagane pola
            for required_field in ["title", "image", "url", "description"]:
                if required_field not in transformed_recipe or not transformed_recipe[required_field]:
                    transformed_recipe[required_field] = f"No {required_field} available"
            
            # Zapewnij, że listy są prawidłowe
            for list_field in ["ingredients", "instructions"]:
                if list_field not in transformed_recipe or not transformed_recipe[list_field]:
                    transformed_recipe[list_field] = []
                elif isinstance(transformed_recipe[list_field], str):
                    # Jeśli jest stringiem, przekształć na listę jednoelement
                    transformed_recipe[list_field] = [transformed_recipe[list_field]]
            
            # Dodaj akcję do operacji masowej
            action = {
                "_index": RECIPE_INDEX,
                "_id": i,
                "_source": transformed_recipe
            }
            actions.append(action)
        
        # Wykonaj operacje masowego indeksowania
        success, errors = helpers.bulk(es, actions, stats_only=False)
        print(f"Successfully indexed {success} recipes")
        
        if errors:
            print(f"Errors during indexing: {len(errors)}")
            for error in errors[:5]:  # Wypisz pierwsze 5 błędów
                print(f"Error: {error}")
    
    except FileNotFoundError:
        print(f"File not found: {json_file_path}")
    except json.JSONDecodeError:
        print(f"Invalid JSON format in file: {json_file_path}")
    except Exception as e:
        print(f"Error loading recipes: {str(e)}")

def wait_for_elasticsearch(max_retries=5, retry_delay=5):
    """Poczekaj, aż Elasticsearch będzie dostępny"""
    for attempt in range(max_retries):
        try:
            print(f"Próba połączenia z Elasticsearch (próba {attempt+1}/{max_retries})")
            es.info()
            print("Połączono z Elasticsearch!")
            return True
        except ConnectionError as e:
            if attempt < max_retries - 1:
                print(f"Połączenie nieudane. Ponowna próba za {retry_delay} sekund...")
                time.sleep(retry_delay)
            else:
                print("Osiągnięto maksymalną liczbę prób. Nie można połączyć z Elasticsearch.")
                raise e
    return False

if __name__ == "__main__":
    # Poczekaj na dostępność Elasticsearch
    wait_for_elasticsearch()
    
    # Stwórz mapping dla indeksu
    create_index_mapping()
    
    # Ścieżka do pliku JSON
    json_file_path = os.environ.get('RECIPES_JSON_PATH', 'recipes.json')
    
    # Załaduj przepisy do indeksu
    load_recipes(json_file_path)