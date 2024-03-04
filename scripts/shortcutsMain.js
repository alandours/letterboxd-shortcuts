const LETTERBOXD_URL = window.location.origin;

const getByFilm = (className, filmId) => document.querySelector(`${className}[data-film-id="${filmId}"]`);

const isFormElement = (element) => element.match(/(input|textarea|select)/);

class Letterboxd {
  static closeModal() {
    const closeButton = document.querySelector('#cboxClose');
    return closeButton?.click();
  };

  static createPopOutMenu(film, button) {
    if (!button){
      const mouseOverEvent = new MouseEvent('mouseover');
      const mouseOutEvent = new MouseEvent('mouseout');
  
      const actionsMenu = film.querySelector('.has-menu');
  
      actionsMenu.dispatchEvent(mouseOverEvent);
      actionsMenu.dispatchEvent(mouseOutEvent);
    }
  };

  static async setFilmRating(url, rating) {
    if (!url || rating < 0 || rating > 10) return;

    const token = document.querySelector('input[name="__csrf"]').value;
    const ratingData = new FormData();
  
    ratingData.set('rating', rating);
    ratingData.set('__csrf', token);

    const response = await fetch(url, {
      method: 'POST',
      body: ratingData
    });

    const jsonResponse = await response.json();

    return jsonResponse;
  }

  static goToFilm(film) {
    const selectedFilm = document.querySelector('.lbs-selected-film');
    const selectedFilmDiary = document.querySelector('.lbs-selected-diary-film');
  
    if (selectedFilm || selectedFilmDiary) {
      let filmItem = film;

      if (selectedFilmDiary) {
        filmItem = film.querySelector('.linked-film-poster');
      }
  
      if (!filmItem) return;
  
      location.href = film.dataset.targetLink || film.dataset.filmLink;
    }
  };

  static handleEnter(film) {
    const reviewWindow = document.querySelector('#modal > #add-film.expanded');
    const confirmWindow = document.querySelector('#confirm-modal');
    return reviewWindow && !confirmWindow ? Letterboxd.submitReview() : Letterboxd.goToFilm(film);
  };

  static logNewFilm() {
    const logButton = document.querySelector('#add-new-button');
    return logButton?.click();
  };

  static submitReview() {
    const reviewWindow = document.querySelector('#modal > #add-film.expanded');
    const confirmWindow = document.querySelector('#confirm-modal');
  
    if (reviewWindow && !confirmWindow) {
      const submitButton = document.querySelector('#diary-entry-submit-button');
      return submitButton?.click();
    }
  };
}

