let films, currentFilm, index, indexPrev, filmsInRow;

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
      case 's':               //Select/deselect films
        toggleSelect();
        break;
      case 'arrowright':      //Navigate films
      case 'arrowleft':
      case 'arrowup':
      case 'arrowdown':
      case 'home':
      case 'end':
        indexPrev = index;
      default:
        filmAction(e, key);
        break;
    }
  }
});

const filmAction = (e, key) => {
  const selectedFilm = document.querySelector('.lbs-selected-film');
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
        index = index < (films.length - 1) ? index + 1 : index;
        break;
      case 'arrowleft':
        index = index > 0 ? index - 1 : 0;
        break;
      case 'arrowup':
        index = (index - filmsInRow) >= 0 ? index - filmsInRow : index;
        break;
      case 'arrowdown':
        index = (index + filmsInRow) <= (films.length - 1) ? index + filmsInRow : index;
        break;
      case 'home':
        index = 0;
        break;
      case 'end':
        index = films.length;
        break;
      case 'a':
        addToWatchlist(currentFilm);
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
      case '6':
      case '7':
      case '8':
      case '9':
      case '0':
        rateFilm(currentFilm, key);
        break;
    }

    if (e.keyCode >= 35 || e.keyCode <= 40) {
      const carouselNav = document.querySelector('#popular-films .carousel-nav');

      if (carouselNav)
        moveCarousel(); //Film carousel in /films

      films = getFilms();
  
      currentFilm = films[index];
      markAsSelected(currentFilm);
    }
  }
};

const toggleSelect = () => {
  const selectedFilm = document.querySelector('.lbs-selected-film');

  if (!selectedFilm) {
    films = getFilms();

    if (films.length) {
      const filmsContainerSize = films[0].parentNode.parentNode.offsetWidth;
      const filmSize = getFilmSize(films[0]);

      if (document.querySelector('.film-detail-content') || document.querySelector('.review-tile'))
        filmsInRow = 1;
      else
        filmsInRow = Math.floor(filmsContainerSize / filmSize);

      index = 0;
      currentFilm = films[index];

      markAsSelected(currentFilm);
    }
  } else
    selectedFilm.classList.remove('lbs-selected-film');
};

const getFilms = () => {
  const films = document.querySelectorAll('.linked-film-poster');
  return films.length ? [...films].filter(f => !!f.querySelector('.overlay')) : [];
};

const getFilmSize = (film) => {
  return film.offsetWidth + parseFloat(getComputedStyle(film.parentNode).getPropertyValue('margin-left')) + parseFloat(getComputedStyle(film.parentNode).getPropertyValue('margin-right'));
};

const markAsSelected = (currentFilm) => {
  const selectedFilm = document.querySelector('.lbs-selected-film');

  if (selectedFilm)
    selectedFilm.classList.remove('lbs-selected-film');

  currentFilm.querySelector('.overlay').classList.add('lbs-selected-film');
};

const likeFilm = (film) => {
  const likeButton = film.querySelector('.like-link-target .ajax-click-action');
  return likeButton && likeButton.click();
};

const watchFilm = (film) => {
  const watchButton = film.querySelector('.film-watch-link-target .ajax-click-action');
  return watchButton && watchButton.click();
};

const addToWatchlist = (film) => {
  const filmId = film.dataset.filmId;

  let addButton = document.querySelector(`.add-to-watchlist[data-film-id="${filmId}"]`);

  createPopOutMenu(film, addButton);

  addButton = document.querySelector(`.add-to-watchlist[data-film-id="${filmId}"]`);
  return addButton &&addButton.click();
};

const addToList = (film) => {
  const filmId = film.dataset.filmId;

  let addToListButton = document.querySelector(`.menu-item-add-to-list[data-film-id="${filmId}"]`);

  createPopOutMenu(film, addToListButton);

  addToListButton = document.querySelector(`.menu-item-add-to-list[data-film-id="${filmId}"]`);
  return addToListButton && addToListButton.click(); 
};

const removeFromWatchlist = (film) => {
  const filmId = film.dataset.filmId;

  let removeButton = document.querySelector(`.remove-from-watchlist[data-film-id="${filmId}"]`);

  createPopOutMenu(film, removeButton);

  removeButton = document.querySelector(`.remove-from-watchlist[data-film-id="${filmId}"]`);
  return removeButton && removeButton.click();
};

const reviewFilm = (film) => {
  const filmId = film.dataset.filmId;

  let reviewButton = document.querySelector(`.menu-item-add-this-film[data-film-id="${filmId}"]`);

  createPopOutMenu(film, reviewButton);

  reviewButton = document.querySelector(`.menu-item-add-this-film[data-film-id="${filmId}"]`);
  return reviewButton && reviewButton.click();
};

const createPopOutMenu = (film, button) => {
  if (!button){
    const mouseOverEvent = new MouseEvent('mouseover');
    const mouseOutEvent = new MouseEvent('mouseout');

    const actionsMenu = film.querySelector('.has-menu');

    actionsMenu.dispatchEvent(mouseOverEvent);
    actionsMenu.dispatchEvent(mouseOutEvent);
  }
};

const moveCarousel = () => {
  switch(index) {
    case 4:        //First film of page 2
    case 8:        //First film of page 3
    case 12:       //First film of page 4
    case 16:       //First film of page 5
      if (index > indexPrev) document.querySelector('.carousel-next > a').click();
      break;
    case 3:        //Last film of page 1
    case 7:        //Last film of page 2
    case 11:       //Last film of page 3
    case 15:       //Last film of page 4
      if (index < indexPrev) document.querySelector('.carousel-prev > a').click();
      break;
  }
};

const getRateUrl = (film) => {
  const rateUrl = film && film.dataset && film.dataset.rateAction;
  return rateUrl && `${letterboxdUrl}${rateUrl}`;
};

const updateTooltipRating = (film, rating) => {
  const actionsMenu = film.querySelector('.has-menu');

  if (actionsMenu && actionsMenu.dataset.originalTitle) {
    const lastIndex = actionsMenu.dataset.originalTitle.lastIndexOf(')');
    const title = actionsMenu.dataset.originalTitle.substring(0, lastIndex + 1);
    let starsTitle = '★'.repeat(Math.floor(rating / 2));
    starsTitle = rating % 2 > 0 ? starsTitle + '½' : starsTitle;
    actionsMenu.dataset.originalTitle = `${title} ${starsTitle}`;
  }
};

const updateGridRating = (film, rating) => {
  const gridRating = film.parentNode.querySelector('.poster-viewingdata.-rated-and-liked > .rating');
      
  if (gridRating) {
    const oldRating = gridRating.className.match(/rated-\d+/);
    gridRating.classList.remove(oldRating);
    gridRating.classList.add(`rated-${rating}`);
  }
};

const rateFilm = (film, rating) => {
  rating = rating == 0 ? 10 : rating;
  rating = rating === 'z' ? 0 : rating;

  const ratingData = new FormData();

  ratingData.append('rating', rating);
  ratingData.append('__csrf', token);

  const rateUrl = getRateUrl(film);
  if (!rateUrl) return;

  fetch(rateUrl, {
      method: 'post',
      body: ratingData
  })
  .then(response => response.json())
  .then(response => {
    if(response.result){
      updateTooltipRating(film, rating);
      updateGridRating(film, rating);
    }
  });
}