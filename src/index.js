import $ from 'jquery';
import { MovieFinder } from './js/movie-service.js';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';


function makeButton(div, value, text) {
  div.append(`
      <button class="btn btn-success tag-btn" type="button" value="${value}">${text} <span class="tag-btn-x">X</span></button>
    `);
}

$("#add-genre").on("click", () => {
  let option = $("#genre :selected");
  if (option.val() !== "" && option.prop("disabled") === false) {
    makeButton($("#selected-genres"), option.val(), option.text());
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
    makeButton($("#selected-cast-members"), cast.val(), cast.text());
    cast.val("");
  }
});

$("#selected-cast-members").on("click", "button", function() {
  $(this).remove();
});

$("#add-keyword").on("click", () => {
  let keyword = $("#input-keyword");
  
  if (keyword.val() !== "") {
    if ($("#add-keyword").css("--first-click") === "true") {
      MovieFinder.keywordFinder(keyword)
      .then(function(response) {
        let json = getKeyword(response);
      });
      let matched = hasExactMatch(json);
      if (!matched) {
      makeKeywordSuggestions(json);
      $("#keyword-suggestions").slideToggle();
      $("#add-keyword").css("--first-click", "false");
      }
    } else {
      $("#keyword-suggestions :checked").each(function() {
        makeButton($("#selected-keywords"), "...", "..."); //need to put in proper args
      });
      $("#add-keyword").css("--first-click", "true");
      $("#keyword-suggestions").html("");
      $("#keyword-suggestions").toggle();
      keyword.val("");
    }
  }
});

$("#selected-keywords").on("click", "button", function() {
  $(this).remove();
});

function hasExactMatch(results, keyword) {
  for(let i = 0; i < results.length; i++){
    if(results[i].name === keyword){
      makeButton($("#selected-keywords"), results[i].id, results[i].name);
      return true;
    }
  }
  return false;
}

function getKeyword(response) {
  if (response.results) {
      return response;
    } else {
      console.log("No results found.");
    }
  } else {
    console.log(`Error: ${response.status_message}`);
  }
}

function makeKeywordSuggestions(json) {
  let suggestions = $("#keyword-suggestions");
  for (let i = 0; i < json.results.length; i++) {
    suggestions.append(`
    <label class="list-group-item">
      <input class="form-check-input me-1" type="checkbox" value="${json.results[i].id}">
      ${json.results[i].name}
    </label>
    `);
  }
}

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
});

//Utiliy function for keywords to add +

function transformInput(input){
  let newInput = input.trim();
  newInput = newInput.split(" ").join("+");
  return newInput;
}