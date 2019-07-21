const body = document.getElementsByTagName('body')[0];

const logNewFilm = () => {

    const logButton = document.querySelector('#add-new-button');

    if(logButton !== null){

        logButton.click();

    }

}

const closeModal = () => {

    const closeButton = document.querySelector('#cboxClose');

    if(closeButton != null){

        closeButton.click();

    }

}

const submitReview = () => {

    const reviewWindow = document.querySelector('#modal > #add-film.expanded');
    const confirmWindow = document.querySelector('#confirm-modal');

    if(reviewWindow !== null && confirmWindow === null){

        document.querySelector('#diary-entry-submit-button').click();

    }

}

const deleteReview = () => {

    const reviewWindow = document.querySelector('#modal > #add-film.expanded');
    const confirmWindow = document.querySelector('#confirm-modal');

    if(confirmWindow !== null){

        document.querySelector('.-destructive.right.-red').click();

    }else if(reviewWindow !== null){

        document.querySelector('#diary-entry-delete-button').click();

    }

}


const goToFilm = (film) => {

    const selectedFilm = document.querySelector('.lbs-selected-film');
    const selectedFilmDiary = document.querySelector('.lbs-selected-diary-film');

    if(selectedFilm !== null || selectedFilmDiary !== null){

        if(selectedFilmDiary !== null){

            film = film.querySelector('.linked-film-poster');

        }

        if(film.dataset.targetLink){

            location.href = film.dataset.targetLink;

        }else{

            location.href = film.dataset.filmLink;

        }

    }

}

const handleEnter = (film) => {

    const reviewWindow = document.querySelector('#modal > #add-film.expanded');
    const confirmWindow = document.querySelector('#confirm-modal');

    if(reviewWindow !== null && confirmWindow === null){
        
        submitReview();

    }else{

        goToFilm(film);

    }

}