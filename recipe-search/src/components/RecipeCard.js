import React from 'react';
import './RecipeCard.css';

export default function RecipeCard({ recipe, onClick }) {
  const { title, image, description, cousine, total_time, rating } = recipe._source;
  
  const truncateDescription = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="recipe-card" onClick={() => onClick(recipe)}>
      <div className="recipe-image-container">
        <img src={image} alt={title} className="recipe-image" />
        {rating && (
          <div className="recipe-rating">
            <span className="rating-star">★</span> {rating}
          </div>
        )}
      </div>
      
      <div className="recipe-info">
        <h3 className="recipe-title">{title}</h3>
        
        <div className="recipe-meta">
          {cousine && <span className="recipe-cuisine">{cousine}</span>}
          {total_time && <span className="recipe-time">{total_time}</span>}
        </div>
        
        <p className="recipe-description">{truncateDescription(description)}</p>
        
        <div className="recipe-view-details">
          Zobacz przepis
        </div>
      </div>
    </div>
  );
}