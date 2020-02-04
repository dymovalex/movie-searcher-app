import { TMDB_KEY } from "./config.js"; // API key for movie database

const endpointSearch = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=`;

const sideBar = document.querySelector('.side-bar');
const modalOuter = document.querySelector('.modal-outer');
const modalInner = document.querySelector('.modal-inner');
const searchInput = document.querySelector('.search');
const suggestions = document.querySelector('.suggestions');
const sideBarContent = document.querySelector('.cards');
//let cards = ''; //?

let moviesInWatchList = /*JSON.parse(localStorage.getItem('moviesInWatchList') || */[]; //creating empty array or getting watch list from local storage

function showWatchList() {
    const sideBarHTML = moviesInWatchList.map(movie => {
        console.log(movie);
        return `
            <div class="card" data-description="${movie.id}">
                <img src="${movie.img}">
                <h2>${movie.title}</h2>
                <span>${movie.score}</span>
            </div>
            `;
        }).join('');
    sideBarContent.innerHTML = sideBarHTML;
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => card.addEventListener('click', openModal));
}

function addToWatchList(e){
    if(e.target.name === 'add'){
        const movieData = {
            id: e.target.dataset.id,
            title: e.target.dataset.title,
            img: e.target.dataset.img,
            score: e.target.dataset.score,
            overview: e.target.dataset.overview,
        };
        moviesInWatchList.push(movieData);
        e.target.innerText = 'Remove';
        e.target.classList.add('remove');
        e.target.name === 'add';
        showWatchList();
        //localStorage.setItem('moviesInWatchList', JSON.stringify(moviesInWatchList));
    }
    if(e.target.name === 'remove'){
        moviesInWatchList = moviesInWatchList.filter(movie => movie.id !== e.target.dataset.id);
        e.target.innerText = 'Add';
        e.target.classList.remove('remove');
        e.target.name === 'remove';
        showWatchList();
        //localStorage.setItem('moviesInWatchList', JSON.stringify(moviesInWatchList));
    }
}

function openWatchList(){
    sideBar.classList.toggle('open');
    //showWatchList();
}
/*name="${moviesInWatchList.includes(movieCard[0].id) ? 'remove' : 'add'}"*/ 
function openModalX(e){
    const currentCard = e.currentTarget;
    const movieCard = searchMovies.filter(movie => movie.id.toString() === currentCard.dataset.description);
    console.log(movieCard[0].id);
    modalInner.innerHTML = `
            <button class="add-remove-btn ${moviesInWatchList.some(movie => movie.id === movieCard[0].id.toString()) ? 'remove' : 'add'}"
                name="${moviesInWatchList.some(movie => movie.id === movieCard[0].id.toString()) ? 'remove' : 'add'}"
                data-id="${movieCard[0].id}"
                data-title="${movieCard[0].title}"
                data-img="https://image.tmdb.org/t/p/original/${movieCard[0].poster_path}"
                data-score="${movieCard[0].vote_average}"
                data-overview="${movieCard[0].overview}">${moviesInWatchList.some(movie => movie.id === movieCard[0].id.toString()) ? 'Remove' : 'Add'}</button>
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
    /*const addRemoveBtn = document.querySelector('.add-remove-btn');
    addRemoveBtn.addEventListener('click', addToWatchList);*/
}


function openModal(e){
    const currentCard = e.currentTarget;
    console.log(currentCard);
    const movieCard = moviesInWatchList.filter(movie => movie.id.toString() === currentCard.dataset.description);

    modalInner.innerHTML = `
			<span class="arrow">←</span>description
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
            lists.forEach(list => list.addEventListener('click', openModalX));
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

sideBar.addEventListener('click', openWatchList);
searchInput.addEventListener('change', displayMatches);
searchInput.addEventListener('keyup', displayMatches);

showWatchList();


/*
const endpoint = `https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_KEY}&language=en-US&page=1`;
const movies = []; // an empty array for holding fetching data
fetch(endpoint)
    .then(data => data.json())
    .then(response => movies.push(...response.results));

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
*/

modalInner.addEventListener('click', addToWatchList);