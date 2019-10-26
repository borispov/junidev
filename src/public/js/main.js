
(async () => {

  const feedModal = document.querySelector('.feedback');
  const feedDiv = document.querySelector('.feedback__div');

  function onFeedDivClick() {
    feedModal.classList.toggle('hidden');
  }

  feedDiv.addEventListener('click', onFeedDivClick);

})();
