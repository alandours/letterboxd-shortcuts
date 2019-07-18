let films, currentFilm, index, filmsInRow;

body.addEventListener('keydown', (e) => {

    const targetElement = e.target.tagName.toLowerCase();

    if(targetElement !== 'input' && targetElement !== 'textarea' && targetElement !== 'select'){

        const key = e.key.toLowerCase();
    
        switch(key){
        
            case 'n':
                logNewFilm();
                break;
            case 'enter':
                submitReview();
                break;
            case 'escape':
                closeModal();
                break;
            case 's':
                toggleSelect();
                break;
            case 'arrowright':
            case 'arrowleft':
            case 'arrowup':
            case 'arrowdown':
            case 'a':               
            case 'l':
            case 'r':
            case 'w':
            case 'z':
                filmAction(e);
                break;
        
        }

    }
    
});

const toggleSelect = () => {

    const selectedFilm = document.querySelector('.lbs-selected-film');

    if(selectedFilm === null){
                                                                                                                                                                    
        films = document.querySelectorAll('.linked-film-poster');

        films = [...films].filter(f => !!f.querySelector('.overlay'));

        if(films !== null){

            const filmsContainerSize = films[0].parentNode.parentNode.offsetWidth;
            const filmSize = getFilmSize(films[0]);

            if(document.querySelector('.film-detail-content') || document.querySelector('.review-tile')){

                filmsInRow = 1;

            }else{

                filmsInRow = Math.floor(filmsContainerSize / filmSize);

            }

            console.log(films);

            index = 0;
            currentFilm = films[index];

            markAsSelected(currentFilm);

        }

    }else{

        selectedFilm.classList.remove('lbs-selected-film');

    }
    
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

    console.log(currentFilm);

}

const filmAction = (e) => {

    const selectedFilm = document.querySelector('.lbs-selected-film');

    if(selectedFilm !== null){

        e.preventDefault();

        const key = e.key.toLowerCase();

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
            case 'a':
                addToWatchlist(currentFilm);
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
            case 'z':
                removeFromWatchlist(currentFilm);
                break;

        }

        if(e.keyCode >= 37 || e.keyCode <= 40){
        
            currentFilm = films[index];
            markAsSelected(currentFilm);

        }

    }

}

const likeFilm = (film) => {

    const reviewWindow = document.querySelector('#modal > #add-film.expanded');

    if(reviewWindow != null){

        reviewWindow.querySelector('#film-like-checkbox').checked = !reviewWindow.querySelector('#film-like-checkbox').checked;

    }else{

        const likeButton = film.querySelector('.like-link-target .ajax-click-action');

        likeButton.click();

    }

}

const watchFilm = (film) => {

    const watchButton = film.querySelector('.film-watch-link-target .ajax-click-action');

    watchButton.click();
    
}

const addToWatchlist = (film) => {

    const filmId = film.getAttribute('data-film-id');

    let addButton = document.querySelector(`.add-to-watchlist[data-film-id="${filmId}"]`);

    createPopOutMenu(film, addButton);

    addButton = document.querySelector(`.add-to-watchlist[data-film-id="${filmId}"]`);

    if(addButton !== null){

        addButton.click();
    
    }

}

const removeFromWatchlist = (film) => {

    const filmId = film.getAttribute('data-film-id');

    let removeButton = document.querySelector(`.remove-from-watchlist[data-film-id="${filmId}"]`);

    createPopOutMenu(film, removeButton);

    removeButton = document.querySelector(`.remove-from-watchlist[data-film-id="${filmId}"]`);

    if(removeButton !== null){

        removeButton.click();

    }

}

const reviewFilm = (film) => {

    const filmId = film.getAttribute('data-film-id');

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