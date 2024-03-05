const LETTERBOXD_URL = window.location.origin;

const getByFilm = (className, filmId) => document.querySelector(`${className}[data-film-id="${filmId}"]`);

const isFormElement = (element) => element.match(/(input|textarea|select)/);

class Letterboxd {
  static closeModal() {
    const closeButton = document.querySelector('#cboxClose');
    return closeButton?.click();
  };

  static createPopOutMenuButton(film, buttonClass) {
    let button = document.querySelector(buttonClass);

    if (!button){
      const mouseOverEvent = new MouseEvent('mouseover');
      const mouseOutEvent = new MouseEvent('mouseout');
  
      const actionsMenu = film.querySelector('.has-menu');
  
      actionsMenu.dispatchEvent(mouseOverEvent);
      actionsMenu.dispatchEvent(mouseOutEvent);

      button = document.querySelector(buttonClass);
    }

    return button;
  };

  static getRateUrl(element) {
    const rateUrl = element?.dataset?.rateAction;
    return rateUrl && `${LETTERBOXD_URL}${rateUrl}`;
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
  
      location.href = filmItem.dataset.targetLink || filmItem.dataset.filmLink;
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

  static submitReview() {
    const reviewWindow = document.querySelector('#modal > #add-film.expanded');
    const confirmWindow = document.querySelector('#confirm-modal');
  
    if (reviewWindow && !confirmWindow) {
      const submitButton = document.querySelector('#diary-entry-submit-button');
      return submitButton?.click();
    }
  };
}

class Notification {
  static create(content, type = 'success') {
    let container = document.querySelector('.jnotify-container');

    if (!container) {
      container = document.createElement('div');
      container.className = 'jnotify-container';
      document.body.appendChild(container)
    }

    const notification = document.createElement('div');
    notification.className = `jnotify-notification jnotify-notification-${type}`;

    const background = document.createElement('div');
    background.className = 'jnotify-background';

    const closeLink = document.createElement('a');
    closeLink.className = 'jnotify-close';
    closeLink.innerHTML = '×';
    closeLink.addEventListener('click', (e) => {
      const notification = e.target.closest('.jnotify-notification');
      const container = document.querySelector('.jnotify-container');
      container.removeChild(notification)
    });

    const message = document.createElement('div');
    message.className = 'jnotify-message';

    message.innerHTML = content;

    notification.appendChild(background)
    notification.appendChild(closeLink)
    notification.appendChild(message)
    container.appendChild(notification)

    setTimeout(() => {
      container.removeChild(notification);
    }, 5000)
  }

  static like(film) {
    const liked = !film.querySelector('.icon-liked');
    const verb = liked ? 'liked' : 'unliked';
    const type = liked ? 'success' : 'warning';

    const message = `You ${verb} ‘${film?.dataset?.filmName}’.`;

    Notification.create(message, type);
  };

  static rate(film, rating) {
    const verb = rating ? 'rated' : 'unrated';
    const type = rating ? 'success' : 'warning';

    const star = "★";
    const halfStar = "½";
    const starRating = rating > 0 ? Array(Math.floor(rating / 2)).fill(star).join('') + (rating % 2 ? halfStar : '') : '';

    const message = `You ${verb} ‘${film?.dataset?.filmName}’${starRating ? `: ${starRating}` : ''}`;

    Notification.create(message, type);
  };

  static watch(film) {
    const watched = !!film.querySelector('.icon-watched');
    const verb = watched ? 'watched' : 'unwatched';
    const type = watched ? 'success' : 'warning';

    const message = `You ${verb} ‘${film?.dataset?.filmName}’.`

    Notification.create(message, type);
  };
}
