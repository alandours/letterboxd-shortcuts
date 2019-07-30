let films, currentFilm, index, indexPrev, filmsInRow;

body.addEventListener('keydown', (e) => {

    const targetElement = e.target.tagName.toLowerCase();

    if(targetElement.match(/(input|textarea|select)/) === null){

        const key = e.key.toLowerCase();
    
        switch(key){
        
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
            case 'a':               //Add film to watchlist
            case 'i':
            case 'l':               //Like film
            case 'r':               //Review film
            case 'w':               //Watch film
            case 'x':               //Remove film from watchlist
            case 'enter':           //Go to film/submit review/diary entry
            case 'z':               //Rate film
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
                filmAction(e);
                break;
        
        }

    }
    
});

const toggleSelect = () => {

    const selectedFilm = document.querySelector('.lbs-selected-film');

    if(selectedFilm === null){

        films = getFilms();

        if(films !== null){

            const filmsContainerSize = films[0].parentNode.parentNode.offsetWidth;
            const filmSize = getFilmSize(films[0]);

            if(document.querySelector('.film-detail-content') || document.querySelector('.review-tile')){

                filmsInRow = 1;

            }else{

                filmsInRow = Math.floor(filmsContainerSize / filmSize);

            }

            index = 0;
            currentFilm = films[index];

            markAsSelected(currentFilm);

        }

    }else{

        selectedFilm.classList.remove('lbs-selected-film');

    }
    
}

const getFilms = () => {

    const films = document.querySelectorAll('.linked-film-poster');

    return [...films].filter(f => !!f.querySelector('.overlay'));

}

const getFilmSize = (film) => {

    return film.offsetWidth + parseFloat(getComputedStyle(film.parentNode).getPropertyValue('margin-left')) + parseFloat(getComputedStyle(film.parentNode).getPropertyValue('margin-right'));

}

const markAsSelected = (currentFilm) => {

    const selectedFilm = document.querySelector('.lbs-selected-film');

    if(selectedFilm !== null){

        selectedFilm.classList.remove('lbs-selected-film');

    }

    currentFilm.querySelector('.overlay').classList.add('lbs-selected-film');

}

const filmAction = (e) => {

    const selectedFilm = document.querySelector('.lbs-selected-film');
    const reviewWindow = document.querySelector('#modal > #add-film.expanded');

    e.preventDefault();

    const key = e.key.toLowerCase();

    if(reviewWindow !== null){

        switch(key){

            case 'l':
                reviewWindow.querySelector('#film-like-checkbox').checked = !reviewWindow.querySelector('#film-like-checkbox').checked;
                break;
            case 'enter':
                submitReview();
                break;
                
        }

    }else if(selectedFilm !== null){

        switch(key){
            
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

        if(e.keyCode >= 35 || e.keyCode <= 40){

            const carouselNav = document.querySelector('#popular-films .carousel-nav');

            if(carouselNav !== null){

                moveCarousel(); //Film carousel in /films
                
            }

            films = getFilms();
        
            currentFilm = films[index];
            markAsSelected(currentFilm);

        }

    }

}

const likeFilm = (film) => {

    const likeButton = film.querySelector('.like-link-target .ajax-click-action');

    likeButton.click();

}

const watchFilm = (film) => {

    const watchButton = film.querySelector('.film-watch-link-target .ajax-click-action');

    watchButton.click();
    
}

const addToWatchlist = (film) => {

    const filmId = film.dataset.filmId;

    let addButton = document.querySelector(`.add-to-watchlist[data-film-id="${filmId}"]`);

    createPopOutMenu(film, addButton);

    addButton = document.querySelector(`.add-to-watchlist[data-film-id="${filmId}"]`);

    if(addButton !== null){

        addButton.click();
    
    }

}

const addToList = (film) => {

    const filmId = film.dataset.filmId;

    let addToListButton = document.querySelector(`.menu-item-add-to-list[data-film-id="${filmId}"]`);

    createPopOutMenu(film, addToListButton);

    addToListButton = document.querySelector(`.menu-item-add-to-list[data-film-id="${filmId}"]`);

    if(addToListButton !== null){

        addToListButton.click();

    }
    
}

const removeFromWatchlist = (film) => {

    const filmId = film.dataset.filmId;

    let removeButton = document.querySelector(`.remove-from-watchlist[data-film-id="${filmId}"]`);

    createPopOutMenu(film, removeButton);

    removeButton = document.querySelector(`.remove-from-watchlist[data-film-id="${filmId}"]`);

    if(removeButton !== null){

        removeButton.click();

    }

}

const reviewFilm = (film) => {

    const filmId = film.dataset.filmId;

    let reviewButton = document.querySelector(`.menu-item-add-this-film[data-film-id="${filmId}"]`);

    createPopOutMenu(film, reviewButton);

    reviewButton = document.querySelector(`.menu-item-add-this-film[data-film-id="${filmId}"]`);

    if(reviewButton !== null){

        reviewButton.click();

    }

}

const createPopOutMenu = (film, button) => {

    if(button === null){

        const mouseOverEvent = new MouseEvent('mouseover');
        const mouseOutEvent = new MouseEvent('mouseout');

        const actionsMenu = film.querySelector('.has-menu');

        actionsMenu.dispatchEvent(mouseOverEvent);
        actionsMenu.dispatchEvent(mouseOutEvent);

    }

}

const moveCarousel = () => {

    switch(index){
        case 4:        //First film of page 2
        case 8:        //First film of page 3
        case 12:       //First film of page 4
        case 16:       //First film of page 5

            if(index > indexPrev){

                document.querySelector('.carousel-next > a').click();

            }
            
            break;
        case 3:        //Last film of page 1
        case 7:        //Last film of page 2
        case 11:       //Last film of page 3
        case 15:       //Last film of page 4

            if(index < indexPrev){

                document.querySelector('.carousel-prev > a').click();

            }
            
            break;
    }

}

const rateFilm = (film, rating) => {

    const filmUrl = film.dataset.rateAction;
    
    rating = rating == 0 ? 10 : rating;
    rating = rating === 'z' ? 0 : rating;

    const ratingData = new FormData();

    ratingData.append('rating', rating);
    ratingData.append('__csrf', token);

    fetch('https://www.letterboxd.com' + filmUrl, {
        method: 'post',
        body: ratingData
    })
    .then(response => response.json())
    .then(response => {

        if(response.result){

            const actionsMenu = film.querySelector('.has-menu');

            const lastIndex = actionsMenu.dataset.originalTitle.lastIndexOf(')');

            const title = actionsMenu.dataset.originalTitle.substring(0, lastIndex + 1);

            let starsTitle = '★'.repeat(Math.floor(rating / 2))

            starsTitle = rating % 2 > 0 ? starsTitle + '½' : starsTitle;

            actionsMenu.dataset.originalTitle = title + ' ' + starsTitle;

        }

    });

}