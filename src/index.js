import $ from 'jquery';
import { MovieFinder } from './js/movie-service.js';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';


sessionStorage.setItem('keywordFirstClick', "true");

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
  let keyword = $("#input-keyword").val();
  if (keyword !== "") {
    if (sessionStorage.getItem('keywordFirstClick') === 'true') {
      MovieFinder.keywordFinder(keyword)
      .then(function(response) {
        if (response instanceof Error) {
          throw response;
        }
        if (response.results.length === 0) {
          throw Error("no results");
        }
        
        let matched = hasExactMatch(response.results, keyword);
        if (!matched) {
          makeKeywordSuggestions(response);
          $("#keyword-suggestions").slideToggle();
          sessionStorage.setItem('keywordFirstClick', "false");
        } 
      })
      .catch(function(response) {
        if (response.message === "no results") {
          console.log("Error: no results");
          $("#input-keyword").val("");
        } else {
          console.log(`Error: ${response.message}`);
          $("#input-keyword").val("");
        }
      });
    } else {
      $("#keyword-suggestions :checked").each(function() {
        makeButton($("#selected-keywords"), $(this).val(), $(this).parent().text());
      });
      sessionStorage.setItem('keywordFirstClick', "true");
      $("#keyword-suggestions").html("");
      $("#keyword-suggestions").toggle();
      $("#input-keyword").val("");
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
      $("#input-keyword").val("");
      return true;
    }
  }
  return false;
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

function getFinalSelections(type){
  let array = [];
  $(`#selected-${type}`).children().each(function() {
    array.push($(this).val());
  });

  let finalString = array.join(',');
  return finalString;
}

// https://image.tmdb.org/t/p/original (movie poster link)

$("#movie-form").submit(function(event){
  event.preventDefault();
  let genresString = getFinalSelections("genres")
  let keywordsString = getFinalSelections("keywords");
  MovieFinder.makeMovieCall(genresString,keywordsString)
    .then(function(response) {
      getMovies(response);
    });
});

//Utiliy function for keywords to add +
