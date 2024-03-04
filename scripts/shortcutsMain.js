const token = document.querySelector('input[name="__csrf"]').value;
const body = document.getElementsByTagName('body')[0];

const letterboxdUrl = window.location.origin;

const logNewFilm = () => {
  const logButton = document.querySelector('#add-new-button');
  return logButton && logButton.click();
};

const closeModal = () => {
  const closeButton = document.querySelector('#cboxClose');
  return closeButton && closeButton.click();
};

const submitReview = () => {
  const reviewWindow = document.querySelector('#modal > #add-film.expanded');
  const confirmWindow = document.querySelector('#confirm-modal');

  if (reviewWindow && !confirmWindow) {
    const submitButton = document.querySelector('#diary-entry-submit-button');
    return submitButton && submitButton.click();
  }
};

const deleteReview = () => {
  const reviewWindow = document.querySelector('#modal > #add-film.expanded');
  const confirmWindow = document.querySelector('#confirm-modal');

  if (confirmWindow) {
    const confirmButton = document.querySelector('.-destructive.right.-red')
    return confirmButton && confirmButton.click();
  } else if(reviewWindow) {
    const deleteReviewButton = document.querySelector('#diary-entry-delete-button');
    return deleteReviewButton && deleteReviewButton.click();
  }
};

const goToFilm = (film) => {
  const selectedFilm = document.querySelector('.lbs-selected-film');
  const selectedFilmDiary = document.querySelector('.lbs-selected-diary-film');

  if (selectedFilm || selectedFilmDiary) {
    if (selectedFilmDiary)
      film = film.querySelector('.linked-film-poster');

    if (!film) return;

    location.href = film.dataset.targetLink ? film.dataset.targetLink : film.dataset.filmLink;
  }
};

const handleEnter = (film) => {
  const reviewWindow = document.querySelector('#modal > #add-film.expanded');
  const confirmWindow = document.querySelector('#confirm-modal');
  return reviewWindow && !confirmWindow ? submitReview() : goToFilm(film);
};