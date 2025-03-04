import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/Details.css";

function Details() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    axios
      .get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then((response) => setRecipe(response.data.meals[0]))
      .catch((error) => console.error(error));
  }, [id]);

  if (!recipe) return <h1>Cargando...</h1>;

  return (
    <div className="details-container">
      <h1>{recipe.strMeal}</h1>
      <img className="details-image" src={recipe.strMealThumb} alt={recipe.strMeal} />

      <p>{recipe.strInstructions}</p>
      {recipe.strYoutube && (
        <a
          className="youtube-button"
          href={recipe.strYoutube}
          target="_blank"
          rel="noopener noreferrer"
        >
          📺 Ver en YouTube
        </a>
      )}
    </div>
  );
}

export default Details;
