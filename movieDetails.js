import { moviesDatabase } from "./movieStorage.js";

// Helper function to reduce duplicate code
function createElement(tag, classes = [], content = '') {
  const element = document.createElement(tag);
  element.classList.add(...classes);
  if (content) element.innerHTML = content;
  return element;
}

// Create movie info
function createMovieInfo(movie) {
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
  movieInfo.append(movieTitle, movieCardLayout, movieDirector);

  return movieInfo;
}

// Create rating function
function createStarRating(movie) {
  const movieRatings = createElement('div', ['movie-ratings']);

  for (let i = 0; i < 5; i++) {
    const ratingButton = createElement('button', ['rating']);
    const starIcon = createElement('i', ['fa-regular', 'fa-star']);
    ratingButton.appendChild(starIcon);

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
  sendMessage.appendChild(commentsButton);

  movieExtraInfo.append(moviePrice, createStarRating(movie), sendMessage);

  sendMessage.addEventListener('click', (e) => {
    e.stopPropagation();
    openCommentsPopup(movie);
  });

  return movieExtraInfo;
}

// Create comment element
function createCommentElement(comment) {
  return createElement('p', ['comment'], comment);
}

// Create submit button
function createSubmitButton(movie, commentInput, commentsSection) {
  const submitButton = createElement('button', ['submit-button'], 'Submit');

  submitButton.addEventListener('click', () => {
    const newComment = commentInput.value.trim();
    if (newComment) {
      movie.comments = movie.comments || [];
      movie.comments.push(newComment);

      const newCommentElement = createCommentElement(newComment);
      commentsSection.appendChild(newCommentElement);
      commentInput.value = '';
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

  const commentsSection = createElement('div', ['comments-section']);
  (movie.comments || []).forEach(comment => {
    commentsSection.appendChild(createCommentElement(comment));
  });

  const commentInput = createElement('textarea', ['comment-input']);
  commentInput.placeholder = "Write your comment here...";
  const submitButton = createSubmitButton(movie, commentInput, commentsSection);

  const headerContainer = createElement('div', ['header-container']);
  headerContainer.append(miniPoster, popupHeader, closeIcon);

  popupContainer.append(headerContainer, commentsSection, commentInput, submitButton);
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

  const movieYear = createElement('p', [], `<strong>Year:</strong> ${movie.movie_year}`);
  const movieDirector = createElement('p', [], `<strong>Director:</strong> ${movie.director}`);
  const movieDescription = createElement('p', [], `<strong>Description:</strong> ${movie.description}`);
  const movieActors = createElement('p', [], `<strong>Main actors:</strong> ${movie.actors}`);
  const moviePrice = createElement('p', [], `<strong>Price:</strong> DKK${movie.price}`);

  const movieDetails = createElement('div', ['popup-movie-details']);
  movieDetails.append(movieYear, movieDirector, movieDescription, movieActors, moviePrice);

  const headerContainer = createElement('div', ['header-container']);
  headerContainer.append(popupHeader, closeIcon);

  const popupContent = createElement('div', ['popup-content']);
  popupContent.append(moviePoster, movieDetails);
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
function showMovies(movieList) {
  const movieGrid = document.getElementById('movie-layout');
  movieList.forEach(movie => {
    const movieCard = createMovieCard(movie);
    movieGrid.appendChild(movieCard);
  });
}

showMovies(moviesDatabase);
