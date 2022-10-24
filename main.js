// Kinolar ro'yxatini DOM dan olib topib oldik
const genres = [];

// DOM ga oid elementlarni olib kelish
const elFormSearch = document.querySelector(".search-form");
const elFormSearchFromYearInput = elFormSearch.querySelector(".from__year");
const elFormSearchToYearInput = elFormSearch.querySelector(".to__year");
const elFormSearchInput = elFormSearch.querySelector(".search-input");
const elSortSelect = elFormSearch.querySelector('.genres-select');
const elSortMovies = elFormSearch.querySelector('.sortAllmovies');
const elNetStatusAlert = document.querySelector(".status")
const elMoviesList = document.querySelector(".movies__list");
const elSavedMoviesButton = document.querySelector(".saved");
const elLists = document.querySelector(".lists");


const savedMovies = JSON.parse(localStorage.getItem('movies')) || [];

const movies = fullMovies;



// MODAL elements

const elModal = document.querySelector(".modal");
const elModalTitle = elModal.querySelector(".movie-info-modal__title");
const elModalRating = elModal.querySelector(".movie-info-modal__rating");
const elModalYear = elModal.querySelector(".movie-info-modal__year");
const elModalDuration = elModal.querySelector(".movie-info-modal__duration");
const elModalYouTubeIframe = elModal.querySelector(".movie-info-modal__iframe");
const elModalCotegory = elModal.querySelector(".movie-info-modal__categories");
const elModalSummary = elModal.querySelector(".movie-info-modal__summary");
const elModalImDbId = elModal.querySelector(".movie-info-modal__imdb-link");


// Template ya'ni Qolibni DOM dan topib oldik
const elMoviesListTemplate = document.querySelector("#movies-item-template").content;

// Soat va Minutni hisoblovchi funksiya yaratdik
function getHoursAndMinuts(minut) {
  
  let hours = Math.floor(minut / 60);
  let minuts = Math.floor(minut % 60);
  
  return `${hours} hrs ${minuts} min`;
}

function genresList() {
  
  fullMovies.forEach(film => {
    const genresMovies = film.categories;
    
    genresMovies.forEach(category => {
      if (!genres.includes(category)) {
        genres.push(category);
      }
    });
  });
  genres.sort();
}


function showMoviesGenresOption() {
  
  const newSelectFragment = document.createDocumentFragment();
  
  genres.forEach(genre => {
    
    const newMoviesOption = document.createElement("option");
    
    newMoviesOption.textContent = genre;
    newMoviesOption.value = genre;
    newSelectFragment.appendChild(newMoviesOption);
  });
  elSortSelect.appendChild(newSelectFragment);
}

function skeleton() {
  if (navigator.onLine) {
    setTimeout(() => {
      // items.style.display = "none";
      elNetStatusAlert.classList.add("d-none");
    }, 1);
  }else if (navigator.offLine ){
    // content.style.display = "none";
    elNetStatusAlert.classList.add("d-block");
    // items.classList.remove("d-none");
    // setInterval(() => { window.location.reload()}, 4000)
  }
}

skeleton();


function makeRequest(data) {
  setTimeout(() => {
    fetch(`${data}`)
    .then(response => {
      if (response.ok()){
        return response.json();
      }
      
    })
    .then(data => {
      data.img;

      console.log(data)
    
    })
    .catch(err => {
      console.log(err, "Yes this error");
    });
  }, 3500);
}


// Kinolarni sahifaga chiqaruvchi funksiy yaratdik
function showMovies(movie, element) {
  
  element.innerHTML = "";
  
  const moviesFragment = document.createDocumentFragment();
  
  for (const kino of movie) {
    
    
    // Qolibni ichidagi hamma elemnetlarni olib berish uchun yozilgan code
    const moviesCloneTemplate = elMoviesListTemplate.cloneNode(true);
    // moviesCloneTemplate.querySelector(".movies__item").dataset.imdbId = kino.imdbId;
    
    moviesCloneTemplate.querySelector(".movie__img").src = kino.youtubePoster;
    // makeRequest(kino.youtubePoster);




    // console.log(kino.youtubePoster);
    moviesCloneTemplate.querySelector(".movie__title").textContent = kino.title;
    moviesCloneTemplate.querySelector(".movie__title").dataset.imdb = kino.imdbId;
    moviesCloneTemplate.querySelector(".movie__rating").textContent = kino.imdbRating;
    moviesCloneTemplate.querySelector(".movie__year").textContent = kino.year;
    moviesCloneTemplate.querySelector(".movie__duration").textContent = getHoursAndMinuts(kino.runtime);
    moviesCloneTemplate.querySelector(".movie__categories").textContent = kino.categories.join(", ");
    moviesCloneTemplate.querySelector(".js-more-info-button").dataset.imdbId = kino.imdbId;
    moviesCloneTemplate.querySelector(".bookmarkButton").dataset.imdbId = kino.imdbId;
    moviesCloneTemplate.querySelector(".bookmark__delete").dataset.imdbId = kino.imdbId;
    
    moviesFragment.appendChild(moviesCloneTemplate);
  }
  element.appendChild(moviesFragment);
}


function showModalInfo(movieId) {
  let findMovie = fullMovies.find(function (element) {
    return element.imdbId === movieId;
  })
  
  elModalTitle.textContent = findMovie.title;
  elModalRating.textContent = findMovie.imdbRating;
  elModalYear.textContent = findMovie.year;
  elModalDuration.textContent = getHoursAndMinuts(findMovie.runtime);
  elModalYouTubeIframe.src = `https://www.youtube-nocookie.com/embed/${findMovie.youtubeId}`;
  elModalCotegory.textContent = findMovie.categories.join(", ");
  elModalSummary.textContent = findMovie.summary;
  elModalImDbId.href = `https://www.imdb.com/title/${findMovie.imdbId}`
  
}


function showSearchMovies(items) {
  
  return fullMovies.filter(movie => {
    
    const result = movie.title.match(items) && (elSortSelect.value === "All" ||
    movie.categories.includes(elSortSelect.value)) && (elFormSearchFromYearInput.value.trim() === "" || movie.year >= Number(elFormSearchFromYearInput.value)) && (elFormSearchToYearInput.value.trim() === "" || movie.year <= Number(elFormSearchToYearInput.value));
    
    return result;
  });
}




function sortingAllMovies(sortedArray, sortingValue) {
  if (sortingValue === "high") {
    sortedArray.sort((a, b) => b.imdbRating - a.imdbRating);
  }
  else if (sortingValue === "a-z") {
    sortedArray.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0));
  }
  else if  (sortingValue === "low") {
    sortedArray.sort((a, b) => b.imdbRating - a.imdbRating);
  }
  else if (sortingValue === "newest-year") {
    sortedArray.sort((a, b) => a.year - b.year);
  }
  else if (sortingValue === "oldest-year") {
    sortedArray.sort((a, b) => b.year - a.year);
  }
}

elFormSearch.addEventListener("submit", function (evt) {
  evt.preventDefault();
  
  const searchElement = new RegExp(elFormSearchInput.value.trim(), 'gi');
  
  const searchMovieFilteredList = showSearchMovies(searchElement);
  
  if (searchMovieFilteredList.length > 0) {
    sortingAllMovies(searchMovieFilteredList, elSortMovies.value)
    showMovies(searchMovieFilteredList, elMoviesList);
  } else {
    alert("Movie not found")
  }
  
});


// Event Delegation
elMoviesList.addEventListener("click", function (evt) {
  
  if (evt.target.matches(".js-more-info-button")) {
    showModalInfo(evt.target.dataset.imdbId);
  }
  
  
  const bookmark = evt.target.matches(".bookmarkButton");
  if (bookmark) {
    
    let item = evt.target.getAttribute("data-imdb-id");
    let b = movies.find(element => {
      return element.imdbId == item;
    });
    if (!savedMovies.includes(b)) {

      let local = localStorage.setItem('movies', JSON.stringify(savedMovies));
      console.log(local)

      savedMovies.push(b);
      showMovies(savedMovies,elLists);
      
      
    }
    
  }
  
  
})



elSavedMoviesButton.addEventListener('click', function(evt) {
  evt.preventDefault();
  
  showMovies(savedMovies, elLists);
  
});

elLists.addEventListener("click", evt => {
  if (evt.target.matches(".bookmark__delete")) {
    let btnID = Number(evt.target.dataset.imdbId);
    let itemFind = movies.findIndex(item => item.imdbId === btnID);
    savedMovies.splice(itemFind, 1);
    showMovies(savedMovies,elLists);

  }
});



elModal.addEventListener("hidden.bs.modal", function () {
  elModalYouTubeIframe.src = "";
})


genresList();

showMoviesGenresOption();

showMovies(fullMovies.slice(0, 5), elMoviesList);







function copy() {
  let copied = document.getElementById("copy");
  copied.select();
  copied.setSelectionRange(0, 100);
  document.execCommand("copy");
  alert("Copy was successfully copied");
}




// localStorage.setItem('movies', JSON.stringify(savedMovies));

console.log(localStorage.getItem(savedMovies))