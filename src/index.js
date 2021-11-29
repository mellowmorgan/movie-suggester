import $ from 'jquery';
import GenreFinder from './js/genreFinder.js';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';

function getElements(response) {
  if (response.results) {
    if (response.results.length>0){  
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
let genres= ['16','80','27'];
let genresString = genres.join(',');
GenreFinder.makeGenreCall(genresString)
  .then(function(response) {
    getElements(response);
  });
