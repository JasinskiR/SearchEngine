import json
import os
import time
from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk
from elastic_transport import ConnectionError

# Connect to Elasticsearch
# Use environment variable or fallback to localhost
es_url = os.environ.get('ELASTICSEARCH_URL', 'http://localhost:9200')

# Initialize connection with retry logic
max_retries = 5
retry_delay = 5  # seconds

for attempt in range(max_retries):
    try:
        print(f"Attempting to connect to Elasticsearch at {es_url} (attempt {attempt+1}/{max_retries})")
        es = Elasticsearch(es_url)
        # Test connection
        es.info()
        print("Successfully connected to Elasticsearch")
        break
    except ConnectionError as e:
        if attempt < max_retries - 1:
            print(f"Connection failed. Retrying in {retry_delay} seconds...")
            time.sleep(retry_delay)
        else:
            print("Max retries reached. Could not connect to Elasticsearch.")
            raise e

# Define index name and mapping
INDEX_NAME = "recipes"

# Change the mapping to match the actual data structure
mapping = {
    "mappings": {
        "properties": {
            "title": {"type": "text", "analyzer": "english"},
            "url": {"type": "keyword"},
            "image": {"type": "keyword"},
            "description": {"type": "text", "analyzer": "english"},
            "prep_time": {"type": "text"},  # Changed to text
            "cook_time": {"type": "text"},  # Changed to text
            "total_time": {"type": "text"}, # Changed to text
            "servings": {"type": "text"},   # Changed to text
            "ingredients": {"type": "text", "analyzer": "english"},
            "instructions": {"type": "text", "analyzer": "english"},
            "rating": {"type": "text"},
            "category": {"type": "keyword"},
            "cousine": {"type": "keyword"}
        }
    }
}

# Create index with mapping
if not es.indices.exists(index=INDEX_NAME):
    es.indices.create(index=INDEX_NAME, body=mapping)
    print(f"Created index: {INDEX_NAME}")

# Load the JSON data
def load_recipes(json_file_path):
    with open(json_file_path, 'r') as file:
        recipes = json.load(file)
    
    # Prepare bulk actions
    actions = []
    for i, recipe in enumerate(recipes):
        # Transform data to match mapping
        transformed_recipe = recipe.copy()
        
        # Try to convert string fields to numbers when possible
        for field in ['prep_time', 'cook_time', 'total_time', 'servings']:
            if field in transformed_recipe and isinstance(transformed_recipe[field], str):
                try:
                    # Extract numbers from strings like "30 minutes"
                    num = ''.join(c for c in transformed_recipe[field] if c.isdigit())
                    if num:
                        transformed_recipe[field] = int(num)
                except (ValueError, TypeError):
                    # If conversion fails, keep as string but update mapping
                    pass
        
        action = {
            "_index": INDEX_NAME,
            "_id": i,
            "_source": transformed_recipe
        }
        actions.append(action)
    
    # Perform bulk indexing with detailed error handling
    try:
        success, failed = bulk(es, actions)
        print(f"Indexed {success} recipes")
    except elasticsearch.helpers.BulkIndexError as e:
        print(f"Failed to index {len(e.errors)} documents")
        for i, error in enumerate(e.errors):
            if i < 5:  # Print first 5 errors for debugging
                print(f"Error {i+1}: {error}")
        raise

if __name__ == "__main__":
    # Path to your JSON file
    json_file_path = "recipes.json"
    load_recipes(json_file_path)