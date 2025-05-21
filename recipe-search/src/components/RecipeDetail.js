import React from 'react';
import './RecipeDetail.css';

export default function RecipeDetail({ recipe, onBack }) {
  const {
    title,
    image,
    description,
    prep_time,
    cook_time,
    total_time,
    servings,
    ingredients,
    instructions,
    rating,
    category,
    cousine,
    url
  } = recipe._source;

  return (
    <div className="recipe-detail">
      <div className="recipe-detail-header">
        <button className="back-button" onClick={onBack}>
          ← Powrót do wyników
        </button>
        
        <h1 className="recipe-detail-title">{title}</h1>
        
        <div className="recipe-detail-meta">
          {rating && (
            <div className="recipe-detail-rating">
              <span className="detail-rating-star">★</span> {rating}
            </div>
          )}
          
          {category && <div className="recipe-detail-category">{category}</div>}
          
          {cousine && <div className="recipe-detail-cuisine">{cousine}</div>}
        </div>
      </div>
      
      <div className="recipe-detail-content">
        <div className="recipe-detail-image-container">
          <img src={image} alt={title} className="recipe-detail-image" />
        </div>
        
        <div className="recipe-detail-info">
          <div className="recipe-time-info">
            {prep_time && (
              <div className="time-item">
                <span className="time-label">Czas przygotowania:</span>
                <span className="time-value">{prep_time}</span>
              </div>
            )}
            
            {cook_time && (
              <div className="time-item">
                <span className="time-label">Czas gotowania:</span>
                <span className="time-value">{cook_time}</span>
              </div>
            )}
            
            {total_time && (
              <div className="time-item">
                <span className="time-label">Czas całkowity:</span>
                <span className="time-value">{total_time}</span>
              </div>
            )}
            
            {servings && (
              <div className="time-item">
                <span className="time-label">Porcje:</span>
                <span className="time-value">{servings}</span>
              </div>
            )}
          </div>
          
          <div className="recipe-description-section">
            <h2>Opis</h2>
            <p>{description}</p>
          </div>
          
          <div className="recipe-ingredients-section">
            <h2>Składniki</h2>
            <ul className="ingredients-list">
              {ingredients && ingredients.map((ingredient, index) => (
                <li key={index} className="ingredient-item">{ingredient}</li>
              ))}
            </ul>
          </div>
          
          <div className="recipe-instructions-section">
            <h2>Instrukcje</h2>
            <ol className="instructions-list">
              {instructions && instructions.map((step, index) => (
                <li key={index} className="instruction-step">{step}</li>
              ))}
            </ol>
          </div>
          
          {url && (
            <div className="recipe-source-section">
              <a href={url} target="_blank" rel="noopener noreferrer" className="recipe-source-link">
                Zobacz oryginalny przepis
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}