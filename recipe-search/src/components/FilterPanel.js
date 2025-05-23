import React from 'react';
import './FilterPanel.css';

export default function FilterPanel({ filters, onFilterChange, onApplyFilters }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onApplyFilters();
  };

  const handleReset = () => {
    onFilterChange({
      category: '',
      cuisine: '',
      maxTime: ''
    });
    onApplyFilters();
  };

  return (
    <div className="filter-panel">
      <h3>Filtry</h3>
      <form onSubmit={handleSubmit}>
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
          <label htmlFor="maxTime">Maksymalny czas:</label>
          <select 
            id="maxTime" 
            name="maxTime" 
            value={filters.maxTime} 
            onChange={handleChange}
          >
            <option value="">Dowolny czas</option>
            <option value="15 min">Do 15 minut</option>
            <option value="30 min">Do 30 minut</option>
            <option value="45 min">Do 45 minut</option>
            <option value="60 min">Do 1 godziny</option>
          </select>
        </div>

        <div className="filter-actions">
          <button type="submit" className="apply-filters-btn">
            Zastosuj filtry
          </button>
          <button type="button" className="reset-filters-btn" onClick={handleReset}>
            Resetuj
          </button>
        </div>
      </form>
      
      <div className="filter-info">
        <h4>Tryb zaawansowany</h4>
        <p>Włącz tryb eksperta w pasku wyszukiwania, aby używać operatorów logicznych.</p>
      </div>
    </div>
  );
}