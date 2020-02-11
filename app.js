import { TMDB_KEY } from "./config.js"; // API key for movie database

const endpointSearch = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=`;

const sideBar = document.querySelector('.side-bar-wrapper');
const sideBarOpenButton = document.querySelector('.open-button');
const modalOuter = document.querySelector('.modal-outer');
const modalInner = document.querySelector('.modal-inner');
const searchInput = document.querySelector('.search');
const suggestions = document.querySelector('.suggestions');
const sideBarContent = document.querySelector('.cards');
const sideBarCloseButton = document.querySelector('.close-button');
const adviseSectionContent = document.querySelector('.advise-cards');
const topMoviesCategories = document.querySelectorAll('.category');

let moviesInWatchList = JSON.parse(localStorage.getItem('moviesInWatchList')) || []; //creating empty array or getting watch list from local storage

function showWatchList() {
    const sideBarHTML = moviesInWatchList.map(movie => {
        return `
            <div class="card" data-description="${movie.id}">
                <div class="poster">
                    <img src="https://image.tmdb.org/t/p/original/${movie.poster_path}">
                    <span class="score score-${scoreColor(movie.vote_average)}">${movie.vote_average.toString().length === 3 ? movie.vote_average : movie.vote_average + '.0'}</span>
                    <span class="remove" name="remove"><i class="fas fa-trash"></i></span>
                </div>
                <h2>${movie.title}</h2>
            </div>
            `;
        }).join('');
    sideBarContent.innerHTML = sideBarHTML;
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => card.addEventListener('click', (e) => openModal(e)(moviesInWatchList)));
}

function addToWatchList(e){
    if(e.target.name === 'btn'){
        if(!e.target.classList.contains('remove')){
            console.log(e.target);
            const movieData = {
                id: e.target.dataset.id,
                title: e.target.dataset.title,
                release_date: e.target.dataset.release_date,
                poster_path: e.target.dataset.poster_path,
                vote_average: e.target.dataset.vote_average,
                overview: e.target.dataset.overview,
            };
            moviesInWatchList.push(movieData);
            e.target.innerText = 'Remove';
            e.target.classList.add('remove');
            showWatchList();
            localStorage.setItem('moviesInWatchList', JSON.stringify(moviesInWatchList));
        } else {
            moviesInWatchList = moviesInWatchList.filter(movie => movie.id !== e.target.dataset.id);
            e.target.innerText = 'Add';
            e.target.classList.remove('remove');
            showWatchList();
            localStorage.setItem('moviesInWatchList', JSON.stringify(moviesInWatchList));
        }
    }    
}

function openSideBar(e){
    if(sideBar.classList.contains('open')){
        sideBar.classList.add('open-full');
    } else {
        sideBar.classList.add('open');
        sideBarOpenButton.firstElementChild.innerText = 'to full screen'.toUpperCase();
    }
}

function closeSideBar(){
    sideBar.classList.remove('open');
    sideBar.classList.remove('open-full');
    sideBarOpenButton.firstElementChild.innerText = 'Watchlist';
}

function openModal(e){
    return function (movies = searchMovies){
        console.log(this);
        console.log(e.target);
        console.log(movies);
        if(e.target.closest(`[name='remove']`)){
            console.log(moviesInWatchList);
            moviesInWatchList = moviesInWatchList.filter(movie => movie.id !== e.currentTarget.dataset.description);
            showWatchList();
            return;
        }
        const movieCard = movies.filter(movie => movie.id.toString() === e.currentTarget.dataset.description);
        modalInner.innerHTML = `
                <button class="add-remove-btn ${moviesInWatchList.some(movie => movie.id === movieCard[0].id.toString()) ? 'remove' : ''}"
                    name="btn"
                    data-id="${movieCard[0].id}"
                    data-title="${movieCard[0].title}"
                    data-poster_path="${movieCard[0].poster_path}"
                    data-release_date="${movieCard[0].release_date}"
                    data-vote_average="${movieCard[0].vote_average}"
                    data-overview="${movieCard[0].overview}">${moviesInWatchList.some(movie => movie.id === movieCard[0].id.toString()) ? 'Remove' : 'Add'}</button>
                <div class="movie-info">
                    <div class="movie-img">
                        <img src="https://image.tmdb.org/t/p/original/${movieCard[0].poster_path}">
                        <span class="score-${scoreColor(movieCard[0].vote_average)}">${movieCard[0].vote_average}</span>
                    </div>
                    <div class="movie-text">
                        <h2>${movieCard[0].title}</h2>
                        <p class="year">${movieCard[0].release_date.slice(0, 4)}</p>
                        <p>${movieCard[0].overview}</p>
                    </div>
                </div>
        `;
        modalOuter.classList.add('open');
    }
}

function closeModal(){
	modalOuter.classList.remove('open');
}

function scoreColor(score){
    if(score >= 7){
        return 'green';
    } else if(score <=5){
        return 'red';
    } else{
        return 'yellow';
    }
}

let searchMovies = [];

function displayMatches(e){
    if(e.target.value === ''){
        searchMovies = [];
        suggestions.innerHTML = null;
    }
    fetch(`${endpointSearch}${e.target.value}`)
        .then(data => data.json())
        .then(response => {
            searchMovies = [];
            searchMovies.push(...response.results);
            const searchHTML = searchMovies.map(movie => {
                return `<li class="li" data-description="${movie.id}">
                    <div>${movie.title}</div>
                    <div>${movie.release_date.slice(0, 4)}</div>
                    <div class="score-${scoreColor(movie.vote_average)}">${movie.vote_average.toString().length === 3 ? movie.vote_average : movie.vote_average + '.0'}</div>
                </li>`;
            }).join('');
            suggestions.innerHTML = searchHTML;
            const lists = document.querySelectorAll('.li');
            lists.forEach(list => list.addEventListener('click', (e) => openModal(e)(searchMovies)));
        });
}

window.addEventListener('keydown', e => {
	if(e.key === 'Escape'){
		closeModal();
	}
});

modalOuter.addEventListener('click', e => {
	const isOutside = !e.target.closest('.modal-inner');
	if(isOutside){
		closeModal();
	}
});

sideBarOpenButton.addEventListener('click', openSideBar);
sideBarCloseButton.addEventListener('click', closeSideBar);
searchInput.addEventListener('change', displayMatches);
searchInput.addEventListener('keyup', displayMatches);
modalInner.addEventListener('click', addToWatchList);

showWatchList();

const endpoints = {
    popular: `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}&language=en-US&page=1`,
    nowInTheaters: `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_KEY}&language=en-US&page=1`,
    comingSoon: `https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_KEY}&language=en-US&page=1`,
    topRated: `https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_KEY}&language=en-US&page=1`
};
let topMovies = []; // an empty array for holding fetching data

function showTopMoviesList(category) {
    fetch(endpoints[category])
        .then(data => data.json())
        .then(response => {
            topMovies = [];
            topMovies.push(...response.results)
            const adviseSectionHTML = topMovies.map(movie => {
                return `
                    <div class="advise-card" data-description="${movie.id}">
                        <div class="poster">
                            <img src="https://image.tmdb.org/t/p/original/${movie.poster_path}">
                            <span class="score score-${scoreColor(movie.vote_average)}">${movie.vote_average.toString().length === 3 ? movie.vote_average : movie.vote_average + '.0'}</span>
                        </div>
                        <h2>${movie.title.length < 40 ? movie.title : movie.title.slice(0, 40) + '...'}</h2>
                    </div>
                    `;
                }).join('');
            adviseSectionContent.innerHTML = adviseSectionHTML;
            const cards = document.querySelectorAll('.advise-card');
            cards.forEach(card => card.addEventListener('click', (e) => openModal(e)(topMovies)));
        });

}
/*
function chooseTopMoviesCategory(e){
    console.log(e.currentTarget.nextElementSibling);
    showTopMoviesList(e.currentTarget.dataset.category);
    while(!e.currentTarget.nextElementSibling){
        e.currentTarget.nextElementSibling.classList.remove('highlight');
    }
    while(!e.currentTarget.previousElementSibling){
        e.currentTarget.previousElementSibling.classList.remove('highlight');
    }
    e.currentTarget.classList.add('highlight');
}
*/

topMoviesCategories.forEach(category => category.addEventListener('click', (e) =>   showTopMoviesList(e.currentTarget.dataset.category)));

showTopMoviesList('popular');