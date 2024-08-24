// Load favorites from localStorage and display them
function loadFavorites() {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const favoritesContainer = document.getElementById('favorites-container');
  const noFavoritesYet = document.getElementById('no-favorites-yet');

  if (favorites.length > 0) {
    favoritesContainer.innerHTML = ''; 
    favorites.forEach(movie => {
      const movieCard = createMovieCard(movie);
      favoritesContainer.appendChild(movieCard);
    });

    noFavoritesYet.style.display = 'none';
    favoritesContainer.style.display = 'grid';
  } else {
    noFavoritesYet.style.display = 'flex';
    favoritesContainer.style.display = 'none';
  }
}

// Helper to create a movie card for a favorite movie
function createMovieCard(movie) {
  const movieCard = document.createElement('div');
  movieCard.classList.add('movie-card');

  // Create movie info like title, poster, description, etc.
  const movieInfo = createMovieInfo(movie);
  
  // Append movie info to the card
  movieCard.appendChild(movieInfo);

  return movieCard;
}

function createMovieInfo(movie) {
  const movieInfo = document.createElement('div');
  movieInfo.classList.add('favorite-movie-info');

  const addToFavoriteIcon = document.createElement('i');
  addToFavoriteIcon.classList.add('fa-regular', 'fa-heart', 'favorite-movie-icon');

  // Check if the movie is already in favorites
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  if (favorites.some(favMovie => favMovie.id === movie.id)) {
    addToFavoriteIcon.classList.add('fa-solid');
    addToFavoriteIcon.classList.remove('fa-regular');
  }

  // Add click event to toggle favorite
  addToFavoriteIcon.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleFavorite(movie, addToFavoriteIcon);
  });

  const movieTitle = document.createElement('h2');
  movieTitle.classList.add('movie-title');
  movieTitle.textContent = movie.title;

  const moviePoster = document.createElement('img');
  moviePoster.classList.add('favorite-movie-poster');
  moviePoster.src = movie.poster_url;
  moviePoster.alt = `Poster for ${movie.title}`;

  const movieDirector = document.createElement('p', ['movie-director'], `Director: ${movie.director}`);
  movieDirector.classList.add('movie-director');
  movieDirector.textContent = movie.director;

  movieInfo.append(addToFavoriteIcon, movieTitle, moviePoster, movieDirector);

  return movieInfo;
}

// Toggle favorite functionality
function toggleFavorite(movie, icon) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const isFavorite = favorites.some(favMovie => favMovie.id === movie.id);

  if (isFavorite) {
    // Remove from favorites
    favorites = favorites.filter(favMovie => favMovie.id !== movie.id);
    icon.classList.remove('fa-solid');
    icon.classList.add('fa-regular');
  } else {
    // Add to favorites
    favorites.push(movie);
    icon.classList.add('fa-solid');
    icon.classList.remove('fa-regular');
  }

  // Update localStorage
  localStorage.setItem('favorites', JSON.stringify(favorites));

  if (!isFavorite) {
    console.log("Updated favorite movies:", favorites);
  } else {
    loadFavorites();
  }
}

// Load favorites on DOMContentLoaded
document.addEventListener('DOMContentLoaded', loadFavorites);
