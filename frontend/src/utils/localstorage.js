export const getFavoritesFromLocalStorage = () => {
  const favorites = localStorage.getItem("favorites");
  return favorites ? JSON.parse(favorites) : []
}

export const addFavoriteToLocalStorage = (product) => {
  const favorites = getFavoritesFromLocalStorage()
  favorites.push(product)
  localStorage.setItem("favorites", JSON.stringify(favorites))
}

export const removeFavoriteFromLocalStorage = (id) => {
  const favorites = getFavoritesFromLocalStorage()
  const newFavoritesList = favorites.filter(product => product._id !== id)
  localStorage.setItem("favorites", JSON.stringify(newFavoritesList))
}

export const clearFavoriteFromLocalStorage = () => {
  localStorage.removeItem("favorites")
}