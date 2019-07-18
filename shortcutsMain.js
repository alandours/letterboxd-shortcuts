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