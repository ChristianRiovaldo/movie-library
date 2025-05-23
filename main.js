// Initial Display
const years = [2024, 2023, 2022, 2021, 2020];
let initialDisplay = [];
let initialRequest = 0;

years.forEach((year) => {
    fetch(`http://www.omdbapi.com/?apikey=2cf549e2&s=movie&y=${year}`)
        .then((response) => response.json())
        .then((response) => {
            initialDisplay = initialDisplay.concat(response.Search);
            initialRequest++;

            if (initialRequest === years.length) {
                console.log(initialDisplay);
                displayMovies(initialDisplay);
            }
        })
});

// Search Movie
const searchButton = document.querySelector('.search-button');
searchButton.addEventListener('click', async function () {
    const inputKeyword = document.querySelector('.input-keyword');
    try {
        const movies = await getMovies(inputKeyword);
        displayMovies(movies);
    } catch(err) {
        console.log(err);
    }
});

function getMovies(inputKeyword) {
    return fetch(`http://www.omdbapi.com/?apikey=2cf549e2&s=${inputKeyword.value}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText);
            } else {
                return response.json();
            }
        })
        .then((response) => {
            if (response.Response === 'False') {
                throw new Error(response.Error);
            } else {
                return response.Search;
            }
        });
}

function displayMovies(movies) {
    let movieCards = '';
    movies.forEach((movie) => {
        movieCards += showMovieCards(movie);
    });

    const movieContainer = document.querySelector('.movie-container');
    movieContainer.innerHTML = movieCards;
}

// Details Movie
document.addEventListener('click', async function (e) {
    if (e.target.classList.contains('details-button')) {
        const imdbid = e.target.dataset.imdbid;
        const details = await getMovieDetails(imdbid);
        displayMovieDetails(details);
    }
});

function getMovieDetails(imdbid) {
    return fetch(`http://www.omdbapi.com/?apikey=2cf549e2&i=${imdbid}`)
        .then((response) => response.json())
        .then((response) => response)
        .catch((err) => console.error(err.responseText));
}

function displayMovieDetails(details) {
    const movieDetails = document.querySelector('.modal-body');
    movieDetails.innerHTML = showMovieDetails(details);
}

function showMovieCards(movie) {
    return `<div class="col-md-4 my-3">
                <div class="card">
                    <img src="${movie.Poster}" class="card-img-top">
                    <div class="card-body">
                        <h5 class="card-title">${movie.Title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${movie.Year}</h6>
                        <a href="#" class="btn btn-primary details-button" data-toggle="modal" data-target="#movieDetails"
                            data-imdbid="${movie.imdbID}">Show Details</a>
                    </div>
                </div>
            </div>`;
}

function showMovieDetails(movie) {
    return `<div class="container-fluid">
                <div class="row">
                    <div class="col-md-3">
                        <img src="${movie.Poster}" class="img-fluid">
                    </div>
                    <div class="col-md">
                        <ul class="list-group">
                            <li class="list-group-item"><h4>${movie.Title} (${movie.Year})</h4></li>
                            <li class="list-group-item"><strong>Country : </strong> ${movie.Country}</li>
                            <li class="list-group-item"><strong>Genre : </strong> ${movie.Genre}</li>
                            <li class="list-group-item"><strong>Director : </strong> ${movie.Director}</li>
                            <li class="list-group-item"><strong>Writer : </strong> ${movie.Writer}</li>
                            <li class="list-group-item"><strong>Actors : </strong> ${movie.Actors}</li>
                            <li class="list-group-item"><strong>Plot : </strong><br>${movie.Plot}</li>
                        </ul>
                    </div>
                </div>
            </div>`;
}