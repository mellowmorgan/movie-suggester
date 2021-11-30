import $ from 'jquery';
import { MovieFinder } from './js/movie-service.js';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';

$("#add-genre").on("click", () => {
  let option = $("#genre :selected");
  if (option.val() !== "" && option.prop("disabled") === false) {
    $("#selected-genres").append(`
      <button class="btn btn-success tag-btn" type="button" value="${option.val()}">${option.text()} <span class="tag-btn-x">X</span></button>
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
      <button class="btn btn-success tag-btn" type="button" value="//this will be id from API call//">${cast.val()} <span class="tag-btn-x">X</span></button>
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
    if (response.results.length > 0) {  
      for(let i = 0; i < response.results.length; i++) {
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

let arrayKeywordsInfo=[];
$("#movie-form").submit(function(event){
  event.preventDefault();
  let genres = [];
  $("#selected-genres").children().each(function() {
    console.log($(this).val());
    genres.push($(this).val());
  });


  //let genres= ['16','80','27'];
  
  let genresString = genres.join(',');
  console.log(genresString);

  
  let keywordsString = "4565"; 
  MovieFinder.makeMovieCall(genresString,keywordsString)
    .then(function(response) {
      getMovies(response);
    });
  arrayKeywordsInfo = [];
});

//Utiliy function for keywords to add +

function transformInput(input){
  let newInput = input.trim();
  newInput = newInput.split(" ").join("+");
  return newInput;
}
// keyword finder/checker


function hasExactMatch(results,keyword){
  for(let i = 0; i < results.length; i++){
    if(results[i].name === keyword){
      return [results[i].name,results[i].id];
    }
  }
  return false;
}

function getKeyword(response, keyword) {
  if (response.results) {
    let hasMatch = hasExactMatch(response.results,keyword);
    //if exact hit
    if (hasMatch[0]){
      arrayKeywordsInfo.push([hasMatch[0],hasMatch[1]]);
    }
    else if (response.results.length > 0 && !hasMatch) {  
      $("#addKeywordsButton").show();
      for(let i = 0; i < response.results.length; i++) {
      $("#keywordList").append(`
        <li class="list-group-item">
        <input type="checkbox" value="${response.results[i].id}" id="${response.results[i].name}" aria-label="...">
        ${response.results[i].name}
      </li>`);
      }
    } else {
      console.log("No results found.");
    }
  } else {
    console.log(`Error: ${response.status_message}`);
  }
}

MovieFinder.keywordFinder(keywordsString)
    .then(function(response) {
      getKeyword(response);
    });




  <ul class="list-group">
  <li class="list-group-item">
    <input class="form-check-input me-1" type="checkbox" value="" aria-label="...">
    First checkbox
  </li>
  <li class="list-group-item">
    <input class="form-check-input me-1" type="checkbox" value="" aria-label="...">
    Second checkbox
  </li>
  <li class="list-group-item">
    <input class="form-check-input me-1" type="checkbox" value="" aria-label="...">
    Third checkbox
  </li>
  <li class="list-group-item">
    <input class="form-check-input me-1" type="checkbox" value="" aria-label="...">
    Fourth checkbox
  </li>
  <li class="list-group-item">
    <input class="form-check-input me-1" type="checkbox" value="" aria-label="...">
    Fifth checkbox
  </li>
</ul>