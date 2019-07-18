let films, currentFilm, index;
const filmsInRow = 1;

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
            case 'd':
                deleteReview();
                break;
            case 's':
                toggleSelect();
                break;
            case 'arrowright':
            case 'arrowleft':
            case 'arrowup':
            case 'arrowdown':
            case 'a':
            case 'e':            
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

    const selectedFilm = document.querySelector('.lbs-selected-diary-film');

    if(selectedFilm === null){
                                                                                                                                                                    
        films = document.querySelectorAll('.td-film-details');

        if(films !== null){

            index = 0;
            currentFilm = films[index];

            markAsSelected(currentFilm);

        }

    }else{

        selectedFilm.classList.remove('lbs-selected-diary-film');

    }
    
}

const markAsSelected = (currentFilm) => {

    const selectedFilm = document.querySelector('.lbs-selected-diary-film');

    if(selectedFilm !== null){

        selectedFilm.classList.remove('lbs-selected-diary-film');

    }
    currentFilm.classList.add('lbs-selected-diary-film');

}

const filmAction = (e) => {

    const selectedFilm = document.querySelector('.lbs-selected-diary-film');

    if(selectedFilm !== null){

        e.preventDefault();

        const key = e.key.toLowerCase();

        switch(key){
            
            case 'arrowright':
            case 'arrowdown':
                index = index < (films.length - 1) ? index + 1 : index;
                break;
            case 'arrowleft':
            case 'arrowup':
                index = index > 0 ? index - 1 : 0;
                break;
            case 'a':
                addToWatchlist(currentFilm);
                break;
            case 'e':
                editReview(currentFilm);
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

const editReview = (film) => {

    const editButton = film.parentNode.querySelector('.edit-review-button');

    editButton.click();

}

const likeFilm = (film) => {

    const reviewWindow = document.querySelector('#modal > #add-film.expanded');

    if(reviewWindow != null){

        reviewWindow.querySelector('#film-like-checkbox').checked = !reviewWindow.querySelector('#film-like-checkbox').checked;

    }else{

        const likeButton = film.parentNode.querySelector('.like-link > .ajax-click-action');

        likeButton.click();

    }

}

const watchFilm = (film) => {

    const watchButton = film.parentNode.querySelector('.film-watch-link > .ajax-click-action');

    watchButton.click();
    
}

const addToWatchlist = (film) => {

    const filmId = film.querySelector('.linked-film-poster').getAttribute('data-film-id');

    console.log(filmId);

    let addButton = document.querySelector(`.add-to-watchlist[data-film-id="${filmId}"]`);

    console.log(addButton);

    createPopOutMenu(film, addButton);

    console.log(addButton);

    addButton = document.querySelector(`.add-to-watchlist[data-film-id="${filmId}"]`);

    console.log(addButton);

    if(addButton !== null){

        addButton.click();
    
    }

}

const removeFromWatchlist = (film) => {

    const filmId = film.querySelector('.linked-film-poster').getAttribute('data-film-id');

    let removeButton = document.querySelector(`.remove-from-watchlist[data-film-id="${filmId}"]`);

    createPopOutMenu(film, removeButton);

    removeButton = document.querySelector(`.remove-from-watchlist[data-film-id="${filmId}"]`);

    if(removeButton !== null){

        removeButton.click();

    }

}

const reviewFilm = (film) => {

    const filmId = film.querySelector('.linked-film-poster').getAttribute('data-film-id');

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

        const actionsMenu = film.parentNode.querySelector('.has-menu');

        actionsMenu.dispatchEvent(mouseOverEvent);
        actionsMenu.dispatchEvent(mouseOutEvent);

    }

}