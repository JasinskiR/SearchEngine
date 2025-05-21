import React, { useState } from 'react';
import './SearchBar.css';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [isExpert, setIsExpert] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (query.trim()) {
      onSearch(isExpert ? `!${query}` : query);
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <div className="search-input-wrapper">
        <input
          className="search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isExpert ? "Wpisz zaawansowane zapytanie..." : "Wyszukaj przepisy..."}
        />
        <button className="search-button" type="submit">
          Szukaj
        </button>
      </div>
      
      <div className="expert-mode">
        <label className="expert-label">
          <input
            type="checkbox"
            checked={isExpert}
            onChange={() => setIsExpert(!isExpert)}
          />
          Tryb eksperta (operatory AND, OR, NOT)
        </label>
        
        {isExpert && (
          <div className="expert-hint">
            Przykład: "kurczak" AND "imbir" NOT "sos sojowy"
          </div>
        )}
      </div>
    </form>
  );
}