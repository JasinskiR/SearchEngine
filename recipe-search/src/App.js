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

  useEffect(() => {
    fetchInitialRecipes();
  }, []);

  useEffect(() => {
    const fetchPage = async () => {
      if (selectedRecipe) return;
      
      setLoading(true);
      try {
        if (hasActiveSearch) {
          if (lastMode === 'basic') {
            const res = await searchRecipes(lastQuery, getActiveFilters(), currentPage);
            setResults(res.data.hits.hits);
          } else if (lastMode === 'advanced') {
            const res = await advancedSearch(lastQuery.substring(1), getActiveFilters(), currentPage);
            setResults(res.data.hits.hits);
          }
        } else {
          const activeFilters = getActiveFilters();
          if (Object.keys(activeFilters).length > 0) {
            const res = await filterRecipes(activeFilters, currentPage);
            setResults(res.data.hits.hits);
          } else {
            const res = await searchRecipes('popular', {}, currentPage);
            setResults(res.data.hits.hits);
          }
        }
      } catch (e) {
        console.error('Page fetch error:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [currentPage, filters]);

  const handleSearch = async (query) => {
    setLoading(true);
    setSelectedRecipe(null);
    setCurrentPage(1);
    setLastQuery(query);
    setLastMode(query.startsWith('!') ? 'advanced' : 'basic');
    setHasActiveSearch(true);

    try {
      const activeFilters = getActiveFilters();
      const res = query.startsWith('!')
        ? await advancedSearch(query.substring(1), activeFilters, 1)
        : await searchRecipes(query, activeFilters, 1);

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
    setCurrentPage(1);

    try {
      if (hasActiveSearch) {
        if (lastMode === 'basic') {
          const res = await searchRecipes(lastQuery, getActiveFilters(), 1);
          setResults(res.data.hits.hits);
        } else if (lastMode === 'advanced') {
          const res = await advancedSearch(lastQuery.substring(1), getActiveFilters(), 1);
          setResults(res.data.hits.hits);
        }
      } else {
        const activeFilters = getActiveFilters();
        if (Object.keys(activeFilters).length > 0) {
          const res = await filterRecipes(activeFilters, 1);
          setResults(res.data.hits.hits);
        } else {
          fetchInitialRecipes();
        }
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

  const handleHomeClick = () => {
    setSelectedRecipe(null);
    setFilters({ category: '', cuisine: '', minRating: '' });
    setCurrentPage(1);
    setHasActiveSearch(false);
    setLastQuery('popular');
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
      return `Wyniki wyszukiwania "${lastQuery}" z zastosowanymi filtrami`;
    } else if (hasActiveSearch) {
      return `Wyniki wyszukiwania "${lastQuery}"`;
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