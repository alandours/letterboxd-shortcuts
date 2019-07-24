body.addEventListener('keydown', (e) => {

    const targetElement = e.target.tagName.toLowerCase();

    if(targetElement.match(/(input|textarea|select)/) === null){

        const key = e.key.toLowerCase();
        
        switch(key){
        
            case 'a':                   //Add film to watchlist
                addToWatchlist();
                break;
            case 'i':
                addToList();            //Add film to a list
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
            case 'z':                   //Rate film
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
            case '0':
                rateFilm(e, key);
                break;
        
        }

    }
    
});
    
const addToWatchlist = () => {

    const watchlistButtons = document.querySelectorAll('.ajax-click-action.-watchlist');

    const addButton = watchlistButtons[0].parentNode.classList.contains('hidden') ? watchlistButtons[1] : watchlistButtons[0];

    addButton.click();

}

const addToList = () => {

    const addToListButton = document.querySelector('.menu-item-add-to-list');

    addToListButton.click();

}

const likeFilm = () => {

    const reviewWindow = document.querySelector('#modal > #add-film.expanded');

    if(reviewWindow !== null){

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

const rateFilm = (e, rating) => {

    e.preventDefault();

    const filmUrl = document.querySelector('#userpanel .rateit').dataset.rateAction;
    
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

            const starWidth = 18;
            const stars = document.querySelector('#userpanel .rateit-selected');

            stars.style.width = rating * starWidth + 'px';
            
            const label = document.querySelector('#userpanel .rateit-label');

            if(label.innerHTML.toLowerCase() === 'rate' && rating !== 0){
                label.innerHTML = 'Rated';
            }

            const markedAsWatched = document.querySelector('#userpanel .film-watch-link.-watched');

            if(markedAsWatched === null){
                watchFilm();
            }

            if(rating === 0){

                const removeLink = document.querySelector('#userpanel .remove-sidebar-rating');

                removeLink.parentNode.removeChild(removeLink);

                label.innerHTML = 'Rate';

            }

        }

    });

}