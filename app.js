import { TMDB_KEY } from "./config.js"; // API key for movie database

const sideBar = document.querySelector('.side-bar');
//const sideBarButton = document.querySelector('.open-button');
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

let moviesInWatchList = [];

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

/*
function showWatchList() {
    const sideBarHTML = moviesInWatchList.map(movieID => {
        fetch(`https://api.themoviedb.org/3/movie/${movieID}?api_key=${TMDB_KEY}`)
            .then(data => data.json())
            .then(response => {
                console.log(response);
                return `
                <div class="card" data-description="${response.id}">
                    <img src="https://image.tmdb.org/t/p/original/${response.poster_path}">
                    <h2>${response.title}</h2>
                    <span>${response.vote_average}</span>
                </div>
                `;
            });
    }).join('');
    sideBarContent.innerHTML = sideBarHTML;
    cards = document.querySelectorAll('.card');
    cards.forEach(card => card.addEventListener('click', openModal));
}
*/


function toWatchList(e){
    console.log(e.currentTarget);
    moviesInWatchList.push(e.currentTarget.dataset.description);
    console.log(moviesInWatchList);
    e.currentTarget.classList.add('remove');
}

function openWatchList(){
    sideBar.classList.toggle('open');
    //showWatchList();
    showTopRatedFilms();
}
////////////
function openModalX(e){
    const currentCard = e.currentTarget;
    console.log(currentCard);
    const movieCard = searchMovies.filter(movie => movie.id.toString() === currentCard.dataset.description);
    //console.log(movieCard);

    modalInner.innerHTML = `
            <button class="add-remove-btn" data-description="${movieCard[0].id}">Add</button>
			<div class="movie-info">
				<img src="https://image.tmdb.org/t/p/original/${movieCard[0].poster_path}">
				<div class="movie-text">
                    <h2>${movieCard[0].title}</h2>
                    <p class="year">${movieCard[0].release_date.slice(0, 4)}</p>
                    <p>${movieCard[0].overview}</p>
                    <span class="score-${scoreColor(movieCard[0].vote_average)}">${movieCard[0].vote_average}</span>
				</div>
			</div>
    `;
	
    modalOuter.classList.add('open');
    const addRemoveBtn = document.querySelector('.add-remove-btn');
    addRemoveBtn.addEventListener('click', toWatchList);
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


/*
function displayMatches(e){
    //console.log(e.target.value);
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
*/

function scoreColor(score){
    if(score >= 7){
        return 'green';
    } else if(score <=5){
        return 'red';
    } else{
        return 'yellow'
    }
}

let searchMovies = [];
function displayMatches(e){
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
            lists.forEach(list => list.addEventListener('click', openModalX));
        });
}


sideBar.addEventListener('click', openWatchList);

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

//suggestions.addEventListener('click', displayMatches);