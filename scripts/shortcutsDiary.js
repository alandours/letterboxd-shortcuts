class Film {
  static addToList(film) {
    const filmId = film.querySelector('.linked-film-poster').dataset.filmId;
    const addToListButton = document.querySelector(`.menu-item-add-to-list[data-film-id="${filmId}"]`);
    Letterboxd.createPopOutMenu(film, addToListButton);
    return addToListButton?.click();
  };

  static like(film) {
    const likeButton = film.parentNode.querySelector('.like-link > .ajax-click-action');
    return likeButton?.click();
  };

  static async rate(film, rating) {
    const rateUrl = Letterboxd.getRateUrl(film?.querySelector('.linked-film-poster'));
    const ratedFilm = await Letterboxd.setFilmRating(rateUrl, rating);

    if (ratedFilm?.result) {
      // const filmName = film.querySelector('.linked-film-poster').dataset.filmName;
      // console.log(filmName + ' was rated ' + rating / 2 + ' stars');
    }
  };

  static review(film) {
    const filmId = film.querySelector('.linked-film-poster').dataset.filmId;
    const reviewButton = document.querySelector(`.menu-item-add-this-film[data-film-id="${filmId}"]`);
    Letterboxd.createPopOutMenu(film, reviewButton);
    return reviewButton?.click()
  };
  
  static watch(film) {
    const watchButton = film.parentNode.querySelector('.film-watch-link > .ajax-click-action');
    return watchButton?.click();
  };

  static watchlistAdd(film) {
    const filmId = film.querySelector('.linked-film-poster').dataset.filmId;
    const addButton = document.querySelector(`.add-to-watchlist[data-film-id="${filmId}"]`);
    Letterboxd.createPopOutMenu(film, addButton);
    return addButton?.click();
  };
  
  static watchlistRemove(film) {
    const filmId = film.querySelector('.linked-film-poster').dataset.filmId;
    const removeButton = document.querySelector(`.remove-from-watchlist[data-film-id="${filmId}"]`);
    Letterboxd.createPopOutMenu(film, removeButton);
    return removeButton?.click();
  };

  static watchlistToggle(film) {
    const filmId = film.querySelector('.linked-film-poster').dataset.filmId;
    const notInWatchlist = getByFilm('.not-in-watchlist', filmId);
    return notInWatchlist ? Film.watchlistAdd(film) : Film.watchlistRemove(film)
  }
}

class Diary {
  static films;
  static selectedFilm;
  static filmIndex;

  static action(e, key) {
    const selectedFilm = document.querySelector('.lbs-selected-diary-film');
    const reviewWindow = document.querySelector('#modal > #add-film.expanded');
  
    if (reviewWindow) {
      e.preventDefault();

      switch(key) {
        case 'l':
          const likeCheckbox = reviewWindow.querySelector('#film-like-checkbox');
          likeCheckbox.checked = !likeCheckbox.checked;
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
          Diary.filmIndex = Diary.filmIndex < (Diary.films.length - 1) ? Diary.filmIndex + 1 : Diary.filmIndex;
          break;
        case 'arrowleft':
        case 'arrowup':
          Diary.filmIndex = Diary.filmIndex > 0 ? Diary.filmIndex - 1 : 0;
          break;
        case 'a':
          Film.watchlistToggle(Diary.selectedFilm);
          break;
        case 'e':
          Diary.editReview(Diary.selectedFilm);
          break;
        case 'i':
          Film.addToList(Diary.selectedFilm);
          break;
        case 'l':
          Film.like(Diary.selectedFilm);
          break;
        case 'r':
          Film.review(Diary.selectedFilm);
          break;
        case 'w':
          Film.watch(Diary.selectedFilm);
          break;
        case 'x':
          Film.watchlistRemove(Diary.selectedFilm);
          break;
        case 'enter':
          Letterboxd.handleEnter(Diary.selectedFilm);
          break;
        case 'z':
          Film.rate(Diary.selectedFilm, 0);
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
          Film.rate(Diary.selectedFilm, Number(key));
          break;
        case '0':
          Film.rate(Diary.selectedFilm, key);
          break;
      }
  
      if (e.keyCode >= 37 || e.keyCode <= 40) {
        Diary.selectedFilm = Diary.films[Diary.filmIndex];
        Diary.selectFilm(Diary.selectedFilm);
      }
    }
  };

  static deleteReview() {
    const reviewWindow = document.querySelector('#modal > #add-film.expanded');
    const confirmWindow = document.querySelector('#confirm-modal');
  
    if (confirmWindow) {
      const confirmButton = document.querySelector('.-destructive.right.-red')
      return confirmButton?.click();
    } else if (reviewWindow) {
      const deleteReviewButton = document.querySelector('#diary-entry-delete-button');
      return deleteReviewButton?.click();
    }
  };

  static editReview(film) {
    const editButton = film.parentNode.querySelector('.edit-review-button');
    return editButton?.click();
  };

  static selectFilm() {
    const selectedFilm = document.querySelector('.lbs-selected-diary-film');
  
    if (selectedFilm) {
      selectedFilm.classList.remove('lbs-selected-diary-film');
    }
  
    Diary.selectedFilm.classList.add('lbs-selected-diary-film');
  };
  
  static toggleSelect() {
    const selectedFilm = document.querySelector('.lbs-selected-diary-film');

    if (selectedFilm) {
      selectedFilm.classList.remove('lbs-selected-diary-film');
    } else {
      Diary.films = document.querySelectorAll('.td-film-details');
  
      if (Diary.films.length) {
        Diary.filmIndex = 0;
        Diary.selectedFilm = Diary.films[Diary.filmIndex];
        Diary.selectFilm(Diary.selectedFilm);
      }
    }
  };
}

document.body.addEventListener('keydown', (e) => {
  const targetElement = e.target.tagName.toLowerCase();

  if (!isFormElement(targetElement)) {
    const key = e.key.toLowerCase();

    switch(key) {
      case 'n':
        Letterboxd.logNewFilm();
        break;
      case 'escape':
        Letterboxd.closeModal();
        break;
      case 'd':
      case 'delete':
        // Delete review/diary entry / Confirm deletion
        Diary.deleteReview();
        break;
      case 's':
        // Select/deselect films
        Diary.toggleSelect();
        break;
      default:
        Diary.action(e, key);
        break;
    }
  }
});
