import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import RecipeCard from "../components/RecipeCard";
import "../styles/Home.css";

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [visibleRecipes, setVisibleRecipes] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allRecipesLoaded, setAllRecipesLoaded] = useState(false);

  useEffect(() => {
    axios
      .get("https://www.themealdb.com/api/json/v1/1/list.php?c=list")
      .then((response) => {
        const categoryList = response.data.meals.map((meal) => meal.strCategory);
        setCategories(categoryList);
        fetchAllRecipes(categoryList);
      })
      .catch((error) => console.error("Error al obtener las categorías:", error));

    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  const fetchAllRecipes = async (categoryList) => {
    setLoading(true);
    try {
      const recipePromises = categoryList.map((category) =>
        axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
      );

      const results = await Promise.all(recipePromises);
      const allRecipes = results.flatMap((result) => result.data.meals);
      setRecipes(allRecipes);
    } catch (error) {
      console.error("Error al obtener las recetas:", error);
    } finally {
      setLoading(false);
      setAllRecipesLoaded(true);
    }
  };

  const handleCategoryChange = async (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setRecipes([]); 
    setVisibleRecipes(10);
    setAllRecipesLoaded(false);

    if (category === "") {
      await fetchAllRecipes(categories);
    } else {
      try {
        setLoading(true);
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        setRecipes(response.data.meals);
      } catch (error) {
        console.error("Error al obtener las recetas:", error);
      } finally {
        setLoading(false);
        setAllRecipesLoaded(true);
      }
    }
  };

  const toggleFavorite = useCallback((recipe) => {
    setFavorites((prevFavorites) => {
      let updatedFavorites;
      if (prevFavorites.some((fav) => fav.idMeal === recipe.idMeal)) {
        updatedFavorites = prevFavorites.filter((fav) => fav.idMeal !== recipe.idMeal);
      } else {
        updatedFavorites = [...prevFavorites, recipe];
      }
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  }, []);


  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100 &&
        visibleRecipes < recipes.length &&
        !loading &&
        allRecipesLoaded
      ) {
        setLoading(true);
        setTimeout(() => {
          setVisibleRecipes((prev) => prev + 10);
          setLoading(false);
        }, 500);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [recipes, visibleRecipes, loading, allRecipesLoaded]);

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.strMeal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home-container">
      <div className="header-container">
        <h1>🍕Lista de Recetas🍔</h1>

        <div className="filters">
          <input
            type="text"
            placeholder="Buscar receta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select value={selectedCategory} onChange={handleCategoryChange}>
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && recipes.length === 0 ? (
        <div className="loading-container">
          <p>Cargando recetas...</p>
        </div>
      ) : (
        <div className="recipe-list">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.slice(0, visibleRecipes).map((recipe) => (
              <RecipeCard
                key={recipe.idMeal}
                recipe={recipe}
                toggleFavorite={toggleFavorite}
                isFavorite={favorites.some((fav) => fav.idMeal === recipe.idMeal)}
              />
            ))
          ) : (
            <div className="loading-container">
              <p>No hay recetas disponibles</p>
            </div>
          )}
        </div>
      )}

      {loading && recipes.length > 0 && (
        <div className="loading-container">
          <p>Cargando más recetas...</p>
        </div>
      )}
    </div>
  );
}

export default Home;
