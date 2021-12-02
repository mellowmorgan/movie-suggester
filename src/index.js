import $ from 'jquery';
import { MovieFinder } from './js/movie-service.js';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import reel from './img/default.png';

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
        <button class="btn btn-danger tag-btn" type="button" value="${value}">&nbsp;&nbsp;${text} <span class="tag-btn-x">&nbsp;x</span></button>
      `);
  }
}

$("#reset").on("click", () => {
  $("#no-results").hide();
  $("#keyword-suggestions").slideToggle();
  $("#keyword-suggestions").html("");
  sessionStorage.setItem('keywordFirstClick', "true");
  $("#input-keyword").prop("disabled", false);
  $("#selected-genres").empty();
  $("#selected-keywords").empty();
  $("#selected-cast-members").empty();
  $("#selected-title").empty();
  $("#input-title").prop("disabled",false);
  $(`#genre option`).each(function() {
    if ($(this).prop("disabled") === true) {
      $(this).prop("disabled", false);
    }
  });
});

$("#add-title").on("click", () => {
  let movie = $("#input-title");
  if (movie.val() !== "") {
    MovieFinder.getMovieInfo(movie.val())
    .then(function(response) {
      if (response instanceof Error) {
        throw response;
      } else if (response.results.length === 0) {
        throw Error("no results");
      } else {
        makeButton($("#selected-title"), response.results[0].id, response.results[0].title);
        movie.val("");
        $("#input-title").prop("disabled", true);
      }
    })
    .catch(function(response) {
      if (response.message === "no results") {
        console.log("Error: no results");
        $("#input-title").val("");
      } else {
        console.log(`Error: ${response.message}`);
        $("#input-title").val("");
      }
    });
  }
});

$("#selected-title").on("click", "button", function() {
  $(this).remove();
  $("#input-title").prop("disabled", false);
});

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
  for (let i = 0; i < results.length; i++) {
    if (results[i].name === keyword) {
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
function modifyResults(results, selectedTitle) {
  let modifiedResults = [];
  results.forEach(function(movie) {
    if (movie.id.toString() !== selectedTitle) {
      modifiedResults.push(movie);
    }
  });
  return modifiedResults;
}

function getMovies(response, selectedTitle) {
  if (response.results) {
    if (response.results.length > 0) { 
      let results;
      if (selectedTitle !== "") {
        results = modifyResults(response.results,selectedTitle);
      } else {
        results = response.results;
      }
      displayResults(results);
    } else {
      $("#no-results").show();
    }
  } else {
    console.log(`Error: ${response.message}`);
  }
}

function displayResults(results) {
  let carouselString = "";
  let movieInner = $("#movie-inner");
  carouselString +=`<div class="carousel-item active"><div class="row justify-content-center">`;
  for (let i = 0; i < results.length; i++) {
    if (i % 3 === 0 && i !== 0) {
      carouselString +=`</div></div><div class="carousel-item"><div class="row justify-content-center">`;
    }
    let posterPath = "";
    if (results[i].poster_path === null) {
      posterPath = reel;
    } else {
      posterPath = `https://image.tmdb.org/t/p/original/${results[i].poster_path}`;
    }
    let releaseDate="";
    if(results[i].release_date && results[i].release_date !== ""){
      releaseDate =`(${results[i].release_date.slice(0, 4)})`;
    } else {
      releaseDate = "";
    }
    carouselString +=`
      <div class="card col-3 flip-card" id=${results[i].id}>
          <div class="flip-card-inner">
            <div class="card-body flip-card-front">
            <img src="${posterPath}" class="movie-poster" alt="${results[i].title}">
            </div>
            <div class="card-body flip-card-back">
            <h5 class="card-title">${results[i].title} ${releaseDate}</h5>
            <p class="description">${results[i].overview}</p>
            </div>
          </div>
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

async function getAttributes(id,genresStr, keywordsStr,castStr) {
if (id !== "") {
  let first = true;
  MovieFinder.getMovieByID(id)
    .then(function(response) {
      if (response instanceof Error || !response.genres) {
        throw response;
      } else {
        response.genres.forEach(function(genre) {
          if (first === true && genresStr !== "") {
            genresStr += "&" + (genre.id);
          } else {
            genresStr += "|" + (genre.id);
          }
          first = false;
        });
      }
      return MovieFinder.getCredits(id)
    })
    .then(function(response) {
      if (response instanceof Error || !response.cast) {
        throw response;
      } else {
        first = true;
        response.cast.forEach(function(member) {
          if (first === true && castStr !== "") {
            castStr += "&" + (member.id);
          } else {
            castStr += "|" + member.id;
          }
          first = false;
        });
        
      }
      return MovieFinder.getKeywords(id);
    })
    .then(function(response) {
      if (response instanceof Error || !response.keywords) {
        throw response;
      } else {
        first = true;
        response.keywords.forEach(function(keyword) {
          if (first === true && keywordsStr !== "") {
            keywordsStr += "&" + keyword.id;
          } else {
            keywordsStr += "|" + keyword.id;
          }
          first = false;
        });
      }
      return MovieFinder.makeMovieCall(genresStr,keywordsStr,castStr)
    })
    .then(function(response) {
      getMovies(response, id);
    })  
    .catch(function(response) {
      console.log(`Error: ${response.message}`);
    });
  } else {
    MovieFinder.makeMovieCall(genresStr,keywordsStr,castStr)
    .then(function(response) {
      getMovies(response,id);
    })  
    .catch(function(response) {
      console.log(`Error: ${response.message}`);
    });
  }
}

$("#movie-form").submit(function(event) {
  event.preventDefault();
  let genresString = getFinalSelections("genres");
  let keywordsString = getFinalSelections("keywords");
  let castString = getFinalSelections("cast-members");
  let similarTitle = getFinalSelections("title");
  let arrayOfAttr = getAttributes(similarTitle,genresString, keywordsString,castString);
  $("#no-results").hide();
  $("#results").hide(); 
});
