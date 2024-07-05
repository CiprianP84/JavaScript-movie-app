import { moviesDatabase } from "./movieStorage.js";

// Create movie cards
function createMovieCard(movie) {
  const movieCard = document.createElement("div");
  movieCard.classList.add("movie-card");

  const movieTitle = document.createElement("h2");
  movieTitle.classList.add("movie-title");
  movieTitle.textContent = movie.title;

  const movieCardLayout = document.createElement("div");
  movieCardLayout.classList.add("movie-card-layout");

  const moviePoster = document.createElement("img");
  moviePoster.src = movie.poster_url;
  moviePoster.alt = `Poster for ${movie.title}`;
  moviePoster.classList.add("movie-poster");

  const movieDetailsSide = document.createElement("div");
  movieDetailsSide.classList.add("movie-details-side");

  const movieYear = document.createElement("p");
  movieYear.classList.add("movie-details");
  movieYear.innerHTML = `<strong>Year:</strong> ${movie.movie_year}`;

  const movieDescription = document.createElement("p");
  movieDescription.classList.add("movie-description");
  movieDescription.textContent = movie.description;

  movieDetailsSide.append(movieYear, movieDescription);
  movieCardLayout.append(moviePoster, movieDetailsSide);

  const movieDirector = document.createElement("p");
  movieDirector.classList.add("movie-director");
  movieDirector.textContent = `Director: ${movie.director}`;

  const movieExtraInfo = document.createElement("div");
  movieExtraInfo.classList.add("movie-extra-info");
  movieExtraInfo.dataset.movieId = movie.id;

  const moviePrice = document.createElement("p");
  moviePrice.classList.add("movie-price");
  moviePrice.textContent = `DKK${movie.price}`;

  const sendMessage = document.createElement("div");
  sendMessage.classList.add("movie-info-icon");

  const movieRatings = document.createElement("div");
  movieRatings.classList.add("movie-ratings");

  const messageIcon = document.createElement("i");
  messageIcon.classList.add("fa-regular", "fa-message");
  sendMessage.appendChild(messageIcon);

  for (let i = 0; i < 5; i++) {
    const ratingButton = document.createElement("button");
    ratingButton.classList.add("rating");

    const starIcon = document.createElement("i");
    starIcon.classList.add("fa-regular", "fa-star");

    ratingButton.appendChild(starIcon);
    movieRatings.appendChild(ratingButton);

    ratingButton.addEventListener("click", () => {
      movie.rating = i + 1;
      updateStars(movieRatings, movie.rating);
    });
  }

  movieExtraInfo.append(moviePrice, movieRatings, sendMessage);
  movieCard.append(movieTitle, movieCardLayout, movieDirector, movieExtraInfo);

  sendMessage.addEventListener("click", function (e) {
    e.stopPropagation();
    openCommentsPopup(movie);
  });

  movieCardLayout.addEventListener("click", function () {
    openMovieDetailsPopup(movie);
  });

  updateStars(movieRatings, movie.rating || 0);

  return movieCard;
}

// Update star rating
function updateStars(ratingContainer, rating) {
  const stars = ratingContainer.querySelectorAll(".rating i");
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add("fa-solid");
      star.classList.remove("fa-regular");
    } else {
      star.classList.add("fa-regular");
      star.classList.remove("fa-solid");
    }
  });
}

// Popup and comment functionality 
function openCommentsPopup(movie) {
  const popupBackground = document.createElement("div");
  popupBackground.classList.add("popup-background");

  const popupContainer = document.createElement("div");
  popupContainer.classList.add("popup-container");

  const popupHeader = document.createElement("h2");
  popupHeader.textContent = `Comments for ${movie.title}`;
  popupHeader.classList.add("popup-header");

  const closeIcon = document.createElement("i");
  closeIcon.classList.add("fas", "fa-times", "close-icon");

  const miniPoster = document.createElement("img");
  miniPoster.src = movie.poster_url;
  miniPoster.alt = `Poster for ${movie.title}`;
  miniPoster.classList.add("mini-poster");

  const commentsSection = document.createElement("div");
  commentsSection.classList.add("comments-section");

  if (movie.comments && movie.comments.length > 0) {
    movie.comments.forEach(comment => {
      const commentElement = document.createElement("p");
      commentElement.textContent = comment;
      commentsSection.appendChild(commentElement);
    });
  }

  const commentInput = document.createElement("textarea");
  commentInput.classList.add("comment-input");
  commentInput.placeholder = "Write your comment here...";

  const submitButton = document.createElement("button");
  submitButton.textContent = "Submit";
  submitButton.classList.add("submit-button");

  const headerContainer = document.createElement("div");
  headerContainer.classList.add("header-container");
  headerContainer.append(miniPoster, popupHeader, closeIcon);

  popupContainer.append(headerContainer, commentsSection, commentInput, submitButton);
  popupBackground.appendChild(popupContainer);
  document.body.appendChild(popupBackground);

  closeIcon.addEventListener("click", function () {
    document.body.removeChild(popupBackground);
  });

  submitButton.addEventListener("click", function () {
    const newComment = commentInput.value.trim();
    if (newComment) {
      if (!movie.comments) {
        movie.comments = [];
      }
      movie.comments.push(newComment);

      const newCommentElement = document.createElement("p");
      newCommentElement.textContent = newComment;
      commentsSection.appendChild(newCommentElement);

      newCommentElement.style.border = "1px solid #5c5b5b";
      newCommentElement.style.padding = "5px";
      newCommentElement.style.margin = "5px";
      newCommentElement.style.borderRadius = "5px";

      commentInput.value = "";
    }
  });
}

// Movie details popup
function openMovieDetailsPopup(movie) {
  const popupBackground = document.createElement("div");
  popupBackground.classList.add("popup-background");

  const popupContainer = document.createElement("div");
  popupContainer.classList.add("popup-container");

  const popupHeader = document.createElement("h2");
  popupHeader.textContent = movie.title;
  popupHeader.classList.add("popup-header");

  const closeIcon = document.createElement("i");
  closeIcon.classList.add("fas", "fa-times", "close-icon");

  const popupContent = document.createElement("div");
  popupContent.classList.add("popup-content");

  const moviePoster = document.createElement("img");
  moviePoster.src = movie.poster_url;
  moviePoster.alt = `Poster for ${movie.title}`;
  moviePoster.classList.add("popup-movie-poster");

  const movieDetails = document.createElement("div");
  movieDetails.classList.add("popup-movie-details");

  const movieYear = document.createElement("p");
  movieYear.innerHTML = `<strong>Year:</strong> ${movie.movie_year}`;

  const movieDirector = document.createElement("p");
  movieDirector.innerHTML = `<strong>Director:</strong> ${movie.director}`;

  const movieDescription = document.createElement("p");
  movieDescription.innerHTML = `<strong>Description:</strong> ${movie.description}`;

  const movieActors = document.createElement("p");
  movieActors.innerHTML = `<strong>Main actors:</strong> ${movie.actors}`;

  const moviePrice = document.createElement("p");
  moviePrice.innerHTML = `<strong>Price:</strong> DKK${movie.price}`;

  movieDetails.append(movieYear, movieDirector, movieDescription, movieActors, moviePrice);

  const headerContainer = document.createElement("div");
  headerContainer.classList.add("header-container");
  headerContainer.append(popupHeader, closeIcon);

  popupContent.append(moviePoster, movieDetails);
  popupContainer.append(headerContainer, popupContent);
  popupBackground.appendChild(popupContainer);
  document.body.appendChild(popupBackground);

  closeIcon.addEventListener("click", function () {
    document.body.removeChild(popupBackground);
  });
}

//  Populate movie cards
function showMovies(movieList) {
  const movieGrid = document.getElementById("movie-layout");
  movieList.forEach((movie) => {
    const movieCard = createMovieCard(movie);
    movieGrid.appendChild(movieCard);
  });
}

showMovies(moviesDatabase);
