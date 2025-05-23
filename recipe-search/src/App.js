import React, { useState, useEffect } from 'react';
import { searchRecipes, filterRecipes, advancedSearch } from './services/api';
import SearchBar from './components/SearchBar';
import RecipeCard from './components/RecipeCard';
import RecipeDetail from './components/RecipeDetail';
import FilterPanel from './components/FilterPanel';
import './App.css';

function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    cuisine: '',
    maxTime: ''
  });
  
  const fetchInitialRecipes = async () => {
    setLoading(true);
    try {
      const res = await searchRecipes('popular');
      setResults(res.data.hits.hits);
    } catch (error) {
      console.error('Error fetching initial recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialRecipes();
  }, []);

  const handleSearch = async (query) => {
    setLoading(true);
    setSelectedRecipe(null);
    
    try {
      let res;
      if (query.startsWith('!')) {
        res = await advancedSearch(query.substring(1));
      } else {
        res = await searchRecipes(query);
      }
      setResults(res.data.hits.hits);
    } catch (error) {
      console.error('Error searching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const applyFilters = async () => {
    setLoading(true);
    setSelectedRecipe(null);
    
    const activeFilters = {};
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        activeFilters[key] = value;
      }
    });
    
    try {
      if (Object.keys(activeFilters).length > 0) {
        const res = await filterRecipes(activeFilters);
        setResults(res.data.hits.hits);
      } else {
        fetchInitialRecipes();
      }
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (recipe) => {
    setSelectedRecipe(recipe);
    window.scrollTo(0, 0);
  };

  const handleBackClick = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="recipe-app">
      <header className="app-header">
        <h1>Wyszukiwarka Przepisów</h1>
        <div className="search-container">
          <SearchBar onSearch={handleSearch} />
        </div>
      </header>
      
      <div className="app-content">
        <aside className="filter-sidebar">
          <FilterPanel 
            filters={filters} 
            onFilterChange={handleFilterChange} 
            onApplyFilters={applyFilters} 
          />
        </aside>
        
        <main className="recipe-content">
          {selectedRecipe ? (
            <RecipeDetail recipe={selectedRecipe} onBack={handleBackClick} />
          ) : (
            <>
              {loading ? (
                <div className="loading">Ładowanie przepisów...</div>
              ) : (
                <>
                  <h2 className="results-heading">
                    {results.length === 0 
                      ? "Nie znaleziono przepisów spełniających kryteria" 
                      : "Znalezione przepisy"}
                  </h2>
                  <div className="recipes-grid">
                    {results.map((recipe, idx) => (
                      <RecipeCard 
                        key={idx} 
                        recipe={recipe} 
                        onClick={() => handleCardClick(recipe)} 
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>
      
      <footer className="app-footer">
        <p>© 2025 Wyszukiwarka Przepisów - Projekt SWI</p>
      </footer>
    </div>
  );
}

export default App;