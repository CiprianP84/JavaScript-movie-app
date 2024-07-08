import { moviesDatabase } from "./movieStorage.js";

// Function to search for a keyword
function searchMovies(keyword) {
  return moviesDatabase.filter(movie =>
    movie.title.toLowerCase().includes(keyword.toLowerCase()) ||
    movie.description.toLowerCase().includes(keyword.toLowerCase()) ||
    movie.director.toLowerCase().includes(keyword.toLowerCase()) ||
    movie.actors.some(actor => actor.toLowerCase().includes(keyword.toLowerCase()))
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
  return moviesDatabase.filter(movie => 
    movie.age_rating === ageRating
  );
}

// Function to show movies over 120min
const moviesOver2Hours = moviesDatabase
.filter(movie => movie.movie_duration > 120)
.map(movie => movie.title);

// Function to sort by the highest Rotten Tomatoes Score
const sortedByScore = [...moviesDatabase]
.sort((a, b) => {
  const scoreA = parseFloat(a.rotten_tomatoes_score);
  const scoreB = parseFloat(b.rotten_tomatoes_score);
  return scoreB - scoreA;
})
.map(movie => ({
  score: movie.rotten_tomatoes_score,
  title: movie.title
}));


// Testing the searching and sorting function:
const searchResults = searchMovies('dark');
console.log('Search Results:', searchResults);

const sortedMovies = sortMovies(['movie_year', 'title']);
console.log('Sorted Movies:', sortedMovies);

const ageRatedMovie = filterMoviesByAgeRating('G');
console.log('Age Rated Movie:', ageRatedMovie);

console.log("Here are movies longer than 2 hours: ",moviesOver2Hours);

console.log("Here are the movies sorted by the Rotten Tomatoes Score: ",sortedByScore);

