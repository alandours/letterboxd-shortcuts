class Film {
  static addToList(film) {
    const buttonClass = `.menu-item-add-to-list[data-film-id="${film.dataset.filmId}"]`;
    const addToListButton = Letterboxd.createPopOutMenuButton(film, buttonClass);
    return addToListButton?.click(); 
  }

  static like(film) {
    const likeButton = film.querySelector('.like-link-target .ajax-click-action');
    likeButton?.click();
    Notification.like(film);
  }

  static async rate(film, rating) {
    const rateUrl = Letterboxd.getRateUrl(film);
    const ratedFilm = await Letterboxd.setFilmRating(rateUrl, rating);

    if (ratedFilm?.result) {
      Grid.updateTooltipRating(film, rating);
      Grid.updateGridRating(film, rating);
      Notification.rate(film, rating)
    }
  }

  static review(film) {
    const buttonClass = `.menu-item-add-this-film[data-film-id="${film.dataset.filmId}"]`;
    const reviewButton = Letterboxd.createPopOutMenuButton(film, buttonClass);
    return reviewButton?.click();
  }

  static watch(film) {
    const watchButton = film.querySelector('.film-watch-link-target .ajax-click-action');
    watchButton?.click();
    Notification.watch(film);
  }

  static watchlistAdd(film) {
    const buttonClass = `.add-to-watchlist[data-film-id="${film.dataset.filmId}"]`;
    const addButton = Letterboxd.createPopOutMenuButton(film, buttonClass);
    return addButton?.click();
  }

  static  watchlistRemove(film) {
    const buttonClass = `.remove-from-watchlist[data-film-id="${film.dataset.filmId}"]`;
    const removeButton = Letterboxd.createPopOutMenuButton(film, buttonClass);
    return removeButton?.click();
  }

  static watchlistToggle(film) {
    const notInWatchlist = document.querySelector(`.not-in-watchlist[data-film-id="${film.dataset.filmId}"]`);
    return notInWatchlist ? Film.watchlistAdd(film) : Film.watchlistRemove(film)
  }
}

class Grid {
  static selectedFilm;
  static filmIndex;
  static filmPrevIndex;
  static films;
  static filmsPerRow;

  static action(e, key) {
    const selectedFilm = document.querySelector('.lbs-selected-film');
    const reviewWindow = document.querySelector('#modal > #add-film.expanded');
  
    if (reviewWindow) {
      e.preventDefault();
  
      switch(key) {
        case 'l':
          const likeCheckbox = reviewWindow.querySelector('#film-like-checkbox');
          likeCheckbox.checked = !likeCheckbox.checked;
          break;
        case 'enter':
          Letterboxd.submitReview();
          break;
      }
    } else if (selectedFilm) {
      e.preventDefault();
  
      switch(key) {
        case 'arrowright':
          Grid.filmIndex = Grid.filmIndex < (Grid.films.length - 1) ? Grid.filmIndex + 1 : Grid.filmIndex;
          break;
        case 'arrowleft':
          Grid.filmIndex = Grid.filmIndex > 0 ? Grid.filmIndex - 1 : 0;
          break;
        case 'arrowup':
          Grid.filmIndex = (Grid.filmIndex - Grid.filmsPerRow) >= 0 ? Grid.filmIndex - Grid.filmsPerRow : Grid.filmIndex;
          break;
        case 'arrowdown':
          Grid.filmIndex = (Grid.filmIndex + Grid.filmsPerRow) <= (Grid.films.length - 1) ? Grid.filmIndex + Grid.filmsPerRow : Grid.filmIndex;
          break;
        case 'home':
          Grid.filmIndex = 0;
          break;
        case 'end':
          Grid.filmIndex = Grid.films.length;
          break;
        case 'a':
          Film.watchlistToggle(Grid.selectedFilm);
          break;
        case 'i':
          Film.addToList(Grid.selectedFilm);
          break;
        case 'l':
          Film.like(Grid.selectedFilm);
          break;
        case 'r':
          Film.review(Grid.selectedFilm);
          break;
        case 'w':
          Film.watch(Grid.selectedFilm);
          break;
        case 'x':
          Film.watchlistRemove(Grid.selectedFilm);
          break;
        case 'enter':
          Letterboxd.handleEnter(Grid.selectedFilm);
          break;
        case 'z':
          Film.rate(Grid.selectedFilm, 0);
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          Film.rate(Grid.selectedFilm, Number(key));
          break;
        case '0':
          Film.rate(Grid.selectedFilm, 10);
          break;
      }
  
      if (e.keyCode >= 35 || e.keyCode <= 40) {
        const carouselNav = document.querySelector('#popular-films .carousel-nav');
  
        if (carouselNav) {
          // Film carousel in /films
          Grid.moveCarousel(); 
        }
  
        Grid.films = Grid.getFilms();
    
        Grid.selectedFilm = Grid.films[Grid.filmIndex];
        Grid.selectFilm(Grid.selectedFilm);
      }
    }
  }

  static getFilms() {
    const filmsItems = document.querySelectorAll('.linked-film-poster');
    return filmsItems.length ? [...filmsItems].filter(f => !!f.querySelector('.overlay')) : [];
  };

  static getFilmSize(film) {
    return film.offsetWidth + parseFloat(getComputedStyle(film.parentNode).getPropertyValue('margin-left')) + parseFloat(getComputedStyle(film.parentNode).getPropertyValue('margin-right'));
  };

  static moveCarousel() {
    switch(Grid.filmIndex) {
      case 4:
      case 8:
      case 12:
      case 16:
        // First film of page 2, 3, 4, 5
        if (Grid.filmIndex > Grid.filmPrevIndex) {
          document.querySelector('.carousel-next > a').click();
        }
        break;
      case 3:
      case 7:
      case 11:
      case 15:
        // Last film of page 1, 2, 3, 4
        if (Grid.filmIndex < Grid.filmPrevIndex) {
          document.querySelector('.carousel-prev > a').click();
        }
        break;
    }
  };

  static selectFilm() {
    const selectedFilm = document.querySelector('.lbs-selected-film');
  
    if (selectedFilm) {
      selectedFilm.classList.remove('lbs-selected-film');
    }
  
    Grid.selectedFilm.querySelector('.overlay').classList.add('lbs-selected-film');
  };

  static toggleSelect() {
    const selectedFilm = document.querySelector('.lbs-selected-film');

    if (selectedFilm) {
      selectedFilm.classList.remove('lbs-selected-film');
    } else {
      Grid.films = Grid.getFilms();
  
      if (Grid.films.length) {
        const filmsContainerSize = Grid.films[0].parentNode.parentNode.offsetWidth;
        const filmSize = Grid.getFilmSize(Grid.films[0]);
  
        if (document.querySelector('.film-detail-content') || document.querySelector('.review-tile')) {
          Grid.filmsPerRow = 1;
        } else {
          Grid.filmsPerRow = Math.floor(filmsContainerSize / filmSize);
        }
  
        Grid.filmIndex = 0;
        Grid.selectedFilm = Grid.films[Grid.filmIndex];
        Grid.selectFilm();
      }
    }
  }

  static updateGridRating(film, rating) {
    const gridRating = film.parentNode.querySelector('.poster-viewingdata.-rated-and-liked > .rating');
        
    if (gridRating) {
      const oldRating = gridRating.className.match(/rated-\d+/);
      gridRating.classList.remove(oldRating);
      gridRating.classList.add(`rated-${rating}`);
    }
  };

  static updateTooltipRating(film, rating) {
    const actionsMenu = film.querySelector('.has-menu');
  
    if (actionsMenu && actionsMenu.dataset.originalTitle) {
      const lastIndex = actionsMenu.dataset.originalTitle.lastIndexOf(')');
      const title = actionsMenu.dataset.originalTitle.substring(0, lastIndex + 1);
      let starsTitle = '★'.repeat(Math.floor(rating / 2));
      starsTitle = rating % 2 > 0 ? starsTitle + '½' : starsTitle;
      actionsMenu.dataset.originalTitle = `${title} ${starsTitle}`;
    }
  };
}

document.body.addEventListener('keydown', (e) => {
  const targetElement = e.target.tagName.toLowerCase();
  const key = e.key.toLowerCase();

  if (!isFormElement(targetElement)) {
    switch(key) {
      case 'n':
        Letterboxd.logNewFilm();
        break;
      case 'escape':  
        Letterboxd.closeModal();
        break;
      case 's':        
        Grid.toggleSelect();
        break;
      case 'arrowright':     
      case 'arrowleft':
      case 'arrowup':
      case 'arrowdown':
      case 'home':
      case 'end':
        // Navigate grid films
        Grid.filmPrevIndex = Grid.filmIndex;
      default:
        Grid.action(e, key);
        break;
    }
  }
});
