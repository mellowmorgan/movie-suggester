import $ from 'jquery';
import GenreFinder from './js/genreFinder.js';
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
    if ($("#add-keyword").css("--first-click") === "true") {
      //API CALL

      let json = {
        "page": 1,
        "results": [
          {
            "id": 9951,
            "name": "alien"
          },
          {
            "id": 4939,
            "name": "alien phenomenons"
          },
          {
            "id": 10158,
            "name": "alien planet"
          },
          {
            "id": 14909,
            "name": "alien invasion"
          },
          {
            "id": 15250,
            "name": "alien infection"
          },
          {
            "id": 12553,
            "name": "alien abduction"
          },
          {
            "id": 160515,
            "name": "alien contact"
          },
          {
            "id": 163488,
            "name": "human alien"
          },
          {
            "id": 162459,
            "name": "alien language"
          },
          {
            "id": 163252,
            "name": "alien race"
          },
          {
            "id": 163386,
            "name": "alien possession"
          },
          {
            "id": 183787,
            "name": "alien monster"
          },
          {
            "id": 190042,
            "name": "alien world"
          },
          {
            "id": 193907,
            "name": "evil alien"
          },
          {
            "id": 218016,
            "name": "alien autopsy"
          },
          {
            "id": 220392,
            "name": "alien parasites"
          },
          {
            "id": 197194,
            "name": "alien friendship"
          },
          {
            "id": 200099,
            "name": "space alien"
          },
          {
            "id": 206281,
            "name": "alien fugitive"
          },
          {
            "id": 209033,
            "name": "alien baby"
          }
        ],
        "total_pages": 2,
        "total_results": 39
      };
      makeKeywordSuggestions(json);
      $("#keyword-suggestions").slideToggle();
      $("#add-keyword").css("--first-click", "false");
    } else {
      console.log($("#add-keyword").css("--first-click"));
      console.log($("#keyword-suggestions :checked"));
      $("#keyword-suggestions :checked").each(function() {
        $("#selected-keywords").append(`
        <button class="btn btn-success tag-btn" type="button" value="${$(this).val()}">${$(this).parent().text()} <span class="tag-btn-x">X</span></button>
        `);
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
  GenreFinder.makeGenreCall(genresString)
    .then(function(response) {
      getMovies(response);
    });
});
