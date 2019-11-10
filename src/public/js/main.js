
(async () => {
  const getDoc = sel => document.querySelector(sel)

  // FEEDBACK Modal
  const feedModal = getDoc('.feedback');
  const feedDiv = getDoc('.feedback__div');
  function onFeedDivClick() {
    feedModal.classList.toggle('hidden');
  }
  feedDiv.addEventListener('click', onFeedDivClick);

  // Search Handler
  const searchFormElement = getDoc('.search__form');
  const searchValue = getDoc('.search__bar');

  console.log(searchValue)

  searchValue.addEventListener('change', function(e){
    console.log(e.target.value)
  })

  console.log(searchValue)

  const handleSearch = e => {
    e.preventDefault();

    console.log('insiddee')

    const url = `http://localhost:3000/jobs/search/?q=${searchValue.value}`;
    window.location.replace(url)
    return;
    const Http = new XMLHttpRequest();

    Http.open("GET", url, true);
    Http.send();
    Http.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200){
        console.log('Successfully Issued Query.. loL .. Issues');
      }
    }

    return;
  }
  searchFormElement.addEventListener('submit', handleSearch);
})();
