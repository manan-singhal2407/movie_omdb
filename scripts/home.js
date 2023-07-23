import Movie from '../model/movie.js';

let movies = [];
let pageNumber = 1;
let text = "Harry";

async function fetchMoviesWithPageAndText(page, text) {
    pageNumber = page;
    movies.splice(0, movies.length);
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
    grid.innerHTML = "";

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
    renderPaginationPageNumberLayout();
}

function renderPaginationPageNumberLayout() {
    const span = document.querySelector(".movie_pagination_numbers");
    span.innerHTML = "";

    const item = pageNumber-2;
    for (let i=-2; i<=2; i++) {
        if (i === 0) {
            const currentPage = document.createElement("span");
            currentPage.textContent = pageNumber;
            span.appendChild(currentPage);
        } else if (i < 0) {
            if (pageNumber + i >= 1) {
                const page = document.createElement("a");
                page.addEventListener("click", function() {
                    fetchMoviesWithPageAndText(pageNumber + i, text);
                });
                page.textContent = pageNumber + i;
                span.appendChild(page);
            }
        } 
        else {
            if (pageNumber + i <= 100 && movies.length === 10) {
                const page = document.createElement("a");
                page.addEventListener("click", function() {
                    fetchMoviesWithPageAndText(pageNumber + i, text);
                });
                page.textContent = pageNumber + i;
                span.appendChild(page);   
            }
        }
    }
}

function onClickSearchButton() {
    const searchInputField = document.getElementById("search_input_field");
    text = searchInputField.value.trim();
    if (text === "") {
        text = "Harry";
    }
    pageNumber = 1;
    fetchMoviesWithPageAndText(pageNumber, text);
}

function onClickPreviousButton() {
    if (pageNumber !== 1) {
        pageNumber--;
        fetchMoviesWithPageAndText(pageNumber, text);
    }
}

function onClickNextButton() {
    if (movies.length === 10) {
        pageNumber++;
        fetchMoviesWithPageAndText(pageNumber, text);
    }
}

document.getElementById("pagination_previous_button").addEventListener("click", onClickPreviousButton);
document.getElementById("pagination_next_button").addEventListener("click", onClickNextButton);
document.getElementById("search_button").addEventListener("click", onClickSearchButton);

fetchMoviesWithPageAndText(pageNumber, text);