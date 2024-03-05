class Film {
  static addToList(filmRow) {
    const filmId = filmRow.querySelector('.linked-film-poster').dataset.filmId;
    const addToListButton = Letterboxd.createPopOutMenuButton(filmRow.parentNode, `.menu-item-add-to-list[data-film-id="${filmId}"]`);
    return addToListButton?.click();
  };

  static like(filmRow) {
    const likeButton = filmRow.parentNode.querySelector('.like-link > .ajax-click-action');
    return likeButton?.click();
  };

  static async rate(filmRow, rating) {
    const film = filmRow?.querySelector('.linked-film-poster');
    const rateUrl = Letterboxd.getRateUrl(film);
    const ratedFilm = await Letterboxd.setFilmRating(rateUrl, rating);

    if (ratedFilm?.result) {
      Film.watch(filmRow);
      Notification.rate(film, rating);
    }
  };

  static review(filmRow) {
    const filmId = filmRow.querySelector('.linked-film-poster').dataset.filmId;
    const reviewButton = Letterboxd.createPopOutMenuButton(filmRow.parentNode, `.menu-item-add-this-film[data-film-id="${filmId}"]`);
    return reviewButton?.click()
  };
  
  static watch(filmRow) {
    const watchButton = filmRow.parentNode.querySelector('.film-watch-link > .ajax-click-action');
    return watchButton?.click();
  };

  static watchlistAdd(filmRow) {
    const filmId = filmRow.querySelector('.linked-film-poster').dataset.filmId;
    const addButton = Letterboxd.createPopOutMenuButton(filmRow.parentNode, `.add-to-watchlist[data-film-id="${filmId}"]`);
    return addButton?.click();
  };
  
  static watchlistRemove(filmRow) {
    const filmId = filmRow.querySelector('.linked-film-poster').dataset.filmId;
    const removeButton = Letterboxd.createPopOutMenuButton(filmRow.parentNode, `.remove-from-watchlist[data-film-id="${filmId}"]`);
    return removeButton?.click();
  };

  static watchlistToggle(filmRow) {
    const filmId = filmRow.querySelector('.linked-film-poster').dataset.filmId;
    const notInWatchlist = document.querySelector(`.not-in-watchlist[data-film-id="${filmId}"]`);
    return notInWatchlist ? Film.watchlistAdd(filmRow) : Film.watchlistRemove(filmRow)
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
        Diary.selectFilm();
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
