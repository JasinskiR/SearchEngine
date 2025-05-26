import React from 'react';
import './FilterPanel.css';

export default function FilterPanel({ filters, onFilterChange, onApplyFilters }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    onFilterChange(newFilters);
    onApplyFilters();
  };

  const handleReset = () => {
    const resetFilters = {
      category: '',
      cuisine: '',
      minRating: ''
    };
    onFilterChange(resetFilters);
    onApplyFilters();
  };

  const hasActiveFilters = Object.values(filters).some(value => value && value !== '');

  return (
    <div className="filter-panel">
      <h3>Filtry</h3>
      <div className="filter-group">
        <label htmlFor="category">Kategoria:</label>
        <select 
          id="category" 
          name="category" 
          value={filters.category} 
          onChange={handleChange}
        >
          <option value="">Wszystkie kategorie</option>
          <option value="Dessert">Desery</option>
          <option value="Dinner">Dania główne</option>
          <option value="Appetizer">Przystawki</option>
          <option value="Soup">Zupy</option>
          <option value="Salad">Sałatki</option>
          <option value="Breakfast">Śniadania</option>
          <option value="Vegetarian">Wegetariańskie</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="cuisine">Kuchnia:</label>
        <select 
          id="cuisine" 
          name="cuisine" 
          value={filters.cuisine} 
          onChange={handleChange}
        >
          <option value="">Wszystkie kuchnie</option>
          <option value="Italian">Włoska</option>
          <option value="French">Francuska</option>
          <option value="Polish">Polska</option>
          <option value="American">Amerykańska</option>
          <option value="Asian">Azjatycka</option>
          <option value="Mexican">Meksykańska</option>
          <option value="Indian">Indyjska</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="minRating">Ocena użytkowników:</label>
        <select 
          id="minRating" 
          name="minRating" 
          value={filters.minRating} 
          onChange={handleChange}
        >
          <option value="">Dowolna</option>
          <option value="3">co najmniej 3.0</option>
          <option value="4">co najmniej 4.0</option>
          <option value="4.5">co najmniej 4.5</option>
        </select>
      </div>

      {hasActiveFilters && (
        <div className="filter-actions">
          <button type="button" className="reset-filters-btn" onClick={handleReset}>
            Wyczyść filtry
          </button>
        </div>
      )}
      
      <div className="filter-info">
        <h4>Jak działają filtry</h4>
        <p>
          Filtry automatycznie zawężają wyniki wyszukiwania. 
          {hasActiveFilters ? ' Aktywne filtry są obecnie zastosowane.' : ' Wybierz filtry aby zawęzić wyniki.'}
        </p>
        <h4>Tryb zaawansowany</h4>
        <p>Włącz tryb eksperta w pasku wyszukiwania, aby używać operatorów logicznych.</p>
      </div>
    </div>
  );
}