let films, currentFilm, index;
const filmsInRow = 1;

body.addEventListener('keydown', (e) => {
  const targetElement = e.target.tagName.toLowerCase();

  if (!targetElement.match(/(input|textarea|select)/)) {
    const key = e.key.toLowerCase();

    switch(key) {
      case 'n':               //Log a new film
        logNewFilm();
        break;
      case 'escape':          //Close modal window / Cancel
        closeModal();
        break;
      case 'd':               //Delete review/diary entry / Confirm deletion
      case 'delete':
        deleteReview();
        break;
      case 's':               //Select/deselect films
        toggleSelect();
        break;
      default:
        filmAction(e, key);
        break;
    }
  }
});

const filmAction = (e, key) => {
  const selectedFilm = document.querySelector('.lbs-selected-diary-film');
  const reviewWindow = document.querySelector('#modal > #add-film.expanded');

  if (reviewWindow) {
    e.preventDefault();
    switch(key) {
      case 'l':
        reviewWindow.querySelector('#film-like-checkbox').checked = !reviewWindow.querySelector('#film-like-checkbox').checked;
        break;
      case 'enter':
        submitReview();
        break;
    }
  } else if (selectedFilm) {
    e.preventDefault();
    switch(key) {
      case 'arrowright':
      case 'arrowdown':
        index = index < (films.length - 1) ? index + 1 : index;
        break;
      case 'arrowleft':
      case 'arrowup':
        index = index > 0 ? index - 1 : 0;
        break;
      case 'a':
        addToWatchlist(currentFilm);
        break;
      case 'e':
        editReview(currentFilm);
        break;
      case 'i':
        addToList(currentFilm);
        break;
      case 'l':
        likeFilm(currentFilm);
        break;
      case 'r':
        reviewFilm(currentFilm);
        break;
      case 'w':
        watchFilm(currentFilm);
        break;
      case 'x':
        removeFromWatchlist(currentFilm);
        break;
      case 'enter':
        handleEnter(currentFilm);
        break;
      case 'z':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
      case '0':
        rateFilm(currentFilm, key);
        break;
    }

    if (e.keyCode >= 37 || e.keyCode <= 40) {
      currentFilm = films[index];
      markAsSelected(currentFilm);
    }
  }
};

const toggleSelect = () => {
  const selectedFilm = document.querySelector('.lbs-selected-diary-film');

  if (selectedFilm) {                                                                                                                                                             
    films = document.querySelectorAll('.td-film-details');

    if (films.length) {
      index = 0;
      currentFilm = films[index];
      markAsSelected(currentFilm);
    }
  } else {
    selectedFilm.classList.remove('lbs-selected-diary-film');
  }
};

const markAsSelected = (currentFilm) => {
  const selectedFilm = document.querySelector('.lbs-selected-diary-film');

  if (selectedFilm)
    selectedFilm.classList.remove('lbs-selected-diary-film');

  currentFilm.classList.add('lbs-selected-diary-film');
};

const editReview = (film) => {
  const editButton = film.parentNode.querySelector('.edit-review-button');
  return editButton && editButton.click();
};

const likeFilm = (film) => {
  const likeButton = film.parentNode.querySelector('.like-link > .ajax-click-action');
  return likeButton && likeButton.click();
};

const watchFilm = (film) => {
  const watchButton = film.parentNode.querySelector('.film-watch-link > .ajax-click-action');
  return watchButton && watchButton.click();
};

const addToWatchlist = (film) => {
  const filmId = film.querySelector('.linked-film-poster').dataset.filmId;

  let addButton = document.querySelector(`.add-to-watchlist[data-film-id="${filmId}"]`);

  createPopOutMenu(film, addButton);

  addButton = document.querySelector(`.add-to-watchlist[data-film-id="${filmId}"]`);
  return addButton && addButton.click();
};

const addToList = (film) => {
  const filmId = film.querySelector('.linked-film-poster').dataset.filmId;

  let addToListButton = document.querySelector(`.menu-item-add-to-list[data-film-id="${filmId}"]`);

  createPopOutMenu(film, addToListButton);

  addToListButton = document.querySelector(`.menu-item-add-to-list[data-film-id="${filmId}"]`);
  return addToListButton && addToListButton.click();
};

const removeFromWatchlist = (film) => {
  const filmId = film.querySelector('.linked-film-poster').dataset.filmId;

  let removeButton = document.querySelector(`.remove-from-watchlist[data-film-id="${filmId}"]`);

  createPopOutMenu(film, removeButton);

  removeButton = document.querySelector(`.remove-from-watchlist[data-film-id="${filmId}"]`);
  return removeButton && removeButton.click();
};

const reviewFilm = (film) => {
  const filmId = film.querySelector('.linked-film-poster').dataset.filmId;

  let reviewButton = document.querySelector(`.menu-item-add-this-film[data-film-id="${filmId}"]`);

  createPopOutMenu(film, reviewButton);

  reviewButton = document.querySelector(`.menu-item-add-this-film[data-film-id="${filmId}"]`);
  return reviewButton && reviewButton.click();
};

const createPopOutMenu = (film, button) => {
  if (!button) {
    const mouseOverEvent = new MouseEvent('mouseover');
    const mouseOutEvent = new MouseEvent('mouseout');

    const actionsMenu = film.parentNode.querySelector('.has-menu');

    actionsMenu.dispatchEvent(mouseOverEvent);
    actionsMenu.dispatchEvent(mouseOutEvent);
  }
};

const getRateUrl = (film) => {
  const linkedFilmPoster = film && film.querySelector('.linked-film-poster');
  const rateUrl = linkedFilmPoster && linkedFilmPoster.dataset && linkedFilmPoster.dataset.rateAction;
  return rateUrl && `${letterboxdUrl}${rateUrl}`;
};

const rateFilm = (film, rating) => {
  rating = rating == 0 ? 10 : rating;
  rating = rating === 'z' ? 0 : rating;

  const ratingData = new FormData();

  ratingData.set('rating', rating);
  ratingData.set('__csrf', token);

  const rateUrl = getRateUrl(film);
  if (!rateUrl) return;

  fetch(rateUrl, {
      method: 'post',
      body: ratingData
  })
  // .then(response => response.json())
  // .then(response => {
  //     if(response.result){
  //       const filmName = film.querySelector('.linked-film-poster').dataset.filmName;
  //       console.log(filmName + ' was rated ' + rating / 2 + ' stars');
  //     }
  // });
};