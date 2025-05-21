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
      cousine: '',
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
            <option value="dessert">Desery</option>
            <option value="main course">Dania główne</option>
            <option value="appetizer">Przystawki</option>
            <option value="soup">Zupy</option>
            <option value="salad">Sałatki</option>
            <option value="breakfast">Śniadania</option>
            <option value="vegetarian">Wegetariańskie</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="cousine">Kuchnia:</label>
          <select 
            id="cousine" 
            name="cousine" 
            value={filters.cousine} 
            onChange={handleChange}
          >
            <option value="">Wszystkie kuchnie</option>
            <option value="italian">Włoska</option>
            <option value="french">Francuska</option>
            <option value="polish">Polska</option>
            <option value="american">Amerykańska</option>
            <option value="asian">Azjatycka</option>
            <option value="mexican">Meksykańska</option>
            <option value="indian">Indyjska</option>
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