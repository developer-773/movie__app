
// Movies obyektidagi hamma kinolar janrini shu arrayga ye'gish uchun.
const genres = [];

// DOM ga oid elementlarni olib kelish
const elFormSearch = document.querySelector(".search-form");
const elFormSearchInput = elFormSearch.querySelector(".search-input");
const elSortSelect = elFormSearch.querySelector('.genres-select');
const elStartYearInput = elFormSearch.querySelector(".js-start-year-input");
const elEndYearInput = elFormSearch.querySelector(".js-end-year-input");
const elSortMovies = elFormSearch.querySelector('.js-sort-select');


// Render bo'ladigan kinolar shu listga kelib tushadi.
const elMoviesList = document.querySelector(".movies__list");




// Har bir kinoni maxsus knopkasi bosilganda, kino haqida qisqacha ma'lumot va treyler ko'rsatiberadigan modal box.

const elModal = document.querySelector(".modal");
const elModalTitle = elModal.querySelector(".movie-info-modal__title");
const elModalRating = elModal.querySelector(".movie-info-modal__rating");
const elModalYear = elModal.querySelector(".movie-info-modal__year");
const elModalDuration = elModal.querySelector(".movie-info-modal__duration");
const elModalYouTubeIframe = elModal.querySelector(".movie-info-modal__iframe");
const elModalCotegory = elModal.querySelector(".movie-info-modal__categories");
const elModalSummary = elModal.querySelector(".movie-info-modal__summary");
const elModalImDbId = elModal.querySelector(".movie-info-modal__imdb-link");



// DOM da (render bo'lishidan oldin) ko'rinmi turadigan va ichida har bir kino obyekti joylanadigan shablon.
const elMoviesListTemplate = document.querySelector("#movies-item-template").content;

// Kino obyektidagi kino davomiyligini minutdan soat va minutga convert qiladigan funksiya.
function getHoursAndMinuts(minut) {

  let hours = Math.floor(minut / 60);
  let minuts = Math.floor(minut % 60);

  return `${hours} hrs ${minuts} min`;
}



// Kinolarni janrini tepadagi bo'sh arrayga joylash funksiyasi. Mazmuni:

/* 

Fullmovies nomli datada mavjud bo'gan hamma kino obyektlari jamlangan arrayni ForEach orqali aylanib, har bitta kinoni janri bitta o'zgaruvchiga olinadi. Bu o'zgaruvchida birxil janrla bor. Shu sababli, birxil janrlani tepadigi arrayga somaslik uchun, yana ForEach bilan aylanadib, agar shu janr tepadigi arrayda bo'masa, keyin usha arrayga push qiladi

*/

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

// Kinolani janrini DOM da select orqali ko'rsatuvchi funksiya. 

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



// Kinolarni sahifaga chiqaruvchi funksiya, Parametrlari: 1-Kinolar obyekti, 2-Kino qidiradigan input regExp holati.
function showMovies(movie, titleRegex = "") {

  elMoviesList.innerHTML = "";


  const moviesFragment = document.createDocumentFragment();

  for (const kino of movie) {

    // DOM digi shablon kinolar miqdoricha kopiya qilindi.
    const moviesCloneTemplate = elMoviesListTemplate.cloneNode(true);

    moviesCloneTemplate.querySelector(".movie__img").src = kino.youtubePoster;

    // Agar search input RegExp source shunga teng bo'masa (pustoy bo'masa) va search input da ma'lumot bo'sa, input bilan topilgan kinoni titlesini alohida ajratib bo'yash (input value miqdoricha)
    if(titleRegex.source !== "(?:)" && titleRegex){

      moviesCloneTemplate.querySelector(".movie__title").innerHTML = kino.title.replace(titleRegex,
        `<mark class="p-0 bg-warning">${titleRegex.source}</mark>`);
    }else{
      moviesCloneTemplate.querySelector(".movie__title").textContent = kino.title;
    }


    moviesCloneTemplate.querySelector(".movie__rating").textContent = kino.imdbRating;
    moviesCloneTemplate.querySelector(".movie__year").textContent = kino.year;
    moviesCloneTemplate.querySelector(".movie__duration").textContent = getHoursAndMinuts(kino.runtime);
    moviesCloneTemplate.querySelector(".movie__categories").textContent = kino.categories.join(", ");
    moviesCloneTemplate.querySelector(".js-more-info-button").dataset.imdbId = kino.imdbId;


    // Klon qilib, ishlov berilgan hamma shablonlani bitta kapsulaga joylash (DOM ga nagruzka tushmasligi uchun)
    moviesFragment.appendChild(moviesCloneTemplate);
  }

  // Kapsulani ichidigi kontentlari bilan kinolar konteyneriga joylash (Kapsula erib ketadi)
  elMoviesList.appendChild(moviesFragment);
}



// Har bir kino haqida qisqacha ma'lumot va treyler ko'rsatiberadigan knopka funksiyasi. Mazmuni:

/* 
Fullmovies digi hamma kinolani ichidan har bir kinoni unikalniy soni bosilvotgan knopkaga teng bo'sa natija sifatida qaytarsin . Modal box da ko'rinishi kerak bo'gan kontentlaga ishlov berilish
*/
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

// Har xil usul orqali kinolarni topuvchi funksiya. Mazmuni:

/*
Hamma kinolani filter qilish bilan birga bittalab aylanib chiqadi. Input valuesi kinoni title ida bo'sa va janrlari bo'yicha so'rtlidigan select qiymati All ga teng bo'sa filter qisin. Yoki kinolar kategoriyasida selectdigi janr valuesi bo'sa va kinoni yili bo'yicha qidiradigan input qiymati bo'sh bo'sa ham qidirsin. Yoki kinoni yili input orqali kiritilvotkan yildan kotta yoki teng bosa va shu yilgacha bo'gan input qiymati bo'sh bosayam qidirsin. Yoki ashuni teskarisi.
*/
function showSearchMovies(items) {

  return fullMovies.filter(movie => {

    const meetsCriteria = movie.title.match(items) && (elSortSelect.value === "All" ||
    movie.categories.includes(elSortSelect.value))  && (elStartYearInput.value.trim() ===''
    || movie.year >= Number(elStartYearInput.value)) && (elEndYearInput.value.trim() ===''
    || movie.year <= Number(elEndYearInput.value));
    return meetsCriteria;
  });
}



// Select orqali harxil uslub bilan sortlidigan funksiya
function sortMoviesList(sortedArray, sortType) {

    // Birinchi kinoni title ni ASCI digi joylashuv soni ikkinchi kinoni title ni ASCI dig joylashuv sonidan kichkina bo'sa, joyini o'zgartirmagin.
  if (sortType === "a-z") {
    sortedArray.sort((a , b) => {
      if(a.title < b.title) return -1 

      // Yoki teskarisi. Joyini o'zgartirgin
      else if (a.title > b.title) return 1
      else return 0 // Aks holda shundo qovursin
    })
  }
  else if(sortType === "z-a"){
    sortedArray.sort((a,b) =>  b.title.charCodeAt(0) - a.title.charCodeAt(0));
  }
  else if (sortType === "tohigh"){
    sortedArray.sort((a,b) => a.imdbRating - b.imdbRating);
  }
  else if (sortType === "tolow"){
    sortedArray.sort(function(a,b) {
      return b.imdbRating - a.imdbRating;
    });
  }
  else if (sortType === "year-old"){
    sortedArray.sort((a,b) => a.year - b.year);
  }
  else if (sortType === "year-new"){
    sortedArray.sort((a,b) => b.year - a.year);
  }


}



// Formani eshituvchi hodisa.
elFormSearch.addEventListener("submit", function (evt) {
  evt.preventDefault();


  // Search input bilan qidirmi boshqacha qidirganda, input valuesi bo'sh ketmasligi uchun RegExp dan foydalanildi.
  const searchElement = new RegExp(elFormSearchInput.value.trim(), 'gi');
// 160 qatordigi harxil uslub bilan topadigan funksiyani argumentiga search input berildi.
  const searchMovieFilteredList = showSearchMovies(searchElement);

  // Agar kino qidirilvotkan payt input yoki inputlada kinoga aloqador ma'lumot bo'sa
  if (searchMovieFilteredList.length > 0) {

    // Kinolani harxil uslub bilan sortlasin
    sortMoviesList(searchMovieFilteredList, elSortMovies.value);
// Search input da topilgan kinolani boshqattan render qisin
    showMovies(searchMovieFilteredList, searchElement);

  } else {
    //  let notFount = ``;
    alert("Movie not found")
  }

  // elFormSearchInput.value = "";
});

// Hamma kinolani DOM da saqlidigan konteyner eshitib turuvchi funksiya.
elMoviesList.addEventListener("click", function (evt) {
  if (evt.target.matches(".js-more-info-button")) {
    // Agar konteynerri ichida bosilgan element unikalni soni kinoni unikalniy sonida bo'sa modal box ochsin 
    showModalInfo(evt.target.dataset.imdbId);
  }
})

// Modal boxdan chiqilganda youtube digi treyler pausa qiladigan funksiya
elModal.addEventListener("hidden.bs.modal", function () {
  elModalYouTubeIframe.src = "";
})

// Hamma funskiyala ishlaganidan keyin janrlani arrayga push qiladigan funksiya chaqirildi.
genresList();

// Kinolani harxil sortlidigan funksiya chaqrildi
showMoviesGenresOption();

// Default holatda 100 ta kinoni obkegin. Qidirilvotkanda yoki sortlanvotkanda hamma kinoni sortlasin.
showMovies(fullMovies.slice(0, 10));