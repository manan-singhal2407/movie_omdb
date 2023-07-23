import Movie from '../model/movie.js';

let movieList = [];
let movie;
let imdbID = "";
let rating = 0;
let comment = "";
let getRatingData = false;
let getCommentData = false;

const ratingContainer = document.querySelector(".movies_rating_container");
const ratingContainerStars = document.querySelectorAll(".movies_rating_container_star");
const movieTextComment = document.getElementById("movies_text_comment");
const inputTextComment = document.querySelector(".movies_text_comment_container");

ratingContainerStars.forEach(star => {
    star.addEventListener("click", () => {
        if (!getRatingData) {
            const ratingValue = parseInt(star.dataset.value);
            updateRatingCount(ratingValue);
        } else {
            alert("You can't change the rating once posted")
        }
    });
});

function updateRatingCount(ratingValue) {
    rating = ratingValue;
    ratingContainer.dataset.rating = ratingValue;
}

async function fetchMoviesWithId() {
    const response = await fetch(`https://www.omdbapi.com/?apikey=f1140859&i=${imdbID}`);
    if (response.status === 200) {
        const data = await response.json();
        movie = new Movie(data);

        renderMovieInFrameLayout();
    } else {
        alert("Request failed with status code: " + response.status);
    }
}

function renderMovieInFrameLayout() {
    document.getElementById("movie_poster_image").setAttribute('src', movie.Poster);
    document.getElementById("movie_title_text").innerText = movie.Title;
    document.getElementById("movie_type_text").innerHTML = movie.Type + `&nbsp; | &nbsp;` + movie.Genre + `&nbsp; | &nbsp;` + movie.Released;
    document.getElementById("movie_rating_text").innerHTML = movie.Runtime + `&nbsp; | &nbsp;` + movie.Rated + `&nbsp; | &nbsp;` + movie.imdbRating + `/10  on IMDb`;
    document.getElementById("movie_description_text").innerText = movie.Plot;
    document.getElementById("movie_director_text").innerText = movie.Director;
    document.getElementById("movie_writer_text").innerText = movie.Writer;
    document.getElementById("movie_actors_text").innerText = movie.Actors;
    renderUserActions();
}

function renderUserActions() {
    if (getCommentData) {
        inputTextComment.style.display = "none";
        movieTextComment.style.display = "block";
        movieTextComment.innerText = comment;
    } else {
        movieTextComment.style.display = "none";
    }
    if (getRatingData && getCommentData) {
        document.getElementById("movies_rating_comment_post").style.display = "none";
    }
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function postRatingAndComment() {
    comment = inputTextComment.value.trim();
    const movieInfo = movieList.find(movie => movie.id === imdbID);
    if (movieInfo !== undefined) {
        movieInfo.rating = rating;
        movieInfo.comment = comment;
    } else {
        movieList.push({
            id: imdbID,
            comment: comment,
            rating: rating
        });
    }
    localStorage.setItem("movie_list", JSON.stringify(movieList));
    getRatingData = rating !== 0;
    getCommentData = comment !== "";
    renderUserActions();
}

function fetchMovieListFromLocalStorage(localStorageList) {
    movieList = JSON.parse(localStorageList);
    const movieInfo = movieList.find(movie => movie.id === imdbID);
    if (movieInfo !== undefined) {
        comment = movieInfo.comment;
        rating = movieInfo.rating;
        ratingContainer.dataset.rating = movieInfo.rating;
        getRatingData = movieInfo.rating !== 0;
        getCommentData = movieInfo.comment !== "";
    }
}

document.getElementById("movies_rating_comment_post").addEventListener("click", postRatingAndComment);

imdbID = getParameterByName('imdbID');
let localStorageList = localStorage.getItem("movie_list");
if (localStorageList !== null) {
    fetchMovieListFromLocalStorage(localStorageList);
}
fetchMoviesWithId(imdbID);