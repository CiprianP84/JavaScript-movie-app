import { moviesDatabase } from "./movieStorage.js";

// Function to search for a keyword
function searchMoviesByKeyword(keyword) {
  const lowerCaseKeyword = keyword.toLowerCase();
  return moviesDatabase.filter(movie => 
    movie.title.toLowerCase().includes(lowerCaseKeyword)
  );
}

// Function to sort the movie array by one or a few selected properties
function sortMovies(properties) {
  return [...moviesDatabase].sort((a, b) => {
    for (let prop of properties) {
      if (a[prop] < b[prop]) return -1;
      if (a[prop] > b[prop]) return 1;
    }
    return 0;
  });
}

// Function to filter by age rating
function filterMoviesByAgeRating(ageRating) {
  if (ageRating === '') return moviesDatabase;
  return moviesDatabase.filter(movie => 
    movie.age_rating === ageRating
  );
}

// Function to filter movies by minimum duration
function filterMoviesByDuration(minDuration) {
  return moviesDatabase.filter(movie => movie.movie_duration >= minDuration);
}

// Function to sort movies by Rotten Tomatoes score
function sortMoviesByTomatoesRating() {
  return [...moviesDatabase].sort((a, b) => b.rotten_tomatoes_score - a.rotten_tomatoes_score);
}

// Testing the searching and sorting function:
const searchResults = searchMoviesByKeyword('dark');
console.log('Search Results:', searchResults);

const sortedMovies = sortMovies(['movie_year', 'title']);
console.log('Sorted Movies:', sortedMovies);

const ageRatedMovie = filterMoviesByAgeRating('G');
console.log('Age Rated Movie:', ageRatedMovie);

const longestMovie = filterMoviesByDuration(160);
console.log('Longest Movie:', longestMovie);

const sortedByTomatoes = sortMoviesByTomatoesRating();
console.log('Movies sorted by Rotten Tomatoes Rating:', sortedByTomatoes);
