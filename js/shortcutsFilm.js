body.addEventListener('keydown', (e) => {

    const targetElement = e.target.tagName.toLowerCase();

    if(targetElement.match(/(input|textarea|select)/) === null){

        const key = e.key.toLowerCase();
        
        switch(key){
        
            case 'a':                   //Add film to watchlist
                addToWatchlist();
                break;
            case 'l':                   //Like film
                likeFilm();
                break;
            case 'n':                   //Log a new film     
                logNewFilm();
                break;
            case 'r':                   //Review film
                reviewFilm();
                break;
            case 'w':                   //Watch film
                watchFilm();
                break;
            case 'enter':               //Submit review/diary entry
                submitReview();
                break;
            case 'escape':              //Close modal window / Cancel
                closeModal();
                break;
        
        }

    }
    
});
    
const addToWatchlist = () => {

    const watchlistButtons = document.querySelectorAll('.ajax-click-action.-watchlist');

    const addButton = watchlistButtons[0].parentNode.classList.contains('hidden') ? watchlistButtons[1] : watchlistButtons[0];

    addButton.click();

}

const likeFilm = () => {

    const reviewWindow = document.querySelector('#modal > #add-film.expanded');

    if(reviewWindow != null){

        reviewWindow.querySelector('#film-like-checkbox').checked = !reviewWindow.querySelector('#film-like-checkbox').checked;

    }else{

        const likeButton = document.querySelector('#userpanel .ajax-click-action.-like');

        likeButton.click();

    }

}

const reviewFilm = () => {

    const reviewButton = document.querySelector('.add-this-film');

    reviewButton.click();

}

const watchFilm = () => {

    const watchButton = document.querySelector('.ajax-click-action.-watch');

    watchButton.click();

}