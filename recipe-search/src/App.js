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
    minRating: ''
  });
  const [resetCounter, setResetCounter] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastQuery, setLastQuery] = useState('popular');
  const [lastMode, setLastMode] = useState('basic');
  const [hasActiveSearch, setHasActiveSearch] = useState(false);
  
  const getActiveFilters = () => {
    return Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v && v !== '')
    );
  };
  
  const fetchInitialRecipes = async () => {
    setLoading(true);
    try {
      const res = await searchRecipes('popular');
      setResults(res.data.hits.hits);
      setHasActiveSearch(false);
    } catch (error) {
      console.error('Error fetching initial recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async (query = lastQuery, mode = lastMode, page = 1, filtersToUse = getActiveFilters()) => {
    setLoading(true);
    try {
      let res;
      if (hasActiveSearch || query !== 'popular') {
        if (mode === 'basic') {
          res = await searchRecipes(query, filtersToUse, page);
        } else if (mode === 'advanced') {
          const cleanQuery = query.startsWith('!') ? query.substring(1) : query;
          res = await advancedSearch(cleanQuery, filtersToUse, page);
        } else {
          res = await searchRecipes(query, filtersToUse, page);
        }
      } else {
        if (Object.keys(filtersToUse).length > 0) {
          res = await filterRecipes(filtersToUse, page);
        } else {
          res = await searchRecipes('popular', {}, page);
        }
      }
      setResults(res.data.hits.hits);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialRecipes();
  }, []);

  useEffect(() => {
    if (selectedRecipe) return;
    performSearch(lastQuery, lastMode, currentPage);
  }, [currentPage]);

  const handleSearch = async (query) => {
    setSelectedRecipe(null);
    setCurrentPage(1);
    setLastQuery(query);
    setLastMode(query.startsWith('!') ? 'advanced' : 'basic');
    setHasActiveSearch(true);
    
    await performSearch(query, query.startsWith('!') ? 'advanced' : 'basic', 1);
  };

  const handleFilterChange = async (newFilters) => {
    setFilters(newFilters);
    setSelectedRecipe(null);
    setCurrentPage(1);
    
    const activeFilters = Object.fromEntries(
      Object.entries(newFilters).filter(([_, v]) => v && v !== '')
    );
    
    await performSearch(lastQuery, lastMode, 1, activeFilters);
  };

  const handleCardClick = (recipe) => {
    setSelectedRecipe(recipe);
    window.scrollTo(0, 0);
  };

  const handleBackClick = () => {
    setSelectedRecipe(null);
  };

  const handleHomeClick = () => {
    setSelectedRecipe(null);
    setFilters({ category: '', cuisine: '', minRating: '' });
    setCurrentPage(1);
    setHasActiveSearch(false);
    setLastQuery('popular');
    setLastMode('basic');
    setResetCounter(c => c + 1);
    fetchInitialRecipes();
  };

  const getResultsHeading = () => {
    if (results.length === 0) {
      return "Nie znaleziono przepisów spełniających kryteria";
    }
    
    const activeFilters = getActiveFilters();
    const hasFilters = Object.keys(activeFilters).length > 0;
    
    if (hasActiveSearch && hasFilters) {
      const displayQuery = lastQuery.startsWith('!') ? lastQuery.substring(1) : lastQuery;
      return `Wyniki wyszukiwania "${displayQuery}" z zastosowanymi filtrami`;
    } else if (hasActiveSearch) {
      const displayQuery = lastQuery.startsWith('!') ? lastQuery.substring(1) : lastQuery;
      return `Wyniki wyszukiwania "${displayQuery}"`;
    } else if (hasFilters) {
      return "Przepisy spełniające wybrane filtry";
    } else {
      return "Popularne przepisy";
    }
  };

  return (
    <div className="recipe-app">
      <header className="app-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={handleHomeClick} className="home-button">
            Strona Główna
          </button>
          <h1>Wyszukiwarka Przepisów</h1>
          <div style={{ width: '150px' }} />
        </div>
        <div className="search-container">
          <SearchBar onSearch={handleSearch} resetTrigger={resetCounter} />
        </div>
      </header>

      <div className="app-content">
        <aside className="filter-sidebar">
          <FilterPanel 
            filters={filters} 
            onFilterChange={handleFilterChange}
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
                    {getResultsHeading()}
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
                  <div className="pagination">
                    {currentPage > 1 && (
                      <button onClick={() => setCurrentPage(currentPage - 1)}>← Poprzednia</button>
                    )}
                    <span style={{ margin: '0 1rem' }}>Strona {currentPage}</span>
                    {results.length === 12 && (
                      <button onClick={() => setCurrentPage(currentPage + 1)}>Następna →</button>
                    )}
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