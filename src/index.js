import $ from 'jquery';
import { MovieFinder } from './js/movie-service.js';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';


sessionStorage.setItem('keywordFirstClick', "true");

function makeButton(div, value, text) {
  let match = false;
  div.children().each(function() {
    if (this.value === value.toString()) {
      match = true;
    }
  });
  if (!match) {
    div.append(`
        <button class="btn btn-success tag-btn" type="button" value="${value}">${text} <span class="tag-btn-x">X</span></button>
      `);
  }
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
    MovieFinder.getCastID(cast.val())
    .then(function(response) {
      if (response instanceof Error) {
        throw response;
      } else if (response.results.length === 0) {
        throw Error("no results");
      } else {
        makeButton($("#selected-cast-members"), response.results[0].id, response.results[0].name);
        cast.val("");
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
  }
});

$("#selected-cast-members").on("click", "button", function() {
  $(this).remove();
});

$("#add-keyword").on("click", () => {
  let keyword = $("#input-keyword").val().toLowerCase();
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
          $("#input-keyword").prop("disabled", true);
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
      $("#input-keyword").prop("disabled", false);
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
      displayResults(response);
    } else {
      //console.log("No results found.");
      $("#no-results").show();
    }
  } else {
    console.log(`Error: ${response.message}`);
  }
}

function displayResults(response) {
  let carouselString = "";
  let movieInner = $("#movieInner");
  carouselString +=`<div class="carousel-item active"><div class="row justify-content-center">`;
  for (let i = 0; i < response.results.length; i++) {
    if (i % 5 === 0 && i !== 0) {
      carouselString +=`</div></div><div class="carousel-item"><div class="row justify-content-center">`;
    }
    carouselString +=`
    <div class="card col-2" id=${response.results[i].id}>
      <div class="card-body">Movie title: ${response.results[i].title}</div>
    </div>
    `;
  }
  carouselString +=`</div></div>`;
  movieInner.html(carouselString);
  $("#results").show();
}

function getFinalSelections(type) {
  let array = [];
  $(`#selected-${type}`).children().each(function() {
    array.push($(this).val());
  });
  let finalString = array.join(',');
  return finalString;
}

// https://image.tmdb.org/t/p/original (movie poster link)

// function getID(response) {
//   if (response.results) {
//     if (response.results.length > 0) {  
//       return response.results[0].id;  
//     } else {
//       console.log("No results found.");
//     }
//   } else {
//     console.log(`Error: ${response.message}`);
//   }

// }
//get cast from buttons adding in array
// function getIDsList(arrayStringCast){
  
//   let listIDs = arrayStringCast.map(function(castPerson) {
//     MovieFinder.getCastID(castPerson).then(function(response) {
//       return getID(response);
//       });
//   });
//   return listIDs;
// }

$("#movie-form").submit(function(event){
  event.preventDefault();
  let genresString = getFinalSelections("genres")
  let keywordsString = getFinalSelections("keywords");
  let castString = getFinalSelections("cast-members");
  $("#no-results").hide();
  $("#results").hide();
  MovieFinder.makeMovieCall(genresString,keywordsString, castString)
    .then(function(response) {
      getMovies(response);
    });
  
});

