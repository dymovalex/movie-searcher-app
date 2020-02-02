import { TMDB_KEY } from "./config.js"; // API key for movie database

const sideBarButton = document.querySelector('.side-bar');
const modalOuter = document.querySelector('.modal-outer');
const modalInner = document.querySelector('.modal-inner');
const searchInput = document.querySelector('.search');
const suggestions = document.querySelector('.suggestions');
//const cards = document.querySelectorAll('.card');
let cards = '';
const sideBarContent = document.querySelector('.cards');
console.log(sideBarContent);


const endpointSearch = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=`;
/*
fetch(endpointSearch)
    .then(data => data.json())
    .then(response => searchMovies.push(...response.results));
*/


const endpoint = `https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_KEY}&language=en-US&page=1`;
const movies = []; // an empty array for holding fetching data
fetch(endpoint)
    .then(data => data.json())
    .then(response => movies.push(...response.results));

console.log(movies);

function showTopRatedFilms() {
    const sideBarHTML = movies.map(movie => {
        return `
        <div class="card" data-description="${movie.id}">
            <img src="https://image.tmdb.org/t/p/original/${movie.poster_path}">
            <h2>${movie.title}</h2>
            <span>${movie.vote_average}</span>
        </div>
        `;
    }).join(``);
    sideBarContent.innerHTML = sideBarHTML;
    cards = document.querySelectorAll('.card');
    cards.forEach(card => card.addEventListener('click', openModal));
}


function openWatchList(e){
    e.target.classList.toggle('open');
    showTopRatedFilms();
}
////////////
function openModalX(e){
    const currentCard = e.currentTarget;
    console.log(currentCard);
    const movieCard = searchMovies.filter(movie => movie.id.toString() === currentCard.dataset.description);
    //console.log(movieCard);

    modalInner.innerHTML = `
			<span class="arrow">←</span>
			<div class="movie-info">
				<img src="https://image.tmdb.org/t/p/original/${movieCard[0].poster_path}">
				<div class="movie-text">
					<h2>${movieCard[0].title}</h2>
					<p>${movieCard[0].overview}</p>
				</div>
				<span>${movieCard[0].vote_average}</span>
			</div>
            <span class="arrow">→</span>
    `;
	
	modalOuter.classList.add('open');
}

////////////

function openModal(e){
    const currentCard = e.currentTarget;
    console.log(currentCard);
    const movieCard = movies.filter(movie => movie.id.toString() === currentCard.dataset.description);
    //console.log(movieCard);

    modalInner.innerHTML = `
			<span class="arrow">←</span>
			<div class="movie-info">
				<img src="https://image.tmdb.org/t/p/original/${movieCard[0].poster_path}">
				<div class="movie-text">
					<h2>${movieCard[0].title}</h2>
					<p>${movieCard[0].overview}</p>
				</div>
				<span>${movieCard[0].vote_average}</span>
			</div>
            <span class="arrow">→</span>
    `;
	
	modalOuter.classList.add('open');
}

function closeModal(){
	modalOuter.classList.remove('open');
}

let searchMovies = [];

function displayMatches(e){
    console.log(e.target.value);
    fetch(`${endpointSearch}${e.target.value}`)
        .then(data => data.json())
        .then(response => searchMovies.push(...response.results));
    const searchHTML = searchMovies.map(movie => {
        return `<li class="li" data-description="${movie.id}">${movie.title}</li>`;
    }).join('');

    suggestions.innerHTML = searchHTML;
    searchMovies = [];
    const lists = document.querySelectorAll('.li');
    lists.forEach(list => list.addEventListener('click', openModalX));
    
}

sideBarButton.addEventListener('click', openWatchList);

//cards.forEach(card => card.addEventListener('click', openModal));

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

searchInput.addEventListener('change', displayMatches);
searchInput.addEventListener('keyup', displayMatches);