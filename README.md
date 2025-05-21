# SearchEngine
The project is done for university project course Information Retrieval Systems at Wroclaw University of Science and Technology (WUST).\
The main goal of the project is to build a search engine from given list.\
This project will based on elasticsearch engine which will based on receipes dataset from [allrecipes](https://www.allrecipes.com).
### Open virtual env
```bash
python -m venv env
or
python3 -m venv env
```
### Then activate it
```bash
source env/bin/activate
```
### Requirements
Requirements for backend are in [requirements.txt](./backend/requirements.txt) file.\
For frontend (in React) you will need:
```bash
npx create-react-app recipe-search
cd recipe-search
npm install axios
```
### Backend - Swagger
Swagger is available at `http://localhost:8000/docs`

# To build project
Rcommended to manage with docker desktop
```
docker-compose up -d
```