import React from 'react';

export default function RecipeCard({ recipe }) {
  const { title, image, description, cousine } = recipe._source;
  return (
    <div className="p-4 border rounded shadow w-80">
      <img src={image} alt={title} className="w-full h-40 object-cover" />
      <h2 className="font-bold mt-2">{title}</h2>
      <p>{description}</p>
      <p className="text-sm text-gray-500">{cousine}</p>
    </div>
  );
}
