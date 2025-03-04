import React, { useState, useEffect, useCallback } from "react";
import RecipeCard from "../components/RecipeCard"; 
import "../styles/Favorites.css";

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  const removeFavorite = useCallback((recipe) => {
    setFavorites((prevFavorites) => {
      const updatedFavorites = prevFavorites.filter((fav) => fav.idMeal !== recipe.idMeal);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  }, []);

  return (
    <div className="favorites-container">
      <h1>Recetas Favoritas</h1>
      {favorites.length === 0 ? (
        <p>No hay recetas favoritas.</p>
      ) : (
        <div className="recipe-list">
          {favorites.map((recipe) => (
            <RecipeCard
              key={recipe.idMeal}
              recipe={recipe}
              toggleFavorite={removeFavorite}
              isFavorite={true} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
