import React, { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSearch = () => onSearch(query);

  return (
    <div className="p-4">
      <input
        className="border p-2 w-80"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Szukaj przepisu..."
      />
      <button className="ml-2 p-2 bg-blue-500 text-white" onClick={handleSearch}>
        Szukaj
      </button>
    </div>
  );
}
