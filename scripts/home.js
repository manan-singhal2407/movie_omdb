import Movie from '../model/movie.js';

const movies = [];

async function fetchMoviesWithPageAndText(page, text) {
    if (text === "") {
        text = "Harry";
    }
    const response = await fetch(`https://www.omdbapi.com/?apikey=f1140859&s=${text}&page=${page}`);
    if (response.status === 200) {
        const data = await response.json();
        for (const movie of data.Search) {
            const movieObject = new Movie(movie);
            movies.push(movieObject);
        }

        renderMoviesInGridLayout();
    } else {
        alert("Request failed with status code: " + response.status);
    }
}

function renderMoviesInGridLayout() {
    const grid = document.querySelector(".movie_grid_container");

    for (const movie of movies) {
        const movieElement = document.createElement("div");
        movieElement.classList.add("movie_grid_card_container");

        const movieCardElement = document.createElement("a");
        movieCardElement.setAttribute("role", "presentation");

        const posterElement = document.createElement("img");
        posterElement.src = movie.Poster;
        const titleElement = document.createElement("h3");
        titleElement.textContent = movie.Title;

        movieCardElement.appendChild(posterElement);
        movieCardElement.appendChild(titleElement);
        movieElement.appendChild(movieCardElement);
        grid.appendChild(movieElement);
    }
}

fetchMoviesWithPageAndText(1, "Harry");