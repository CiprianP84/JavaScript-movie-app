// Hold the fetched movie data
let moviesDatabase = [];
// Show 10 movies on first load
let currentIndex = 0;
const moviesPerPage = 10;

// Fetch the movies data from API
async function fetchMovies() {
  try {
    const response = await fetch('https://raw.githubusercontent.com/CiprianP84/CiprianP84.github.io/main/movieStorage.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const movies = await response.json();
    moviesDatabase = movies;
    showMovies(moviesDatabase.slice(0, moviesPerPage));
    currentIndex = moviesPerPage;
  } catch (error) {
    console.error('There was an error fetching the movies:', error);
  }
}
// Show more movies as the user scrolls to the bottom
function showMoreMovies() {
  const moviesToShow = moviesDatabase.slice(currentIndex, currentIndex + moviesPerPage);
  showMovies(moviesToShow, true);
  currentIndex += moviesPerPage;
}

// Infinite scroll
function setupInfiniteScroll() {
  window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
      if (currentIndex < moviesDatabase.length) {
        showMoreMovies();
      }
    }
  });
}

// Mobile toggle
function setupMobileToggle() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  mobileToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
  });

  document.addEventListener('click', (event) => {
    if (!mobileMenu.contains(event.target) && !mobileToggle.contains(event.target)) {
      mobileMenu.classList.remove('active');
    }
  });
}

// Search bar
function setupSearchBarToggle() {
  const searchIcon = document.getElementById('search-icon');
  const searchBar = document.getElementById('search-bar');

  searchIcon.addEventListener('click', function() {
    searchBar.classList.toggle('expanded');
    if (searchBar.classList.contains('expanded')) {
      searchBar.querySelector('input').focus();
    }
  });

  document.addEventListener('click', function(event) {
    if (!searchBar.contains(event.target) && !searchIcon.contains(event.target)) {
      searchBar.classList.remove('expanded');
    }
  });
}

function setupSearch() {
  const searchInput = document.getElementById('search-input');

  searchInput.addEventListener('input', () => {
    const keyword = searchInput.value;
    const filteredMovies = searchMovies(keyword);
    showMovies(filteredMovies);
  });
}
// Setup dropdown toggle
function setupDropdownToggle() {
  const showDropdown = document.getElementById('show-dropdown');
  const sortingDropdown = document.getElementById('sorting-dropdown');

  showDropdown.addEventListener('click', (event) => {
    event.stopPropagation(); 
    sortingDropdown.classList.toggle('show');
  });

  document.addEventListener('click', (event) => {
    if (!sortingDropdown.contains(event.target) && !showDropdown.contains(event.target)) {
      sortingDropdown.classList.remove('show');
    }
  });
}
// Sorting functions
function setupSorting() {
  const sortingCriteria = [
    { id: 'sort-asc', criteria: 'asc' },
    { id: 'sort-desc', criteria: 'desc' },
    { id: 'sort-price', criteria: 'price' },
    { id: 'sort-newest', criteria: 'newest' },
    { id: 'sort-oldest', criteria: 'oldest' },
    { id: 'sort-score', criteria: 'score' },
  ];

  sortingCriteria.forEach(({ id, criteria }) => {
    document.getElementById(id).addEventListener('click', (event) => {
      event.preventDefault();
      sortMovies(criteria);
    });
  });
}

function sortMovies(criteria) {
  const sortedMovies = [...moviesDatabase].sort((a, b) => {
    switch (criteria) {
      case 'asc':
        return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
      case 'desc':
        return b.title.toLowerCase().localeCompare(a.title.toLowerCase());
      case 'price':
        return a.price - b.price;
      case 'newest':
        return new Date(b.movie_year) - new Date(a.movie_year);
      case 'oldest':
        return new Date(a.movie_year) - new Date(b.movie_year);
      case 'score':
        return parseFloat(b.rotten_tomatoes_score) - parseFloat(a.rotten_tomatoes_score);
      default:
        return 0;
    }
  });
  showMovies(sortedMovies);
}
// Category popup
function setupCategoryPopup() {
  const showCategories = document.getElementById('show-categories');
  const categoryPopupBackground = createPopupBackground('category-popup-background');
  const categoryPopupContainer = createPopupContainer('category-popup-container');
  
  const categoryPopupHeader = createElement('h2', ['category-popup-header'], 'Select Categories');
  const closeIcon = createElement('i', ['fas', 'fa-times', 'category-close-icon']);
  closeIcon.addEventListener('click', () => {
    categoryPopupBackground.style.display = 'none';
  });

  const categoryPopupContent = createElement('div', ['category-popup-content']);
  const categories = [
    { id: 'quick-watch', label: 'Quick Watch (below 90 min)' },
    { id: 'long-evening', label: 'Long Evening (above 120 min)' },
    { id: 'age-pg', label: 'PG-rating' },
    { id: 'age-pg13', label: 'PG-13-rating' },
    { id: 'age-r', label: 'R-rating' },
    { id: 'age-g', label: 'G-rating' },
  ];

  categories.forEach(({ id, label }) => {
    const labelElement = createElement('label', []);
    const checkbox = createElement('input', []);
    checkbox.type = 'checkbox';
    checkbox.id = id;
    labelElement.append(checkbox, label);
    categoryPopupContent.appendChild(labelElement);
  });

  const categoryPopupButtons = createElement('div', ['category-popup-buttons']);
  const applyButton = createButton('Apply', filterMoviesByCategories);
  const resetButton = createButton('Reset', resetCategories);

  categoryPopupButtons.append(applyButton, resetButton);
  categoryPopupContainer.append(categoryPopupHeader, closeIcon, categoryPopupContent, categoryPopupButtons);
  categoryPopupBackground.appendChild(categoryPopupContainer);
  document.body.appendChild(categoryPopupBackground);

  showCategories.addEventListener('click', () => {
    categoryPopupBackground.style.display = 'block';
  });

  document.addEventListener('click', (event) => {
    if (!categoryPopupContainer.contains(event.target) && !showCategories.contains(event.target)) {
      categoryPopupBackground.style.display = 'none';
    }
  });
}

function filterMoviesByCategories() {
  const categories = [
    { id: 'quick-watch', condition: movie => movie.movie_duration < 90 },
    { id: 'long-evening', condition: movie => movie.movie_duration > 120 },
    { id: 'age-pg', condition: movie => movie.age_rating === 'PG' },
    { id: 'age-pg13', condition: movie => movie.age_rating === 'PG-13' },
    { id: 'age-r', condition: movie => movie.age_rating === 'R' },
    { id: 'age-g', condition: movie => movie.age_rating === 'G' },
  ];

  const filteredMovies = moviesDatabase.filter(movie => 
    categories.some(({ id, condition }) => document.getElementById(id).checked && condition(movie))
  );

  showMovies(filteredMovies);
}

function resetCategories() {
  document.querySelectorAll('.category-popup-content input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);
  showMovies(moviesDatabase);
}

// Helper function to reduce duplicate code
function createElement(tag, classes = [], content = '') {
  const element = document.createElement(tag);
  element.classList.add(...classes);
  if (content) element.innerHTML = content;
  return element;
}

function createPopupBackground(id) {
  const popupBackground = document.createElement('div');
  popupBackground.classList.add('category-popup-background');
  popupBackground.id = id;
  return popupBackground;
}

function createPopupContainer(id) {
  const popupContainer = document.createElement('div');
  popupContainer.classList.add('category-popup-container');
  popupContainer.id = id;
  return popupContainer;
}

function createButton(text, onClick) {
  const button = createElement('button', [], text);
  button.addEventListener('click', onClick);
  return button;
}
// Toggle favourite function
function toggleFavorite(movie, icon) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const isFavorite = favorites.some(favMovie => favMovie.id === movie.id);

  if (isFavorite) {
    favorites = favorites.filter(favMovie => favMovie.id !== movie.id);
    icon.classList.remove('fa-solid');
    icon.classList.add('fa-regular');
  } else {
    favorites.push(movie);
    icon.classList.add('fa-solid');
    icon.classList.remove('fa-regular');
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  console.log("your favorites movies => ", favorites)
}
// Create movie info
function createMovieInfo(movie) {
  const addToFavoriteIcon = createElement('i', ['fa-regular', 'fa-heart', 'favorite-movie-icon']);
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  if (favorites.some(favMovie => favMovie.id === movie.id)) {
    addToFavoriteIcon.classList.add('fa-solid');
    addToFavoriteIcon.classList.remove('fa-regular');
  }
  addToFavoriteIcon.addEventListener('click', () => {
    toggleFavorite(movie, addToFavoriteIcon);
  });
  const movieTitle = createElement('h2', ['movie-title'], movie.title);
  const moviePoster = createElement('img', ['movie-poster']);
  moviePoster.src = movie.poster_url;
  moviePoster.alt = `Poster for ${movie.title}`;

  const movieYear = createElement('p', ['movie-details'], `<strong>Year:</strong> ${movie.movie_year}`);
  const movieDescription = createElement('p', ['movie-description'], movie.description);

  const movieDetailsSide = createElement('div', ['movie-details-side']);
  movieDetailsSide.append(movieYear, movieDescription);

  const movieCardLayout = createElement('div', ['movie-card-layout']);
  movieCardLayout.append(moviePoster, movieDetailsSide);

  const movieDirector = createElement('p', ['movie-director'], `Director: ${movie.director}`);

  const movieInfo = createElement('div', ['movie-info']);
  movieInfo.append(addToFavoriteIcon, movieTitle, movieCardLayout, movieDirector);

  return movieInfo;
}

// Create rating function
function createStarRating(movie) {
  const movieRatings = createElement('div', ['movie-ratings']);

  for (let i = 0; i < 5; i++) {
    const ratingButton = createElement('button', ['rating']);
    const starIcon = createElement('i', ['fa-regular', 'fa-star']);
    ratingButton.appendChild(starIcon);
    ratingButton.setAttribute('aria-label', `Rate ${i + 1} stars`);

    ratingButton.addEventListener('click', () => {
      movie.rating = i + 1;
      updateStars(movieRatings, movie.rating);
    });

    movieRatings.appendChild(ratingButton);
  }

  updateStars(movieRatings, movie.rating || 0);

  return movieRatings;
}

// Update star rating
function updateStars(ratingContainer, rating) {
  const stars = ratingContainer.querySelectorAll('.rating i');
  stars.forEach((star, index) => {
    star.classList.toggle('fa-solid', index < rating);
    star.classList.toggle('fa-regular', index >= rating);
    star.parentElement.setAttribute('aria-pressed', index < rating);
  });
}

// Create comment component
function createCommentComponent(movie) {
  const sendMessage = createElement('div', ['movie-info-icon']);
  const messageIcon = createElement('i', ['fa-regular', 'fa-message']);
  sendMessage.appendChild(messageIcon);

  const movieExtraInfo = createElement('div', ['movie-extra-info']);
  movieExtraInfo.dataset.movieId = movie.id;

  const moviePrice = createElement('p', ['movie-price'], `DKK${movie.price}`);
  const commentsButton = createElement('button', ['comments-button']);
  commentsButton.setAttribute('aria-label', `View comments for ${movie.title}`);
  sendMessage.appendChild(commentsButton);

  movieExtraInfo.append(moviePrice, createStarRating(movie), sendMessage);

  sendMessage.addEventListener('click', (e) => {
    e.stopPropagation();
    openCommentsPopup(movie);
  });

  return movieExtraInfo;
}

// Create comment element
function createCommentElement(comment, author, time) {
  const commentContainer = createElement('div', ['comment-container']);
  
  const commentText = createElement('p', ['comment'], comment);
  const commentAuthor = createElement('p', ['comment-author'], `Posted by ${author} on ${time}`);
  
  commentContainer.append(commentText, commentAuthor);
  
  return commentContainer;
}


// Create submit button
function createSubmitButton(movie, commentInput, authorInput, commentsSection) {
  const submitButton = createElement('button', ['submit-button'], 'Submit');

  submitButton.addEventListener('click', () => {
    const newComment = commentInput.value.trim();
    let authorName = authorInput.value.trim() || 'Anonymous';
    
    if (newComment) {
      const currentTime = new Date().toLocaleString();
      movie.comments = movie.comments || [];
      movie.comments.push({ comment: newComment, author: authorName, time: currentTime });

      const newCommentElement = createCommentElement(newComment, authorName, currentTime);
      commentsSection.appendChild(newCommentElement);
      commentInput.value = '';
      authorInput.value = '';
    }
  });

  return submitButton;
}


// Open comments popup
function openCommentsPopup(movie) {
  const popupBackground = createElement('div', ['popup-background']);
  const popupContainer = createElement('div', ['popup-container']);
  const popupHeader = createElement('h2', ['popup-header'], `Comments for ${movie.title}`);
  const closeIcon = createElement('i', ['fas', 'fa-times', 'close-icon']);
  const miniPoster = createElement('img', ['mini-poster']);
  miniPoster.src = movie.poster_url;
  miniPoster.alt = `Poster for ${movie.title}`;

  const commentsWrapper = createElement('div', ['comments-wrapper']);
  const commentsSection = createElement('div', ['comments-section']);
  (movie.comments || []).forEach(({ comment, author, time }) => {
    commentsSection.appendChild(createCommentElement(comment, author, time));
  });

  const authorInput = createElement('input', ['author-input']);
  authorInput.type = 'text';
  authorInput.placeholder = 'Your name';

  const commentInput = createElement('textarea', ['comment-input']);
  commentInput.placeholder = "Write your comment here...";
  
  const submitButton = createSubmitButton(movie, commentInput, authorInput, commentsSection);

  const headerContainer = createElement('div', ['header-container']);
  headerContainer.append(miniPoster, popupHeader, closeIcon);

  commentsWrapper.appendChild(commentsSection);

  popupContainer.append(headerContainer, commentsWrapper, authorInput, commentInput, submitButton);
  popupBackground.appendChild(popupContainer);
  document.body.appendChild(popupBackground);

  closeIcon.addEventListener('click', () => {
    document.body.removeChild(popupBackground);
  });
}

// Open movie details popup
function openMovieDetailsPopup(movie) {
  const popupBackground = createElement('div', ['popup-background']);
  const popupContainer = createElement('div', ['popup-container']);
  const popupHeader = createElement('h2', ['popup-header'], movie.title);
  const closeIcon = createElement('i', ['fas', 'fa-times', 'close-icon']);

  const moviePoster = createElement('img', ['popup-movie-poster']);
  moviePoster.src = movie.poster_url;
  moviePoster.alt = `Poster for ${movie.title}`;
  const movieLength = createElement('p', [], `<strong>Duration:</strong> ${movie.movie_duration} minutes`);
  const movieTrailer = createElement('p', [], `<a href="${movie.trailer}"target="_blank"><i class="fa-brands fa-youtube"></i> Watch the trailer</a>`);
  const movieOnline = createElement('p', [], `<a href="${movie.watch_online}"target="_blank"><i class="fa-solid fa-film"></i> Watch online</a>`);

  const movieYear = createElement('p', [], `<strong>Year:</strong> ${movie.movie_year}`);
  const movieDirector = createElement('p', [], `<strong>Director:</strong> ${movie.director}`);
  const movieDescription = createElement('p', [], `<strong>Description:</strong> ${movie.description}`);
  const movieActors = createElement('p', [], `<strong>Main actors:</strong> ${movie.actors}`);
  const movieRating = createElement('p', [], `<strong>Age rating:</strong> ${movie.age_rating}`);
  const movieScore = createElement('p', [], `<strong>Rotten Tomatoes Score:</strong> ${movie.rotten_tomatoes_score}`);
  const moviePrice = createElement('p', [], `<strong>Price:</strong> DKK${movie.price}`);

  const movieLeft = createElement('div', ['popup-left']);
  movieLeft.append(moviePoster, movieLength, movieTrailer, movieOnline);
  const movieDetails = createElement('div', ['popup-movie-details']);
  movieDetails.append(movieYear, movieDirector, movieDescription, movieActors, movieRating, movieScore, moviePrice);

  const headerContainer = createElement('div', ['header-container']);
  headerContainer.append(popupHeader, closeIcon);

  const popupContent = createElement('div', ['popup-content']);
  popupContent.append(movieLeft, movieDetails);
  popupContainer.append(headerContainer, popupContent);
  popupBackground.appendChild(popupContainer);
  document.body.appendChild(popupBackground);

  closeIcon.addEventListener('click', () => {
    document.body.removeChild(popupBackground);
  });
}

// Create movie card
function createMovieCard(movie) {
  const movieCard = createElement('div', ['movie-card']);
  const movieInfo = createMovieInfo(movie);
  const commentComponent = createCommentComponent(movie);

  movieCard.append(movieInfo, commentComponent);

  const movieCardLayout = movieInfo.querySelector('.movie-card-layout');
  movieCardLayout.addEventListener('click', () => openMovieDetailsPopup(movie));

  return movieCard;
}

// Populate movie cards
function showMovies(movieList, append = false) {
  const movieGrid = document.getElementById('movie-layout');
  if (!append) {
    movieGrid.innerHTML = '';
  }
  movieList.forEach(movie => {
    const movieCard = createMovieCard(movie);
    movieGrid.appendChild(movieCard);
  });
}

// Search movies function
function searchMovies(keyword) {
  return moviesDatabase.filter(movie =>
    movie.title.toLowerCase().includes(keyword.toLowerCase()) ||
    movie.description.toLowerCase().includes(keyword.toLowerCase()) ||
    movie.director.toLowerCase().includes(keyword.toLowerCase()) ||
    movie.actors.some(actor => actor.toLowerCase().includes(keyword.toLowerCase()))
  );
}

// Set the timer
function setupTimer() {
  const startButton = document.getElementById('start-btn');
  const timeInput = document.getElementById('time-input');
  const countdownElement = document.getElementById('countdown');
  const timeUpPopup = document.getElementById('time-up-popup');
  const continueButton = document.getElementById('continue-btn');
  const randomButton = document.getElementById('random-btn');
  const closeTimerBlock = document.getElementById('close-timer-block');
  const timerBlock = document.getElementById('timer-block');
  const timerNavbarIcon = document.querySelector('.toggle-timer-block');

  const timerAlarm = new Audio('tazflix-alarm.wav');
  let timer;

  startButton.addEventListener('click', () => {
      const timeValue = parseFloat(timeInput.value);
      if (isNaN(timeValue) || timeValue <= 0) {
          alert('Please enter a valid time in minutes.');
          return;
      }

      clearInterval(timer);
      let timeLeft = timeValue * 60;

      timer = setInterval(() => {
          if (timeLeft <= 0) {
              clearInterval(timer);
              showPopup();
              countdownElement.textContent = '';
              timerAlarm.play();
          } else {
              timeLeft--;
              const minutes = Math.floor(timeLeft / 60);
              const seconds = timeLeft % 60;
              countdownElement.textContent = `${minutes}m ${seconds}s remaining`;
          }
      }, 1000);
  });

  continueButton.addEventListener('click', () => {
      hidePopup();
  });

  randomButton.addEventListener('click', () => {
      hidePopup();
      chooseRandomMovie();
  });

  closeTimerBlock.addEventListener('click', () => {
      timerBlock.classList.add('hidden');
  });

  timerNavbarIcon.addEventListener('click', () => {
    timerBlock.classList.toggle('hidden');
  });

  function showPopup() {
      timeUpPopup.style.display = 'block';
  }

  function hidePopup() {
      timeUpPopup.style.display = 'none';
  }

  function chooseRandomMovie() {
      const randomIndex = Math.floor(Math.random() * moviesDatabase.length);
      const randomMovie = moviesDatabase[randomIndex];
      openMovieDetailsPopup(randomMovie);
  }
}

// Time Spent 
function timeSpent() {
  let startTime = Date.now();
  const timeSpentElement = document.getElementById('time-spent');

  function updateTimeSpent() {
      let currentTime = Date.now();
      let timeSpent = currentTime - startTime;
      let seconds = Math.floor((timeSpent / 1000) % 60);
      let minutes = Math.floor((timeSpent / (1000 * 60)) % 60);
      let hours = Math.floor((timeSpent / (1000 * 60 * 60)) % 24);

      timeSpentElement.textContent = `${hours}h ${minutes}m ${seconds}s`;
  }
  setInterval(updateTimeSpent, 1000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    setupMobileToggle();
    setupSearch();
    setupTimer();
    timeSpent();
    fetchMovies();
    setupSearchBarToggle();
    setupSorting();
    setupDropdownToggle();
    setupCategoryPopup();
    setupInfiniteScroll();
});