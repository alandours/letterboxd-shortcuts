class Film {
  static addToList() {
    const addToListButton = document.querySelector('.menu-item-add-to-list');
    return addToListButton?.click();
  };

  static like() {
    const reviewWindow = document.querySelector('#modal > #add-film.expanded');
  
    if (reviewWindow) {
      const likeCheckbox = reviewWindow.querySelector('#film-like-checkbox');
      likeCheckbox.checked = !likeCheckbox.checked;
    } else {
      const likeButton = document.querySelector('#userpanel .ajax-click-action.-like');
      return likeButton?.click();
    }
  };

  static async rate(e, rating) {
    e.preventDefault();

    const rateUrl = Letterboxd.getRateUrl(document.querySelector('#userpanel .rateit'));
    const ratedFilm = await Letterboxd.setFilmRating(rateUrl, rating);

    if (ratedFilm?.result) {
      const starWidth = 18;
      const stars = document.querySelector('#userpanel .rateit-selected');

      stars.style.width = rating * starWidth + 'px';
      
      const label = document.querySelector('#userpanel .rateit-label');

      if (label.innerHTML.toLowerCase() === 'rate' && rating !== 0) {
        label.innerHTML = 'Rated';
      }

      const markedAsWatched = document.querySelector('#userpanel .film-watch-link.-watched');

      if (!markedAsWatched) Film.watch();

      if (rating === 0) {
        const removeLink = document.querySelector('#userpanel .remove-sidebar-rating');
        removeLink.parentNode.removeChild(removeLink);
        label.innerHTML = 'Rate';
      }
    }
  }

  static review() {
    const reviewButton = document.querySelector('.add-this-film');
    return reviewButton?.click();
  };

  static watch() {
    const watchButton = document.querySelector('.ajax-click-action.-watch');
    return watchButton?.click();
  };

  static watchlistToggle() {
    const watchlistButtons = document.querySelectorAll('.ajax-click-action.-watchlist');
    if (!watchlistButtons.length) return;
  
    const addButton = watchlistButtons[0].parentNode.classList.contains('hidden') ? watchlistButtons[1] : watchlistButtons[0];
    return addButton?.click();
  };
}

document.body.addEventListener('keydown', (e) => {
  const targetElement = e.target.tagName.toLowerCase();

  if (!isFormElement(targetElement)){
    const key = e.key.toLowerCase();

    switch(key){
      case 'a':
        Film.watchlistToggle();
        break;
      case 'i':
        Film.addToList();
        break;
      case 'l':
        Film.like();
        break;
      case 'n':     
        Letterboxd.logNewFilm();
        break;
      case 'r':
        Film.review();
        break;
      case 'w':
        Film.watch();
        break;
      case 'enter':
        // Submit review/diary entry
        Letterboxd.submitReview();
        break;
      case 'escape':
        Letterboxd.closeModal();
        break;
      case 'z':
        Film.rate(e, 0);
        break;
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
        Film.rate(e, Number(key));
        break;
      case '0':
        Film.rate(e, 10);
        break;
    }
  }
});
