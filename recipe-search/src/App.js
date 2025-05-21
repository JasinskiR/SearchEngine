import React, { useState } from 'react';
import { searchRecipes } from './services/api';
import SearchBar from './components/SearchBar';
import RecipeCard from './components/RecipeCard';

function App() {
  const [results, setResults] = useState([]);

  const handleSearch = async (query) => {
    const res = await searchRecipes(query);
    setResults(res.data.hits.hits);
  };

  return (
    <div className="p-6">
      <SearchBar onSearch={handleSearch} />
      <div className="flex flex-wrap gap-4 mt-4">
        {results.map((r, idx) => (
          <RecipeCard key={idx} recipe={r} />
        ))}
      </div>
    </div>
  );
}

export default App;
