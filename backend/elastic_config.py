from elasticsearch import Elasticsearch
import os

# Pobierz URL Elasticsearch z zmiennej środowiskowej lub użyj domyślnej wartości
es_url = os.environ.get('ELASTICSEARCH_URL', 'http://localhost:9200')
es = Elasticsearch(es_url)

# Nazwa indeksu używana w całym systemie
RECIPE_INDEX = "recipes"