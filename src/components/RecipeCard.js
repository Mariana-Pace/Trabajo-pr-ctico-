import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const RecipeCard = React.memo(({ recipe, toggleFavorite, isFavorite }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setImageLoaded(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="recipe-card">
      {imageLoaded ? (
        <img ref={imgRef} src={recipe.strMealThumb} alt={recipe.strMeal} />
      ) : (
        <div className="image-placeholder" ref={imgRef}>Cargando...</div>
      )}
      <h3>{recipe.strMeal}</h3>
      <button
  className={`action-btn ${isFavorite ? "remove-btn" : "add-btn"}`}
  onClick={() => toggleFavorite(recipe)}
>
  {isFavorite ? "❌ Eliminar" : "❤️ Agregar"}
</button>

<Link to={`/details/${recipe.idMeal}`} className="details-button">
        Ver Detalles
      </Link>
    </div>
  );
});

export default RecipeCard;
