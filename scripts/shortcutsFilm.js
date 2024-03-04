body.addEventListener('keydown', (e) => {
  const targetElement = e.target.tagName.toLowerCase();

  if (!targetElement.match(/(input|textarea|select)/)){
    const key = e.key.toLowerCase();

    switch(key){
      case 'a':
        addToWatchlist();
        break;
      case 'i':
        addToList();
        break;
      case 'l':
        likeFilm();
        break;
      case 'n':     
        logNewFilm();
        break;
      case 'r':
        reviewFilm();
        break;
      case 'w':
        watchFilm();
        break;
      case 'enter':             //Submit review/diary entry
        submitReview();
        break;
      case 'escape':            //Close modal window / Cancel
        closeModal();
        break;
      case 'z':                 //Rate film
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
        rateFilm(e, key);
        break;
    }
  }
});
  
const addToWatchlist = () => {
  const watchlistButtons = document.querySelectorAll('.ajax-click-action.-watchlist');
  if (!watchlistButtons.length) return;

  const addButton = watchlistButtons[0].parentNode.classList.contains('hidden') ? watchlistButtons[1] : watchlistButtons[0];
  return addButton && addButton.click();
};

const addToList = () => {
  const addToListButton = document.querySelector('.menu-item-add-to-list');
  return addToListButton && addToListButton.click();
};

const likeFilm = () => {
  const reviewWindow = document.querySelector('#modal > #add-film.expanded');

  if (reviewWindow)
    reviewWindow.querySelector('#film-like-checkbox').checked = !reviewWindow.querySelector('#film-like-checkbox').checked;
  else {
    const likeButton = document.querySelector('#userpanel .ajax-click-action.-like');
    return likeButton && likeButton.click();
  }
};

const reviewFilm = () => {
  const reviewButton = document.querySelector('.add-this-film');
  return reviewButton && reviewButton.click();
};

const watchFilm = () => {
  const watchButton = document.querySelector('.ajax-click-action.-watch');
  return watchButton && watchButton.click();
};

const getRateUrl = () => {
  const rateIt = document.querySelector('#userpanel .rateit');
  const rateUrl = rateIt && rateIt.dataset && rateIt.dataset.rateAction;
  return rateUrl && `${letterboxdUrl}${rateUrl}`;
};

const rateFilm = (e, rating) => {
  e.preventDefault();

  rating = rating == 0 ? 10 : rating;
  rating = rating === 'z' ? 0 : rating;

  const ratingData = new FormData();

  ratingData.set('rating', rating);
  ratingData.set('__csrf', token);

  const rateUrl = getRateUrl();
  if (!rateUrl) return;

  fetch(rateUrl, {
      method: 'POST',
      body: ratingData
  })
  .then(response => response.json())
  .then(response => {
    if(response.result){
      const starWidth = 18;
      const stars = document.querySelector('#userpanel .rateit-selected');

      stars.style.width = rating * starWidth + 'px';
      
      const label = document.querySelector('#userpanel .rateit-label');

      if(label.innerHTML.toLowerCase() === 'rate' && rating !== 0){
        label.innerHTML = 'Rated';
      }

      const markedAsWatched = document.querySelector('#userpanel .film-watch-link.-watched');

      if (!markedAsWatched) watchFilm();

      if (rating === 0) {
        const removeLink = document.querySelector('#userpanel .remove-sidebar-rating');
        removeLink.parentNode.removeChild(removeLink);
        label.innerHTML = 'Rate';
      }
    }
  });
}