import $ from 'jquery';
import GenreFinder from './js/genreFinder.js';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';

$("#add-genre").on("click", () => {
  let option = $("#genre :selected");
  if (option.val() !== "" && option.prop("disabled") === false) {
    $("#selected-genres").append(`
      <button class="btn btn-success tag-btn" type="button" value="${option.val()}"">${option.text()} <span class="tag-btn-x">X</span></button>
    `);
    option.prop("disabled", true);
  }
});

$("#selected-genres").on("click", "button", function() {
  let button = $(this);
  $(`#genre option[value=${button.val()}]`).prop("disabled", false);
  button.remove();
});

$("#add-cast-member").on("click", () => {
  let cast = $("#input-cast-member");
  if (cast.val() !== "") {
    $("#selected-cast-members").append(`
      <button class="btn btn-success tag-btn" type="button" value="//this will be id from API call//"">${cast.val()} <span class="tag-btn-x">X</span></button>
    `);
    cast.val("");
  }
});

$("#selected-cast-members").on("click", "button", function() {
  $(this).remove();
});

$("#add-keyword").on("click", () => {
  let keyword = $("#input-keyword");
  if (keyword.val() !== "") {
    $("#selected-keywords").append(`
      <button class="btn btn-success tag-btn" type="button" value="${keyword.val()}">${keyword.val()} <span class="tag-btn-x">X</span></button>
    `);
    keyword.val("");
  }
});

$("#selected-keywords").on("click", "button", function() {
  $(this).remove();
});

function getMovies(response) {
  if (response.results) {
    if (response.results.length>0) {  
      for(let i = 0; i < 5; i++) {
        console.log(response.results[i].title);
      }
    } else {
      console.log("No results found.");
    }
  } else {
    console.log(`Error: ${response.status_message}`);
  }
}

// https://image.tmdb.org/t/p/original (movie poster link)

//let genres = [];
// genres = $("input[name='genres']:checked").map(function() {
//   return $(this).val();
// }).toArray();

let genres = [];
$("#selected-genres").each(function() {
  genres.push($(this).val());
});

//let genres= ['16','80','27'];
let genresString = genres.join(',');
GenreFinder.makeGenreCall(genresString)
  .then(function(response) {
    getMovies(response);
  });
